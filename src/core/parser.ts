export class Parser {
    private pattern: string;

    constructor(pattern: string) {
        this.pattern = pattern;
    }

    private tokenize(): ParserToken {
        let regex = this.pattern;
        let params: string[] = [];
        let tokenRegex = /.*/;
        let tokenMatches: RegExpMatchArray | null;

        // groups: ()

        tokenRegex = /\(.*?\)/gi;
        tokenMatches = this.pattern.match(tokenRegex);

        if (tokenMatches) {
            for (let i = 0; i < tokenMatches.length; i++) {
                let match = tokenMatches[i];
                let replacement = match;
                replacement = replacement.replace("(", "(?:");
                regex = regex.replace(match, replacement);
            }
        }

        // optional groups: []

        tokenRegex = /\s*\[.*?\]/gi;
        tokenMatches = this.pattern.match(tokenRegex);

        if (tokenMatches) {
            for (let i = 0; i < tokenMatches.length; i++) {
                let match = tokenMatches[i];
                let leadingWhitespace = /^\s/.test(match);
                let replacement = match;
                if (leadingWhitespace) {
                    replacement = replacement.replace(/\s*\[/, "(?:\\s+(?:");
                    replacement = replacement.replace("]", "))?");
                } else {
                    replacement = replacement.replace("[", "(?:");
                    replacement = replacement.replace("]", ")?");
                }
                regex = regex.replace(match, replacement);
            }
        }

        // parameters: :param

        tokenRegex = /\s*:[-_a-zA-Z0-9]+/gi;
        tokenMatches = this.pattern.match(tokenRegex);

        if (tokenMatches) {
            for (let i = 0; i < tokenMatches.length; i++) {
                let match = tokenMatches[i];
                let leadingWhitespace = /^\s/.test(match);
                let replacement = "";
                if (leadingWhitespace) {
                    replacement = "\\s+(.*)";
                } else {
                    replacement = "(.*)";
                }
                regex = regex.replace(match, replacement);

                let paramName = match.replace(":", "").replace(" ", "");
                params.push(paramName);
            }
        }

        // whitespace

        regex = regex.replace(/ /g, "\\s+");
        regex = "^" + regex + "$";

        return {
            regex: new RegExp(regex, "i"),
            params: params
        }
    }

    match(input: string): ParserMatchResult {
        let tokenized = this.tokenize();
        let params: any = {};
        let matching = tokenized.regex.test(input);

        if (matching) {
            params.input = input;
            if (tokenized.params.length > 0) {
                let match = tokenized.regex.exec(input);
                if (match) {
                    for (let i = 0; i < tokenized.params.length; i++) {
                        params[tokenized.params[i]] = match[i + 1];
                    }
                }
            }
        }

        return {
            input: input,
            pattern: this.pattern,
            regex: tokenized.regex,
            matching: matching,
            params: params
        }
    }
}

export interface ParserConfig {
    pattern: string,
    command: ParserCommand
}

export interface ParserToken {
    regex: RegExp;
    params: string[];
}

export interface ParserMatchResult {
    input: string;
    pattern: string;
    regex: RegExp;
    matching: boolean;
    params: { [name: string]: string };
}

export type ParserCommand = (player: any, params: { [key: string]: string }) => any;
