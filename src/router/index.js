import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index.vue'
import Login from '../components/Login.vue'
import StaticLevel from '../components/StaticLevel/index.vue'
import StaticLevelDataIndex from '../components/StaticLevel/StaticLevelData/StaticLevelData.vue'
import StaticLevelCurveIndex from '../components/StaticLevel/StaticLevelCurve/StaticLevelCurve.vue'
import Horizontal from '../components/Horizontal/index.vue'
import HorizontalData from '../components/Horizontal/HorizontalData/HorizontalData.vue'
import HorizontalCurve from '../components/Horizontal/HorizontalCurve/HorizontalCurve.vue'
import Meteorological from '../components/Meteorological/index.vue'
import MeteorologicalCurve from '../components/Meteorological/MeteorologicalCurve/MeteorologicalCurve.vue'
import MeteorologicalData from '../components/Meteorological/MeteorologicalData/MeteorologicalData.vue'
import Sensor from '../components/Sensor/index.vue'
import DTUList from '../components/Sensor/DTUList/DTUList.vue'
import SensorList from '../components/Sensor/SensorList/SensorList.vue'
import Management from '../components/Management/index.vue'
import DropOut from '../components/Management/DropOut/DropOut.vue'
import UserInfo from '../components/Management/UserInfo/UserInfo.vue'
import Privilege from '../components/Management/Privilege/Privilege.vue'
import WarningInfo from '../components/WarningInfo/index.vue'
import EarlyWarningList from '../components/WarningInfo/EarlyWarningList/EarlyWarningList.vue'
import Project from '../components/Project/index.vue'
import ListOfItems from '../components/Project/ListOfItems/ListOfItems.vue'
import LogInfo from '../components/LogInfo/index.vue'
import LogList from '../components/LogInfo/LogList/LogList.vue'
Vue.use(Router)

// 解决报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: 'StaticLevel/index',
          name: 'StaticLevel',
          component: StaticLevel,
          children: [
            {
              path: '/StaticLevel/StaticLevelData/Index',
              name: 'StaticLevelDataIndex',
              component: StaticLevelDataIndex
            },
            {
              path: '/StaticLevel/StaticLevelCurve/Index',
              name: 'StaticLevelCurveIndex',
              component: StaticLevelCurveIndex
            }
          ]
        },
        { path: 'Horizontal/index',
          name: 'Horizontal',
          component: Horizontal,
          children: [
            {
              path: '/Horizontal/HorizontalData/Index',
              name: 'HorizontalData',
              component: HorizontalData
            },
            {
              path: '/Horizontal/HorizontalCurve/Index',
              name: 'HorizontalCurve',
              component: HorizontalCurve
            }
          ]
        },
        { path: 'Meteorological/index',
          name: 'Meteorological',
          component: Meteorological,
          children: [
            {
              path: '/Meteorological/MeteorologicalData/Index',
              name: 'MeteorologicalData',
              component: MeteorologicalData
            },
            {
              path: '/Meteorological/MeteorologicalCurve/Index',
              name: 'MeteorologicalCurve',
              component: MeteorologicalCurve
            }
          ]
        },
        { path: 'Sensor/index',
          name: 'Sensor',
          component: Sensor,
          children: [
            {
              path: '/Sensor/DTUList/Index',
              name: 'DTUList',
              component: DTUList
            },
            {
              path: '/Sensor/SensorList/Index',
              name: 'SensorList',
              component: SensorList
            }
          ]
        },
        { path: 'Management/index',
          name: 'Management',
          component: Management,
          children: [
            {
              path: '/Management/UserInfo/Index',
              name: 'UserInfo',
              component: UserInfo
            },
            {
              path: '/Management/DropOut/Index',
              name: 'DropOut',
              component: DropOut
            },
            {
              path: '/Management/Privilege/Index',
              name: 'Privilege',
              component: Privilege
            }
          ]
        },
        { path: 'WarningInfo/index',
          name: 'WarningInfo',
          component: WarningInfo,
          children: [
            {
              path: '/WarningInfo/EarlyWarningList/Index',
              name: 'EarlyWarningList',
              component: EarlyWarningList
            }
          ]
        },
        { path: 'Project/index',
          name: 'Project',
          component: Project,
          children: [
            {
              path: '/Project/ListOfItems/Index',
              name: 'ListOfItems',
              component: ListOfItems
            }
          ]
        },
        { path: 'LogInfo/index',
          name: 'LogInfo',
          component: LogInfo,
          children: [
            {
              path: '/LogInfo/LogList/Index',
              name: 'LogList',
              component: LogList
            }
          ]
        }
      ]
    }
  ]
})

// 前置守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
