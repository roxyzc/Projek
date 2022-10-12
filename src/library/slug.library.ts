export const slug = (text: string) => {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-.]+/g, '');
};

export const reverseSlug = (text: string) => {
    return text.replace(/-/g, ' ');
};
