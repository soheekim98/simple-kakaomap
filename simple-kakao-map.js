function simpleKakaoMap(address, locationName = null) {
  const container = document.getElementById('kakaoMap');
  container.insertAdjacentHTML(
    'afterend',
    `<div class="custom_typecontrol radius_border">
      <span id="btnRoadmap" class="selected_btn">지도</span>
      <span id="btnSkyview" class="not_selected_btn">스카이뷰</span>
    </div>

    <div class="custom_zoomcontrol radius_border">
      <span id="zoomIn">
        <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png" alt="확대"/>
      </span>
      <span id="zoomOut">
        <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png" alt="축소"/>
      </span>
    </div>

    <span id="moveToCenterBtn">
      <img src="./reset_icon.png" alt="중심" />
    </span>`
  );

  const markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);
  const options = {
    center: markerPosition,
    level: 3,
  };
  const map = new kakao.maps.Map(container, options);

  const geocoder = new kakao.maps.services.Geocoder();
  geocoder.addressSearch(address, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      console.log(result);
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      const marker = new kakao.maps.Marker({
        position: coords,
        clickable: true,
      });
      marker.setMap(map);

      const iwContent = `<span style="font-family: sans-serif">${
          locationName ?? result[0].road_address?.building_name
        }</span>`,
        iwRemovable = true;
      const infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemovable,
      });
      kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });
      map.setCenter(coords);

      const moveToCenterBtn = document.getElementById('moveToCenterBtn');
      moveToCenterBtn.onclick = () => {
        map.panTo(coords);
      };
    }
  });
  advancedKakaoMap(map, locationName);
}

function advancedKakaoMap(map, locationName) {
  const zoomIn = document.getElementById('zoomIn');
  const zoomOut = document.getElementById('zoomOut');

  zoomIn.onclick = () => {
    map.setLevel(map.getLevel() - 1);
  };
  zoomOut.onclick = () => {
    map.setLevel(map.getLevel() + 1);
  };

  // 커스텀 컨트롤
  const roadmapControl = document.getElementById('btnRoadmap');
  const skyviewControl = document.getElementById('btnSkyview');

  roadmapControl.onclick = () => {
    map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
    roadmapControl.className = 'selected_btn';
    skyviewControl.className = 'not_selected_btn';
  };

  skyviewControl.onclick = () => {
    map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
    skyviewControl.className = 'selected_btn';
    roadmapControl.className = 'not_selected_btn';
  };
}
