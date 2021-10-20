require('dotenv-flow').config({silent: true});
const fs = require('fs');
const { Client: notionClient } = require('@notionhq/client');
const env = process.env;
const { MessageEmbed  } = require("discord.js");
const Get = require('../sequelize/get');
const Logger = require('../logger/logger');
const db = require('../../config/db.config');
const moment = require('moment');
class NotionHandler
{
    static async handle(client)
    {
        try {
            const notion = new notionClient({auth:env.NOTION_API_KEY});
            const database_id = env.NOTION_DATABASE_ID;
            const guild = await client.guilds.cache.get(env.SERVER);
            await notion.databases.query({
                database_id: database_id,
                sorts: [
                    {
                        property: 'Date',
                        direction: 'ascending'
                    }
                ]
            }).then((async res => {
                res.results.map(async item => {
                    const {Ready, Collection, TYPE, Description, Author, Date: dateCreated} = item.properties;

                    if (
                        !Ready.checkbox 
                        || Author.title.length <= 0 
                        || Description.rich_text.length <= 0 
                        || TYPE.select === null 
                        || Collection.multi_select.length <= 0 
                        || item.properties['Lien de la page'].rich_text.length <= 0 
                        || moment(dateCreated.created_time).isBefore(moment().add(-3, 'days'))
                    ) return;

                    const page_id = item.id;
                    const existed = await Get.item(db.Notion, {where: {slug: page_id}}).then(item => {
                        if (item) {
                            return true
                        }
                        db.Notion.create({slug: page_id});
                        return false
                    })
        
                    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
                    if (existed) return;
                    const embed = new MessageEmbed()
                        .setColor(randomColor)
                        .setTitle(`An update has been made on notion, check it out!`)
                        .setURL(item.properties['Lien de la page'].rich_text[0].plain_text)
                        .addFields(
                            {name: 'Collection', value: Collection.multi_select[0].name, inline: true},
                            {name: 'Type', value: TYPE.select.name, inline: true},
                            {name: 'Description', value: Description.rich_text[0].plain_text},
                            {name: 'Author', value: Author.title[0].plain_text, inline: true},
                            {name: 'Date', value: moment(dateCreated.created_time).format('LL'), inline: true}
                        )
                    ;
        
                    const channelId = await Get.item(db.Channel, {where: {slug: 'notion', guild: guild.id}}).then(i => {return i.dataValues._id ?? ''}).catch(e => Logger.log('error', e.message, 'bot'));
        
                    client.channels.cache.get(channelId.toString()).send({embeds: [embed]});
                })    
            }));
        } catch (err) {
            console.log(`Something Went Wrong => ${err}`)
            Logger.log('error',`{Class: CronCr, function: lead(), Something Went Wrong => ${err}} `, 'Cron', err)
        }
    }
}

module.exports = NotionHandler;