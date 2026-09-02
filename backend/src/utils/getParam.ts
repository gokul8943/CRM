export const getParam = (
    param: string | string[] | undefined
): string => {
    if (Array.isArray(param)) {
        return param[0];
    }

    if (!param) {
        throw new Error('Required route parameter is missing');
    }

    return param;
};