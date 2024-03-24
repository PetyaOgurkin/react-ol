export const normalizeGreyscale = (value: number, formula: any): any => {
    if (Array.isArray(formula)) {
        switch (formula[0]) {
            case "/":
                return normalizeGreyscale(value, formula[1]) / normalizeGreyscale(value, formula[2]);
            case "*":
                return normalizeGreyscale(value, formula[1]) * normalizeGreyscale(value, formula[2]);
            case "+":
                return normalizeGreyscale(value, formula[1]) + normalizeGreyscale(value, formula[2]);
            case "-":
                return normalizeGreyscale(value, formula[1]) - normalizeGreyscale(value, formula[2]);

            case "band":
                return value / 255;
        }
    }
    return formula;
};
