export enum ActionType {
  ALL = 'ALL',
  READ = 'READ', // Represents all requests that read information from the system
  WRITE = 'WRITE', // Represents all requests that persist or update information in the system
  LIST = 'LIST', // Represents requests that retrieve more general information
  GET_ONE = 'GET_ONE', // Represents requests that retrieve specific information
  CREATE = 'CREATE', // Represents requests that create a new information in the system
  UPDATE = 'UPDATE', // Represents requests that update existing information in the system
  DELETE = 'DELETE', // Represents requests that delete information from the system
}
