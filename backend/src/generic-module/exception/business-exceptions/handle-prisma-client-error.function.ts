import { PrismaException } from './prisma.exception';

export function handlePrismaClientError(error: any): never {
  switch (error.code) {
    case 'P1000':
      throw new PrismaException(
        `Authentication failed against database server at ${error.meta?.database_host}. Please make sure to provide valid database credentials.`,
      );
    case 'P1001':
      throw new PrismaException(
        `Can't reach database server at ${error.meta?.database_host}:${error.meta?.database_port}. Please make sure your database server is running.`,
      );
    case 'P1002':
      throw new PrismaException(
        `The database server at ${error.meta?.database_host}:${error.meta?.database_port} was reached but timed out. Please try again later.`,
      );
    case 'P1003':
      throw new PrismaException(
        `Database does not exist at ${error.meta?.database_file_path}.`,
      );
    case 'P1008':
      throw new PrismaException(
        `Operations timed out after ${error.meta?.time}.`,
      );
    case 'P1009':
      throw new PrismaException(
        `Database ${error.meta?.database_name} already exists on the database server.`,
      );
    case 'P1010':
      throw new PrismaException(
        `User ${error.meta?.database_user} was denied access to the database ${error.meta?.database_name}.`,
      );
    case 'P1011':
      throw new PrismaException(
        `Error opening a TLS connection: ${error.meta?.message}.`,
      );
    case 'P1012':
      throw new PrismaException(
        `Error in schema validation: ${error.meta?.full_error}.`,
      );
    case 'P1013':
      throw new PrismaException(`The provided database string is invalid.`);
    case 'P1014':
      throw new PrismaException(
        `The underlying ${error.meta?.kind} for model ${error.meta?.model} does not exist.`,
      );
    case 'P1015':
      throw new PrismaException(
        `Your Prisma schema is using features not supported by the database version.`,
      );
    case 'P1016':
      throw new PrismaException(
        `Your raw query had an incorrect number of parameters.`,
      );
    case 'P1017':
      throw new PrismaException(`Server has closed the connection.`);
    case 'P2000':
      throw new PrismaException(
        `The provided value for the column is too long. Column: ${error.meta?.element_input_name}`,
      );
    case 'P2001':
      throw new PrismaException(`The record searched for does not exist.`);
    case 'P2002':
      throw new PrismaException(
        `Unique constraint failed on the ${error.meta?.target}.`,
      );
    case 'P2003':
      throw new PrismaException(
        `Foreign key constraint failed on the field: ${error.meta?.field_name}.`,
      );
    case 'P2004':
      throw new PrismaException(`A constraint failed on the database.`);
    case 'P2005':
      throw new PrismaException(
        `The value stored in the database is invalid for the field's type.`,
      );
    case 'P2006':
      throw new PrismaException(
        `The provided value for the field is not valid.`,
      );
    case 'P2007':
      throw new PrismaException(
        `Data validation error: ${error.meta?.database_error}.`,
      );
    case 'P2008':
      throw new PrismaException(`Failed to parse the query.`);
    case 'P2009':
      throw new PrismaException(`Failed to validate the query.`);
    case 'P2010':
      throw new PrismaException(
        `Raw query failed. Message: ${error.meta?.message}`,
      );
    case 'P2011':
      throw new PrismaException(
        `Null constraint violation on the ${error.meta?.constraint}.`,
      );
    case 'P2012':
      throw new PrismaException(`Missing a required value.`);
    case 'P2013':
      throw new PrismaException(`Missing the required argument for field.`);
    case 'P2014':
      throw new PrismaException(
        `The change you are trying to make would violate a required relation.`,
      );
    case 'P2015':
      throw new PrismaException(`A related record could not be found.`);
    case 'P2016':
      throw new PrismaException(`Query interpretation error.`);
    case 'P2017':
      throw new PrismaException(`The records for relation are not connected.`);
    case 'P2018':
      throw new PrismaException(
        `The required connected records were not found.`,
      );
    case 'P2019':
      throw new PrismaException(`Input error.`);
    case 'P2020':
      throw new PrismaException(`Value out of range for the type.`);
    case 'P2021':
      throw new PrismaException(
        `The table does not exist in the current database.`,
      );
    case 'P2022':
      throw new PrismaException(
        `The column does not exist in the current database.`,
      );
    case 'P2023':
      throw new PrismaException(
        `Inconsistent column data: ${error.meta?.message}.`,
      );
    case 'P2024':
      throw new PrismaException(
        `Timed out fetching a new connection from the connection pool.`,
      );
    case 'P2025':
      throw new PrismaException(
        `An operation failed because it depends on one or more records that were required but not found.`,
      );
    case 'P2026':
      throw new PrismaException(
        `The current database provider doesn't support a feature that the query used.`,
      );
    case 'P2027':
      throw new PrismaException(
        `Multiple errors occurred on the database during query execution.`,
      );
    case 'P2028':
      throw new PrismaException(`Transaction API error: ${error.meta?.error}`);
    case 'P2029':
      throw new PrismaException(
        `Query parameter limit exceeded: ${error.meta?.message}`,
      );
    case 'P2030':
      throw new PrismaException(
        `Cannot find a fulltext index to use for the search.`,
      );
    case 'P2031':
      throw new PrismaException(
        `Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set.`,
      );
    case 'P2033':
      throw new PrismaException(
        `A number used in the query does not fit into a 64 bit signed integer.`,
      );
    case 'P2034':
      throw new PrismaException(
        `Transaction failed due to a write conflict or a deadlock.`,
      );
    case 'P2035':
      throw new PrismaException(`Assertion violation on the database.`);
    case 'P2036':
      throw new PrismaException(
        `Error in external connector (id: ${error.meta?.id}).`,
      );
    case 'P2037':
      throw new PrismaException(`Too many database connections opened.`);
    default:
      throw new PrismaException(`An unknown error occurred: ${error.message}`);
  }
}
