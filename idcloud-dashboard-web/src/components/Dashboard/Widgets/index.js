// charts
import BasicBarChart from './Charts/BasicBarChart'
import DonutPieChart from './Charts/DonutPieChart'

import BasicLineChart from './Charts/BasicLineChart'
import BarsChart from './Charts/BarsChart'
import PolarBarChart from './Charts/PolarBarChart'
import AreaLineChart from './Charts/AreaLineChart'
import LinesAreaChart from './Charts/LinesAreaChart'
import BasicPieChart from './Charts/BasicPieChart'
import RadarChart from './Charts/RadarChart'
import AreaBarChart from './Charts/AreaBarChart'

// effects
import RotateLine from './Effects/RotateLine'

// indicator
import CircularProgressBar from './Indicator/CircularProgressBar'
// import Speedo from './Indicator/Speedo'

// maps
import ChinaMap from './Maps/ChinaMap'
import ChinaScatterMap from './Maps/ChinaScatterMap'
import ProMap from './Maps/ProMap'

// materials
import Picture from './Materials/Picture'
import Button from './Materials/Button'
import Rect from './Materials/Rect'
import Iframe from './Materials/Iframe'
import BackgroundBorder from './Materials/BackgroundBorder'

// tables
import BasicTable from './Tables/BasicTable'

// texts
import BasicTxtBox from './Texts/BasicTxtBox'
import BasicRTClock from './Texts/BasicClock'

export default {
  // chatrs
  [BasicBarChart.name]: BasicBarChart,
  [BasicLineChart.name]: BasicLineChart,
  [BarsChart.name]: BarsChart,
  [PolarBarChart.name]: PolarBarChart,
  [AreaLineChart.name]: AreaLineChart,
  [LinesAreaChart.name]: LinesAreaChart,
  [BasicPieChart.name]: BasicPieChart,
  [DonutPieChart.name]: DonutPieChart,
  [RadarChart.name]: RadarChart,
  [AreaBarChart.name]: AreaBarChart,


  // effects
  [RotateLine.name]: RotateLine,

  // indicator
  [CircularProgressBar.name]: CircularProgressBar,
  // [Speedo.name]: Speedo,

  // map
  [ChinaMap.name]: ChinaMap,
  [ChinaScatterMap.name]: ChinaScatterMap,
  [ProMap.name]: ProMap,

  // materials
  [Picture.name]: Picture,
  [Button.name]: Button,
  [Rect.name]: Rect,
  [Iframe.name]: Iframe,
  [BackgroundBorder.name]: BackgroundBorder,

  // tables
  [BasicTable.name]: BasicTable,

  // texts
  [BasicTxtBox.name]: BasicTxtBox,
  [BasicRTClock.name]: BasicRTClock
}
