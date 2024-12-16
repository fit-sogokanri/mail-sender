/**
 * Display a question and read input from stdin.
 * @param {string}question
 * @return {Promise<string>}
 */
export const read_input = (question: string): Promise<string> =>{
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        readline.question(question, (answer: string) => {
            resolve(answer);
            readline.close();
        });
    });
}