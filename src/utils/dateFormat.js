class DateFormat
{
    /**
     * @param {date} date
     */
    static format(date)
    {
        if (date instanceof Date && isNaN(date)) {
            throw new Error('Parameter date is not valid Date!')
        }
        console.log(date)
        const days = { 0: 'Dimanche', 1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi' }
        let day = days[date.getDay()]

        const months = { 0: 'Janvier', 1: 'Février', 2: 'Mars', 3: 'Avril', 4: 'Mai', 5: 'Juin', 6: 'Juillet', 7: 'Aout', 8: 'Septembre', 9: 'Octobre', 10: 'Novembre', 11: 'Decembre'}
        let month = months[date.getMonth()]

        return `${day} ${date.getDate()} ${month} ${date.getFullYear()}`;
    }
}

module.exports = DateFormat;