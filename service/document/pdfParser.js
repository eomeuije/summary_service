const fs = require('fs');
const pdf2json = require('pdf2json');

const pdfParser = {
    parsePdfToText : async (file) => {
        return await new Promise((resolve, reject) => {
            const pdfParser = new pdf2json();
            
            pdfParser.on('pdfParser_dataError', (err) => {
                reject(err.parserError);
            });
    
            pdfParser.on('pdfParser_dataReady', (pdfData) => {
                const pagesText = pdfData.Pages.map((page, index) => {
                    const pageText = page.Texts.map((textItem) => {
                        return decodeURIComponent(textItem.R[0].T);
                    }).join(' ');
    
                    return {
                        page: index + 1,
                        text: pageText.trim()
                    };
                });
    
                resolve(pagesText);
            });
    
            pdfParser.loadPDF(file);
        });
    }
}


module.exports = pdfParser;