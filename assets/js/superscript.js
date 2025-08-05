document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    $('.js-heading .line').lettering();

    const chars = $('.line-2').children();
    const z = chars.filter((i, el) => $(el).text() === 'Z');
    const t = z.next();
    const v = t.next();

    const zClone = z.clone();
    const tClone = t.clone().wrap('<span class="tv-char t-char"></span>').parent();
    const vClone = v.clone().wrap('<span class="tv-char v-char"></span>').parent();

    const wrap = $('<span class="z-wrap"></span>');
    z.before(wrap);
    wrap.append(zClone, tClone, vClone);

    z.remove();
    t.remove();
    v.remove();
  }, 50);
});
