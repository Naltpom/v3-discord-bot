class Regex
{
    /**
     * @param {string} string
     */
    static isValidURL(string) {
        const res = string.match(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g);
        return (res !== null)
    };
}

module.exports = Regex;