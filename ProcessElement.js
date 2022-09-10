import fs from 'fs'
import logger from '@condor-labs/logger'

export default class ProcessElement {

    constructor() {
        this.positionOfFile = `${process.cwd()}/readfiles`
        this.filesPosition = []
        this.relationNameFile = [];
        this.generalData = [] 
    }

    startProcess() {
        logger.info('start - read dir')

        this.filesPosition = fs.readdirSync(this.positionOfFile)

        this.relationNameFile = this.filesPosition.filter(e => e.split('.')[1] == 'txt')
                            .map(e => {

                                return {
                                    nameOfStudent:fs.readFileSync(`${this.positionOfFile}/${e}`,'utf8')
                                                                    .split('\n')[0]
                                                                    .split('(')[0]
                                                                    .split(':')[1]
                                                                    .trim(),
                                    nameOfFile:e.split('.')[0]
                                }                               
                            })
    }

    verifyContentOfFile() {
        this.relationNameFile.map(e => {
            const filesOfThisName = this.filesPosition.filter(fps => {
                return fps.includes(e.nameOfFile) && fps.split('.')[1] !== 'txt'
            }).map(e => {
                return {
                    nameOfFile:e,
                    sizeOfFile: (fs.statSync(`${this.positionOfFile}/${e}`).size)/(1024*1000) + ' MB'
                }
            })

            this.generalData.push({...e,file:filesOfThisName})
        })
    }

    decideSituation() {
        console.log(this.generalData)
    }


}