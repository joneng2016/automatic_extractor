import fs from 'fs'
import logger from '@condor-labs/logger'

export default class ProcessElement {

    constructor() {
        this.positionOfFile = `${process.cwd()}/readfiles`
        this.filesPosition = []
        this.relationNameFile = [];
        this.generalData = []
        this.documentContent = '' 
    }

    startProcess() {
        logger.info('start - read dir')

        this.filesPosition = fs.readdirSync(this.positionOfFile)

        this.relationNameFile = this.filesPosition.filter(e => e.split('.')[1] == 'txt')
                            .map(e => {

                                return {
                                    nameOfStudent: this._contentOfFile(e)
                                                            .split('\n')[0]
                                                            .split('(')[0]
                                                            .split(':')[1]
                                                            .trim(),
                                    nameOfFile:e.split('.')[0],
                                    contentOfTxtFile:this._contentOfFile(e)
                                }                               
                            })
    }

    verifyContentOfFile() {
        logger.info('Verify content of file')

        this.relationNameFile.map(e => {
            const filesOfThisName = this.filesPosition.filter(fps => {
                return fps.includes(e.nameOfFile) && fps.split('.')[1] !== 'txt'
            }).map(e => {
                return {
                    nameOfFile:e,
                    sizeOfFile: (fs.statSync(`${this.positionOfFile}/${e}`).size)/(1024*1000)
                }
            })

            this.generalData.push({...e,file:filesOfThisName})
        })
    }

    decideSituation() {
        logger.info('Decide situation of each student')
        
        this.generalData.forEach(e => {
            let lineFile = `${e.nameOfStudent},`

            if (e.file.length > 0) {
                lineFile += `1\n`
            } else {
                lineFile += `ponto-atencao:\n\n${e.contentOfTxtFile}\n`
            }

            this.documentContent += lineFile
        })
        console.log(this.documentContent)
    }

    _contentOfFile(e) {
        return fs.readFileSync(`${this.positionOfFile}/${e}`,'utf8')
    }

}