import Exception from './Exception'
/**
 * Custom Error class of type Exception.
 */
export default class ArgumentException extends Exception {
  static kind = 'ArgumentException'
}
