import DefaultGridSampler from './DefaultGridSampler'
export default class GridSamplerInstance {
  static gridSampler = new DefaultGridSampler()
  /**
   * Sets the implementation of GridSampler used by the library. One global
   * instance is stored, which may sound problematic. But, the implementation provided
   * ought to be appropriate for the entire platform, and all uses of this library
   * in the whole lifetime of the JVM. For instance, an Android activity can swap in
   * an implementation that takes advantage of native platform libraries.
   *
   * @param newGridSampler The platform-specific object to install.
   */
  static setGridSampler(newGridSampler) {
    GridSamplerInstance.gridSampler = newGridSampler
  }
  /**
   * @return the current implementation of GridSampler
   */
  static getInstance() {
    return GridSamplerInstance.gridSampler
  }
}
