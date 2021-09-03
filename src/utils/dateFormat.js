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

        const days = { 0: 'Dimanche', 1: 'Lundi', 2: 'Mardi', 3: 'Mercredi', 4: 'Jeudi', 5: 'Vendredi', 6: 'Samedi' }
        let day = days[date.getDay()]

        const months = { 0: 'Janvier', 1: 'Février', 2: 'Mars', 3: 'Avril', 4: 'Mai', 5: 'Juin', 6: 'Juillet', 7: 'Aout', 8: 'Septembre', 9: 'Octobre', 10: 'Novembre', 11: 'Decembre'}
        let month = months[date.getMonth()]

        return `${day} ${date.getDate()} ${month} ${date.getFullYear()}`;
    }

    static now()
    {
        const date = new Date()

        const curr_date = date.getDate().toString().padStart(2, '0');
        const curr_month = date.getMonth().toString().padStart(2, '0');
        const curr_year = date.getFullYear().toString().padStart(2, '0');
        const curr_hour = date.getHours().toString().padStart(2, '0');
        const curr_min = date.getMinutes().toString().padStart(2, '0');

        const dateFormated = `${curr_date}/${curr_month}/${curr_year} à ${curr_hour}:${curr_min}`;

        return dateFormated
    }
}

module.exports = DateFormat;