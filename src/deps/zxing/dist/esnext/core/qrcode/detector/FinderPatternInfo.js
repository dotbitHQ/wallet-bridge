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
/**
 * <p>Encapsulates information about finder patterns in an image, including the location of
 * the three finder patterns, and their estimated module size.</p>
 *
 * @author Sean Owen
 */
export default class FinderPatternInfo {
  bottomLeft
  topLeft
  topRight
  constructor(patternCenters) {
    this.bottomLeft = patternCenters[0]
    this.topLeft = patternCenters[1]
    this.topRight = patternCenters[2]
  }
  getBottomLeft() {
    return this.bottomLeft
  }
  getTopLeft() {
    return this.topLeft
  }
  getTopRight() {
    return this.topRight
  }
}
