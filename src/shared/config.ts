/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

config({
  path: '.env'
})

// Check file .env is exist
if (!fs.existsSync(path.resolve('.env'))) {
  console.error('File .env is not exist')
  process.exit(1)
}

class ConfigSchema {
  @IsString()
  POST: string

  @IsString()
  DATABASE_URL: string

  @IsString()
  ACCESS_TOKEN_SECRET: string

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string

  @IsString()
  REFRESH_TOKEN_SECRET: string

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true
})
const error = validateSync(configServer)

if (error.length > 0) {
  const errors = error.map((err) => ({
    property: err.property,
    constraints: err.constraints,
    value: err.value
  }))
  throw errors
}

const envConfig = configServer

export default envConfig
