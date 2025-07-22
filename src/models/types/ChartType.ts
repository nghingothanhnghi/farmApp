// src/models/types/ChartType.ts
import {
  curveMonotoneX,
  curveLinear,
  curveStep,
  curveStepBefore,
  curveStepAfter,
  curveCardinal,
  curveBasis,
  curveNatural,
  type CurveFactory
} from 'd3-shape';


export type ChartTypeOption =
  | 'monotone'
  | 'linear'
  | 'step'
  | 'stepBefore'
  | 'stepAfter'
  | 'cardinal'
  | 'basis'
  | 'natural';

export const chartTypeMap: Record<ChartTypeOption, CurveFactory> = {
  monotone: curveMonotoneX,
  linear: curveLinear,
  step: curveStep,
  stepBefore: curveStepBefore,
  stepAfter: curveStepAfter,
  cardinal: curveCardinal,
  basis: curveBasis,
  natural: curveNatural,
};