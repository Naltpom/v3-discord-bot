class UcFirst
{
    /**
     * @param {string} string
     */
    static format(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

module.exports = UcFirst;