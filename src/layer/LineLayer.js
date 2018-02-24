import { isNull } from "util";

"use strict";

var _ = require("underscore");
var Layer = require("../layer/Layer");
var Arc = require("../element/Arc");

const _default_config = {
  input: "line",
  outputPrefix: "",
  color: "orange",
  minValue: null,
  maxValue: null
};

/**
 * Represents a line chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */
class LineLayer extends Layer {

  /**
   * Instantiate LineLayer
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
    this.output = this.outputPrefix; // e.g. _sma50, _sma200, etc
    this.minField = this.output;
    this.maxField = this.output;
  }

  /**
   * Render layer onto canvas
   * @param {timeseries.TimeSeriesData} data
   * @param {number} count
   * @param {number} offset
   * @param {valueToPixel} valueToPixel
   * @param {indexToPixel} indexToPixel
   */
  draw(data, count, offset, valueToPixel, indexToPixel) {

    var context = this._getContext();
    var field_map = data.getFieldMap();
    var data_arr = data.getRawData();
    this.elements = [];
    var prev_arc = null;
    // for (var field in field_map) {
    //   console.log(field + " : " + field_map[field]);
    // }
    if (isNull(this.minValue)) {
      this.minValue = Math.min.apply(Math, data_arr);
    }
    if (isNull(this.maxValue)) {
      this.maxValue = Math.max.apply(Math, data_arr);
    }
    for (var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++) {
      var dat = data_arr[i];
      // console.log(this.input + " : " + i + " : " + dat[field_map.time] + " : " + dat[this.input]);
      var arc = new Arc(
        this,
        i,
        dat[field_map.time],
        dat[this.input],
        prev_arc);
      this.elements.push(arc);
      arc.draw(context, valueToPixel, indexToPixel, this);

      prev_arc = arc;
    }

  }

}

module.exports = LineLayer;
