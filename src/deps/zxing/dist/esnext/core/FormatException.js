import Exception from './Exception'
/**
 * Custom Error class of type Exception.
 */
export default class FormatException extends Exception {
  static kind = 'FormatException'
  static getFormatInstance() {
    return new FormatException()
  }
}
