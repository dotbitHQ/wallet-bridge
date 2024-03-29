/*
 * Copyright 2007 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import IllegalArgumentException from '../../IllegalArgumentException'
export var ModeValues
;(function (ModeValues) {
  ModeValues[(ModeValues['TERMINATOR'] = 0)] = 'TERMINATOR'
  ModeValues[(ModeValues['NUMERIC'] = 1)] = 'NUMERIC'
  ModeValues[(ModeValues['ALPHANUMERIC'] = 2)] = 'ALPHANUMERIC'
  ModeValues[(ModeValues['STRUCTURED_APPEND'] = 3)] = 'STRUCTURED_APPEND'
  ModeValues[(ModeValues['BYTE'] = 4)] = 'BYTE'
  ModeValues[(ModeValues['ECI'] = 5)] = 'ECI'
  ModeValues[(ModeValues['KANJI'] = 6)] = 'KANJI'
  ModeValues[(ModeValues['FNC1_FIRST_POSITION'] = 7)] = 'FNC1_FIRST_POSITION'
  ModeValues[(ModeValues['FNC1_SECOND_POSITION'] = 8)] = 'FNC1_SECOND_POSITION'
  /** See GBT 18284-2000; "Hanzi" is a transliteration of this mode name. */
  ModeValues[(ModeValues['HANZI'] = 9)] = 'HANZI'
})(ModeValues || (ModeValues = {}))
/**
 * <p>See ISO 18004:2006, 6.4.1, Tables 2 and 3. This enum encapsulates the various modes in which
 * data can be encoded to bits in the QR code standard.</p>
 *
 * @author Sean Owen
 */
export default class Mode {
  value
  stringValue
  characterCountBitsForVersions
  bits
  static FOR_BITS = new Map()
  static FOR_VALUE = new Map()
  static TERMINATOR = new Mode(ModeValues.TERMINATOR, 'TERMINATOR', Int32Array.from([0, 0, 0]), 0x00) // Not really a mode...
  static NUMERIC = new Mode(ModeValues.NUMERIC, 'NUMERIC', Int32Array.from([10, 12, 14]), 0x01)
  static ALPHANUMERIC = new Mode(ModeValues.ALPHANUMERIC, 'ALPHANUMERIC', Int32Array.from([9, 11, 13]), 0x02)
  static STRUCTURED_APPEND = new Mode(
    ModeValues.STRUCTURED_APPEND,
    'STRUCTURED_APPEND',
    Int32Array.from([0, 0, 0]),
    0x03,
  ) // Not supported
  static BYTE = new Mode(ModeValues.BYTE, 'BYTE', Int32Array.from([8, 16, 16]), 0x04)
  static ECI = new Mode(ModeValues.ECI, 'ECI', Int32Array.from([0, 0, 0]), 0x07) // character counts don't apply
  static KANJI = new Mode(ModeValues.KANJI, 'KANJI', Int32Array.from([8, 10, 12]), 0x08)
  static FNC1_FIRST_POSITION = new Mode(
    ModeValues.FNC1_FIRST_POSITION,
    'FNC1_FIRST_POSITION',
    Int32Array.from([0, 0, 0]),
    0x05,
  )
  static FNC1_SECOND_POSITION = new Mode(
    ModeValues.FNC1_SECOND_POSITION,
    'FNC1_SECOND_POSITION',
    Int32Array.from([0, 0, 0]),
    0x09,
  )
  /** See GBT 18284-2000; "Hanzi" is a transliteration of this mode name. */
  static HANZI = new Mode(ModeValues.HANZI, 'HANZI', Int32Array.from([8, 10, 12]), 0x0d)
  constructor(value, stringValue, characterCountBitsForVersions, bits /*int*/) {
    this.value = value
    this.stringValue = stringValue
    this.characterCountBitsForVersions = characterCountBitsForVersions
    this.bits = bits
    Mode.FOR_BITS.set(bits, this)
    Mode.FOR_VALUE.set(value, this)
  }
  /**
   * @param bits four bits encoding a QR Code data mode
   * @return Mode encoded by these bits
   * @throws IllegalArgumentException if bits do not correspond to a known mode
   */
  static forBits(bits /*int*/) {
    const mode = Mode.FOR_BITS.get(bits)
    if (undefined === mode) {
      throw new IllegalArgumentException()
    }
    return mode
  }
  /**
   * @param version version in question
   * @return number of bits used, in this QR Code symbol {@link Version}, to encode the
   *         count of characters that will follow encoded in this Mode
   */
  getCharacterCountBits(version) {
    const versionNumber = version.getVersionNumber()
    let offset
    if (versionNumber <= 9) {
      offset = 0
    } else if (versionNumber <= 26) {
      offset = 1
    } else {
      offset = 2
    }
    return this.characterCountBitsForVersions[offset]
  }
  getValue() {
    return this.value
  }
  getBits() {
    return this.bits
  }
  equals(o) {
    if (!(o instanceof Mode)) {
      return false
    }
    const other = o
    return this.value === other.value
  }
  toString() {
    return this.stringValue
  }
}
