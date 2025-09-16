document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('dateInput');
  const runBtn = document.getElementById('runBtn');
  const resultDiv = document.getElementById('result');

  // 天干地支
  const gan = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
  const zhi = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
  const animals = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
  const ganMap = {
      "甲":"木", "乙":"木", "丙":"火", "丁":"火",
      "戊":"土", "己":"土", "庚":"金", "辛":"金",
      "壬":"水", "癸":"水"
    };
  const zhiMap = {
      "子":"水", "丑":"土", "寅":"木", "卯":"木",
      "辰":"土", "巳":"火", "午":"火", "未":"土",
      "申":"金", "酉":"金", "戌":"土", "亥":"水"
    };

  // 时辰干支
  function getHourGanZhi(hour, dayGan) {
    const hourIndex = Math.floor((hour + 1) / 2) % 12;
    const ganIndex = (gan.indexOf(dayGan[0]) * 2 + hourIndex) % 10;
    return gan[ganIndex] + zhi[hourIndex];
  }

  // 月建五行
  function getMonthJianWuxing(lunarMonth, monthGanZhi) {
    let str = monthGanZhi[0] + monthGanZhi[1] + "日 ";
    switch (lunarMonth) {
      case 1: case 2: return str + "木旺";
      case 4: case 5: return str + "火旺";
      case 3: case 6: case 9: case 12: return str + "土旺";
      case 7: case 8: return str + "金旺";
      case 10: case 11: return str + "水旺";
      default: return "";
    }
  }
  // 获取节气信息
    function getJieQiInfo(lunar) {
      const prevJie = lunar.getPrevJieQi(); // ✅ 正确
      const nextJie = lunar.getNextJieQi(); // ✅ 正确

      // 格式化节气日期
      const formatSolar = (s) => `${s.getYear()}-${s.getMonth()}-${s.getDay()}`;

      const todayStr = formatSolar(lunar.getSolar());
      const prevStr = formatSolar(prevJie.getSolar());
      const nextStr = formatSolar(nextJie.getSolar());

      // 如果当天就是节气，则显示当天 + 下一个
      if (todayStr === prevStr) {
        return `上一节气：${prevJie.getName()} ${prevStr} | 下一节气：${nextJie.getName()} ${nextStr}`;
      } else {
        return `上一节气：${prevJie.getName()} ${prevStr} | 下一节气：${nextJie.getName()} ${nextStr}`;
      }
    }



  // 日建五行（根据日干）
  function getDayJianWuxing(dayGanZhi) {
    return dayGanZhi[0] + dayGanZhi[1] + "日 " + zhiMap[dayGanZhi[1]] + "旺";
  }

  // 时辰五行（根据地支）
  function getHourWuxing(hourGanZhi) {
    return hourGanZhi[0] + hourGanZhi[1] + "日 " + zhiMap[hourGanZhi[1]] + "旺"
  }

  function renderResult(date) {
    const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const lunar = solar.getLunar();

    // 干支
    const yearGanZhi = lunar.getYearInGanZhi();
    const monthGanZhi = lunar.getMonthInGanZhi();
    const dayGanZhi = lunar.getDayInGanZhi();
    const hourGanZhi = getHourGanZhi(date.getHours(), dayGanZhi);

    // 农历月日
    const monthName = (lunar.isLeap ? "闰" : "") + lunar.getMonthInChinese();
    const dayName = lunar.getDayInChinese();

    // 生肖
    const zodiac = lunar.getYearShengXiao();

    resultDiv.innerHTML = `
      <p>公历：<span class="highlight">${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}</span></p>
      <p>农历：<span class="highlight">${monthName}月${dayName}</span></p>
      <p>干支纪年：<span class="highlight">${yearGanZhi}年 ${monthGanZhi}月 ${dayGanZhi}日 ${hourGanZhi}时</span></p>
      <p>生肖：<span class="highlight">${zodiac}</span></p>
      <p>月建五行：<span class="highlight">${getMonthJianWuxing(lunar.getMonth(),monthGanZhi)}</span></p>
      <p>日建五行：<span class="highlight">${getDayJianWuxing(dayGanZhi)}</span></p>
      <p>时辰五行：<span class="highlight">${getHourWuxing(hourGanZhi)}</span></p>
      <p>节气信息：<span class="highlight">${getJieQiInfo(lunar)}</span></p>
    `;
  }

  runBtn.addEventListener('click', () => {
    const date = new Date(dateInput.value);
    if(isNaN(date.getTime())){
      resultDiv.innerHTML = `<p style="color:red">请输入有效日期！</p>`;
      return;
    }
    renderResult(date);
  });
});
