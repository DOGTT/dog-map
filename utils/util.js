const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

const getShortAddress = (address) => {
    address = address.replace(/^.+?(省|市)/, '');
    if (!address) return '';
    // 如果地址长度超过10个汉字，截取前10个汉字并添加省略号
    if (address.length > 10) {
        return address.substring(0, 10) + '...';
    }
    return address;
}

module.exports = {
    formatTime,
    formatNumber,
    getShortAddress
}



