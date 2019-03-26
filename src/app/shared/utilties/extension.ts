

interface String {
    toLower: () => string;
    toUpper: () => string;
    trim: () => string;
    trimLeft: () => string;
    trimRight: () => string;
    capFirst: () => string;
    titleCase: () => string;
    truncateWords: (number: number) => string;
    truncateWordsWithHtml: (number: number) => string;
    stripHtml: () => string;
    escapeHtml: () => string;
    toBool: () => boolean;
    contains: (val: string) => boolean;
    slugify: (lower?: boolean) => string;
    toPhoneNumber: () => string;
    getValueByKey: (key: string) => string;
    setValueByKey: (key: string, replacement: string) => string;
    isNullOrEmpty: () => boolean;
    startWith: (part: string) => boolean;
    endWith: (value: string) => boolean;
    toJSON: () => object;

}
String.prototype.toLower = function (): string {
    return this.toLowerCase();
};

String.prototype.toUpper = function (): string {
    return this.toUpperCase();
};

String.prototype.trim = function (): string {
    return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.trimLeft = function (): string {
    return this.replace(/^\s+/, "");
};

String.prototype.trimRight = function (): string {
    return this.replace(/\s+$/, "");
};

String.prototype.startWith = function (part: string): boolean {
    return this.slice(0, part.length) == part;
};

String.prototype.endWith = function (value: string): boolean {
    return this.slice(value.length) == value;
};



// String.prototype.normalize = function (): string {
//     return this.replace(/^\s*|\s(?=\s)|\s*$/g, "");
// };




String.prototype.capFirst = function (): string {
    if (this.length == 1) {
        return this.toUpperCase();
    }
    else if (this.length > 0) {
        let regex: RegExp = /^(\(|\[|"|')/;
        if (regex.test(this)) {
            return this.substring(0, 2).toUpperCase() + this.substring(2);
        }
        else {
            return this.substring(0, 1).toUpperCase() + this.substring(1);
        }
    }
    return null;
};

String.prototype.titleCase = function (): string {
    let regexp: RegExp = /\s/;
    let words = this.split(regexp);
    if (words.length == 1) {
        return words[0].capFirst();
    }
    else if (words.length > 1) {
        let result: string = '';
        for (let i = 0; i < words.length; i++) {
            if (words[i].capFirst() !== null) {
                result += words[i].capFirst() + ' ';
            }
        }
        result.trim();
        return result;
    }
    return null;
};

String.prototype.truncateWords = function (num: number): string {
    let words: Array<string> = this.split(/\s+/);
    if (words.length > num) {
        return words.slice(0, num).join(' ');
    }
    return words.join(' ');
};

String.prototype.truncateWordsWithHtml = function (num: number): string {
    let tags: Array<string> = [];
    let truncation: string = this.truncateWords(num);
    let matches: RegExpMatchArray = truncation.match(/<[\/]?([^> ]+)[^>]*>/g);
    for (let i: number = 0; i < matches.length; i++) {
        let opening: string = matches[i].replace('/', '');
        if (matches[i].indexOf('/') != -1 && tags.indexOf(opening) != -1) {
            (<any>tags).remove(opening);
        }
        else if (matches[i].indexOf('/') != -1) {
            continue;
        }
        else {
            tags.push(matches[i]);
        }
    }
    for (let i: number = 0; i < tags.length; i++) {
        truncation += tags[i].replace('<', '</').replace(/(\s*)(\w+)=("[^<>"]*"|'[^<>']*'|\w+)/g, '');
    }
    return truncation;
};

String.prototype.stripHtml = function (): string {
    let content: string = this.replace(/<[\/]?([^> ]+)[^>]*>/g, '');
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/ig, '');
    content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/ig, '');
    content = content.replace(/<!--[\s\S]*?-->/g, '');
    content = content.replace('&nbsp;', ' ');
    content = content.replace('&amp;', '&');
    return content;
};

String.prototype.escapeHtml = function (): string {
    let content: string = this.replace(/"/g, '&quot;');
    content.replace(/&(?!\w+;)/g, '&amp;');
    content.replace(/>/g, '&gt;');
    content.replace(/</g, '&lt;');
    return content;
};

String.prototype.toBool = function (): boolean {
    if ((<any>String).isNullOrEmpty(this)) {
        return false;
    }
    else if (this.lower() === "true" || this.lower() === "1" || this.lower() === "y" || this.lower() === "t") {
        return true;
    }
    return false;
};

String.prototype.contains = function (val: string): boolean {
    if (this.indexOf(val) !== -1) {
        return true;
    }
    return false;
};

String.prototype.slugify = function (lower: boolean = true): string {
    if (!lower) {
        return this.lower().normalize().replace(/[^a-z0-9]/gi, '-');
    }
    return this.normalize().replace(/[^a-z0-9]/gi, '-');
};

// //toPhoneNumber() needs to be a part of some validation mechanism, and needs to be improved a great deal.
String.prototype.toPhoneNumber = function (): string {
    try {
        return this.substring(0, 3) + '-' + this.substring(3, 6) + '-' + this.substring(6);
    }
    catch (e) {
        return this;
    }
};

String.prototype.getValueByKey = function (key: string): string {
    var collection: Array<string> = this.split(";");
    for (let i = 0; i < collection.length; i++) {
        if (collection[i].contains(":")) {
            let pairs = collection[i].split(":");
            if (pairs[0] == key) {
                return pairs[1];
            }
        }
    }
    return null;
};

String.prototype.setValueByKey = function (key: string, replacement: string): string {
    var collection: Array<string> = this.split(";");
    var returnCollection: Array<string> = [];
    for (let i = 0; i < collection.length; i++) {
        if (collection[i].contains(":")) {
            let pairs = collection[i].split(":");
            if (pairs[0] == key) {
                pairs[1] = replacement;
            }
            returnCollection.push(pairs.join(":"));
        }
    }
    return returnCollection.join(';');
};

String.prototype.isNullOrEmpty = function (): boolean {
    if (this === undefined || this === null || this.trim() === '') {
        return true;
    }
    return false;
};

String.prototype.toJSON = function (): object {
    return JSON.parse(this);
};

/*
 * Remember that Number extensions require the number to be in () or use the .. syntax:
 * (1).toBool()
 * 1..toBool()
 */

interface Number {
    toBool: () => boolean;
    random: (min: number, max: number) => number;
    thousandsSeparator: (seperator: string) => string;
    round: (decimals: number) => number
    millionsToBillions: () => string;
}

Number.prototype.toBool = function (): boolean {
    if (this === 0) {
        return false;
    }
    return true;
};

(<any>Number).random = function (min: number, max: number): number {
    if (isNaN(min) || isNaN(max)) {
        throw 'Error: Only numbers are accepted as arguments.';
    }
    //There are issues with base 8 versus base 10 in some instances, so force it to use base 10.
    return Math.floor(Math.random() * (parseInt(max.toString(), 10) - parseInt(min.toString(), 10) + 1) + parseInt(min.toString(), 10));
};

Number.prototype.thousandsSeparator = function (seperator: string = ','): string {
    let retVal = '';
    if (isNaN(this)) {
        return this;
    }
    // split the string with decimal(.) to seperate
    let num_parts = this.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, seperator);

    // Remove the trailing zero from decimal part 
    if (num_parts[1] && num_parts[1].length > 0) {
        num_parts[1] = parseFloat(num_parts[1]);
    }

    // format the decimal part 
    if (num_parts[1] && num_parts[1].length > 3) {
        num_parts[1] = num_parts[1].replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
    }
    retVal = num_parts.join(".");
    return retVal;
};

Number.prototype.round = function (decimals: number): number {
    if (isNaN(this)) {
        return this;
    }
    if (!decimals) {
        decimals = 0;
    }
    let value: any = this;
    let retval = Number(value.toFixed(decimals));
    return retval;
};

Number.prototype.millionsToBillions = function (): string {
    let retVal = '';
    if (isNaN(this)) {
        return this;
    }
    let value = this;
    if (this > 1000) {
        value = (this / 1000).round(2)
        retVal = `${value} B`
    }
    else {
        retVal = `${value} M`
    }
    return retVal;
};

/*
 * Extension methos for Date type:
  
 */


interface Date {
    toyyyymmdd: () => string;
    toyyyymmddhhmmss: () => string;
    daysDifference: (date?: Date) => number;
    addMonths: (months: number) => Date;
    withoutTime:()=> Date;

}
Date.prototype.toyyyymmdd = function (): string {
    let _retVal: string = null;
    if (this != null) {
        let date = new Date(Date.parse(this));
        _retVal = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
    return _retVal;
};

Date.prototype.toyyyymmddhhmmss = function (): string {
    let _retVal: string = null;
    if (this != null) {
        let date = new Date(Date.parse(this));
        _retVal = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        _retVal = _retVal + `T${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
    return _retVal;
};


Date.prototype.daysDifference = function (todate?: Date): number {
    let _retVal: number = 0;
    if (this != null) {
        if (!todate) {
            todate = new Date();
        }
        // get total seconds between two dates
        let date = new Date(Date.parse(this));
        _retVal = Math.round((date.getTime() - todate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return _retVal;
};

Date.prototype.addMonths = function (m) {
    var d = new Date(this);
    var years = Math.floor(m / 12);
    var months = m - (years * 12);
    if (years) d.setFullYear(d.getFullYear() + years);
    if (months) d.setMonth(d.getMonth() + months);
    return d;
}
Date.prototype.withoutTime = function () :Date{
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}



