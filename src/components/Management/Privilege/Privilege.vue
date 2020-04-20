<template>
<!-- 设置地图类型：mapType="BMAP_SATELLITE_MAP" -->
  <baidu-map class="map" center="上海" :scroll-wheel-zoom="true">
    <!-- 比例尺 -->
    <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
    <!-- 缩放 -->
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    <!-- 地图类型 -->
    <!-- <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type> -->
    <!-- 缩略图 -->
    <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
    <!-- 定位控件 -->
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
    <!-- 版权信息 -->
    <bm-copyright
      anchor="BMAP_ANCHOR_TOP_RIGHT"
      :copyright="[{id: 1, content: 'Copyright Message', bounds: {ne: {lng: 110, lat: 40}, sw:{lng: 0, lat: 0}}}, {id: 2, content: '<a>我是版权信息</a>'}]">
    </bm-copyright>
    <!-- 城市列表 -->
    <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
    <!-- 覆盖物 -->
    <bm-marker :position="{lng: 121.506377, lat: 31.245105}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
      <bm-label content="东方明珠" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
    </bm-marker>
    <!-- 全景 -->
    <bm-panorama></bm-panorama>
  </baidu-map>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style lang="less">
.map {
  width: 100%;
  height: 100%;
}
</style>
