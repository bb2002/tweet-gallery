import winston from "winston"
import winstonDaily from 'winston-daily-rotate-file'

const { combine, timestamp, printf } = winston.format
const logFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`
})

const Logger = winston.createLogger({
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        logFormat
    ),
    transports: [
        new winstonDaily({
            level: "info",
            datePattern: "YYYY-MM-DD",
            dirname: "logs",
            filename: '%DATE%.log',
            maxFiles: 30,
            zippedArchive: true
        }),
        new winstonDaily({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: "logs",
            filename: '%DATE%.log',
            maxFiles: 30,
            zippedArchive: true
        })
    ]
})

Logger.add(new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        logFormat
    )
}))

export default Logger