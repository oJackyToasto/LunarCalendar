document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('dateInput');
  const runBtn = document.getElementById('runBtn');
  const resultDiv = document.getElementById('result');

  // 天干地支和生肖
  const gan = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
  const zhi = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
  const animals = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];

  // 时辰干支计算
  function getHourGanZhi(hour, dayGan) {
    const hourIndex = Math.floor((hour + 1) / 2) % 12;
    const ganIndex = (gan.indexOf(dayGan[0]) * 2 + hourIndex) % 10;
    return gan[ganIndex] + zhi[hourIndex];
  }

  // 显示结果
  function renderResult(date) {
    // 使用 Lunar 库
    const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const lunar = solar.getLunar();

    const yearGanZhi = lunar.getYearInGanZhi();
    const monthGanZhi = lunar.getMonthInGanZhi();
    const dayGanZhi = lunar.getDayInGanZhi();
    const hourGanZhi = getHourGanZhi(date.getHours(), dayGanZhi);

    const zodiac = lunar.getYearShengXiao();

    // 农历月名拼接
    const monthName = (lunar.isLeap ? "闰" : "") + lunar.getMonthInChinese();
    const dayName = lunar.getDayInChinese();

    resultDiv.innerHTML = `
      <p>公历：<span class="highlight">${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}</span></p>
      <p>农历：<span class="highlight">${monthName}月${dayName}</span></p>
      <p>干支纪年：<span class="highlight">${yearGanZhi}年 ${monthGanZhi}月 ${dayGanZhi}日 ${hourGanZhi}时</span></p>
      <p>生肖：<span class="highlight">${zodiac}</span></p>
    `;
  }

  runBtn.addEventListener('click', () => {
    const date = new Date(dateInput.value);
    if(isNaN(date.getTime())) {
      resultDiv.innerHTML = `<p style="color:red">请输入有效日期！</p>`;
      return;
    }
    renderResult(date);
  });
});
