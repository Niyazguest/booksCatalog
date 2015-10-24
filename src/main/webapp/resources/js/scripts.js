/**
 * Created by user on 12.09.15.
 */
$(document).ready(function () {
    $('#taskTable').on('dblclick', 'td[class!=tCor]', function () {
        if ($('#curInput').length > 0)
            return;
        var num = parseInt($(this).parent().attr('data-num'));
        var elem = $(this);
        $(this).replaceWith('<input id="curInput" type="text" style="height: 100px; width: 200px; z-index: 50;"/>');
        $('#curInput').css('height', elem.height().toString() + 'px');
        $('#curInput').css('width', '100%');
        $('#curInput').dblclick(function () {
            deleteInput(this, elem);
        });
    });

    $('#taskTable').on('click', '.cor', function () {
        var obj = new Object();
        var taskSaveBtn = $(this);
        obj.id = parseInt(taskSaveBtn.parent().parent().attr('data-id'));
        obj.name = taskSaveBtn.parent().parent().children('.tName').text();
        obj.definition = taskSaveBtn.parent().parent().children('.tDef').text();
        obj.taskDate = taskSaveBtn.parent().parent().children('.tDate').text();
        obj.typeId = parseInt(taskSaveBtn.parent().parent().children('.tType').children('select').val());
        obj.priorityId = parseInt(taskSaveBtn.parent().parent().children('.tPriority').children('select').val());
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        var jsonData = JSON.stringify(obj);
        $.ajax({
            url: '/testapp/saveTask',
            type: 'POST',
            contentType: 'application/json;  charset=utf-8',
            dataType: 'text',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            data: jsonData,
            success: function (data, status, resp) {
                taskRow.parent().parent().attr('data-id', resp.getResponseHeader('taskId'));
                taskRow.text('Редактировать');
                alert('Задача сохранена');
            }
        })
    });

    $('#taskTable').on('click', '.del', function () {
        var taskRow = $(this);
        var taskId = $(this).parent().parent().attr('data-id');
        var token = $("meta[name='_csrf']").attr("content");
        var header = $("meta[name='_csrf_header']").attr("content");
        $.ajax({
            url: '/testapp/deleteTask',
            type: 'POST',
            dataType: 'text',
            beforeSend: function (xhr) {
                xhr.setRequestHeader(header, token);
            },
            data: {
                taskId: taskId
            },
            success: function (resp) {
                taskRow.parent().parent().remove();
                alert('Задача удалена');
            }
        })
    });
});


function addTask() {
    var number = $('.task').length + 1;
    $('#taskTable').append('<tr class="task" data-num="' + number.toString() + '">' +
        '<td style="height:100px; width:5%;" class="tNum">' + number.toString() + '</td>' +
        '<td style="height:100px; width:10%;" class="tName"></td>' +
        '<td style="height:100px; width:30%;" class="tDef"></td>' +
        '<td style="height:100px; width:10%;" class="tDate"></td>' +
        '<td style="height:100px; width:10%;" class="tType"></td>' +
        '<td style="height:100px; width:10%;" class="tPriority"></td>' +
        '<td style="height:100px; width:10%;" class="tCor"><button type=\"button\" class=\"btn btn-info btn-sm cor\">Сохранить</button>' +
        '<button type=\"button\" class=\"btn btn-info btn-sm del\">Удалить</button></td>' +
        ' </tr>');

    if (number > 1) {
        var typeElem = $('.task').eq(0).children('td.tType').html();
        $('tr[data-num=' + number.toString() + ']>td.tType').append(typeElem);
        var priorityElem = $('.task').eq(0).children('td.tPriority').html();
        $('tr[data-num=' + number.toString() + ']>td.tPriority').append(priorityElem);
    } else {
        setSelectDataFromServer('getTypes', 'type', 'tType', number.toString());
        setSelectDataFromServer('getPriorities', 'priority', 'tPriority', number.toString());
    }
}

function setSelectDataFromServer(action, selectName, tdClass, number) {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $.ajax({
        url: '/testapp/' + action.toString(),
        type: 'GET',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader(header, token);
        },
        success: function (resp) {
            var types = document.createElement('select');
            var typeElem = $(types);
            typeElem.attr('name', selectName.toString());
            typeElem.attr('class', 'typePrioritySelect');
            var option = null;
            resp.forEach(function (item) {
                option = document.createElement('option');
                $(option).val(item.id);
                $(option).text(item.name);
                typeElem.append($(option));
            });
            $('tr[data-num=' + number + ']>td.' + tdClass.toString()).append(typeElem);
        }
    });
}

function deleteInput(input, elem) {
    var text = $(input).val();
    $(input).replaceWith(elem);
    elem.text(text);
}


$("#oformshow,#formats").each(function () {
    var d = this.id.substr(0, 5), c = $(this).data("id");
    $(this).qtip({style: {width: 300, background: "none", border: {width: 0, radius: 0, color: "#fff"}}, position: {corner: {target: "topRight", tooltip: "bottomLeft"}, adjust: {y: 5, x: -5}}, content: d == "oform" ? {url: "/ajax/design/" + c + "/"} : '<div class="popup"><div class="popup-top"></div><div class="popup-middle">' + $("#" + d).html() + '</div><div class="popup-bottom"></div></div>', show: {when: {event: "click"}, delay: 0, effect: {length: 0}}, hide: {when: {event: "unfocus"}, fixed: true}})
});
$("#toomuchputbooks").each(function () {
    var c = this.id.substr(0, 5);
    $(this).qtip({style: {width: 300, background: "none", border: {width: 0, radius: 0, color: "#fff"}}, position: {corner: {target: "topRight", tooltip: "bottomLeft"}, adjust: {y: 5, x: -5}}, content: '<div class="popup"><div class="popup-top"></div><div class="popup-middle">Максимальное количество товаров в общем списке не должно превышать 1000 наименований. Пожалуйста,  распределите отложенные товары по папкам.</div><div class="popup-bottom"></div></div>', show: {when: {event: "click"}, delay: 0, effect: {length: 0}}, hide: {when: {event: "unfocus"}, fixed: true}})
})


window.onerror = null;
var mspeed = 15;
var CARTPATH = "/cart/";
var YMAPSKEY = "AJ1AHksBAAAAyFr-NwIAn9zmm1XypbyJ_FiADLZWtiXFScwAAAAAAAAAAAAfN5VlHqPWjHJKybSbdVHDQ0wqBQ==";
var GMAPSKEY = "ABQIAAAAlxVwtR8O0tfD8ivH3x6Q8BRxl7X2DiDC2dfRy6_Q6sqR3Bd1LhQFhFF-_Zc2DJwVJdEjWvEA3OwF3Q";
var seoContent = {}, seoHtml = {};
var seoHrefs = {"58756c7e7c5ffee37680b2f960aabe8f": "L2Jhc2tldC8=", b75d667af5b3341b338bfc69a22601da: "L2Jvb2tzLw==", bc4729f018d0cd1c6fc319687bb6ffce: "L2dhbWVzLw==", ac865112d1d95afd460c09fe0920d16e: "L211bHRpbWVkaWEv", dc76a71c7b047aa9dbd493d3a50758ae: "L29mZmljZS8=", ca68c27dea952ef4a9119d31fcc9680a: "L3NvdXZlbmlyLw==", "77bd66bb233f3d048e6bdd5b50d342c6": "L2NhYmluZXQv", "7ee549e06a110810fd57b15b26d27fa0": "L2RlbGl2ZXJ5Lw==", "7b161fadc7172707585e14e6b54e4d0f": "L2Rpc2NvdW50Lw==", ee32b958a1e8378265c129fec3e30bf4: "L2d1ZXN0Ym9vay8=", "7ab4821d5304ef493d0218e67086f202": "L2hlbHAv", "6f21eb1cee576f776f22cf727fa8dff5": "L2hlbHAvb3JkZXIv", d948c3c29494627fe8e5b72fa7b30916: "L3RvcC9jZXJ0aWZpY2F0ZXMv", "141c320dc9f4a726b3f551d47af9e321": "L2hlbHAvP2NsYXVzZT0z", c0ecdfd68d9aa036f451a2dfb6136e25: "L2hlbHAvP2NsYXVzZT0xMA==", c4afd3d13e7025a1508e64297273e90f: "L21hcHMv", "87093da0fc25f36bc94412a947af3133": "L3NlYXJjaC8/YmlnPTE=", a293a7eec6465e62bacdac3a46f0d948: "c2t5cGU6bGFiaXJpbnRydT9jYWxs", "83f09d7c71855fb6a4550e32ae5a658b": "L2lucXVpcmVycy8=", "000d0ba34a6c6fc69029ded3018c901d": "L3N1YnNjcmliZXMv", "32dcbb41f8a6fdea48d0a6da91825abb": "L2NoYXJpdHkv", "5120873ac4bf420a7f0a27156d99285e": "L3BhcnRuZXIv", "26a93b8987e1c3f1a204adfaf8eb1675": "L2NvbnRhY3Qv", bd8c54064d785bdfc56eab4061510e85: "L2FncmVlbWVudC8=", ddc40c8f150c970e494a139c418bdaf1: "aHR0cDovL3ZrLmNvbS9sYWJpcmludF9ydQ==", "9e9e52756caa9ae4be8ce622e0910deb": "aHR0cDovL3d3dy5mYWNlYm9vay5jb20vbGFiaXJpbnQucnU=", f40320ab6658a790b9cc2185e7a5f0aa: "aHR0cDovL3R3aXR0ZXIuY29tL2xhYmlyaW50X3J1", a71d79c39b44e2d89c7aa851f822b23f: "aHR0cDovL2xhYmlyaW50c2hvcC5saXZlam91cm5hbC5jb20v", "8e52b39350dadf8b12f1c4f59b2858d8": "aHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vMTAyNjExOTYwOTIzOTE5MDExNDk3L3Bvc3Rz", "9e3e6360ae116d4148534f7bed37ffee": "aHR0cDovL3d3dy5vZG5va2xhc3NuaWtpLnJ1L2xhYmlyaW50c2hvcA==", "307f0626f2e644b9e5b0660d15feb704": "aHR0cDovL2luc3RhZ3JhbS5jb20vbGFiaXJpbnRydQ==", a6e70b027d696f1d3afe13fa71f85b8e: "L2NhcnQv"};
var gnres = new Array();
gnres[-1] = "books/";
gnres[-2] = "video/";
gnres[-3] = "audio/";
gnres[-4] = "software/";
gnres[-5] = "games/";
gnres[-6] = "office/";
gnres[-7] = "other/";
gnres[-10] = "ebooks/";
var gnresid = {books: -1, video: -2, audio: -3, software: -4, games: -5, office: -6, other: -7, ebooks: -10};
var root = window.addEventListener || window.attachEvent ? window : (document.addEventListener ? document : null);
try {
    if ((self.parent && !(self.parent === self)) && (self.parent.frames.length != 0) && !(typeof openfcl != "undefined" && openfcl === true)) {
        self.parent.location = document.location
    }
} catch (e) {
}
(function () {
    var c = 0;
    var a = new Array("http://img.labirint.ru/design/buy_loader.gif", "http://img.labirint.ru/design/upload_big.gif", "http://img.labirint.ru/design/upload_old.gif", "http://img.labirint.ru/design/upload.gif", "http://img.labirint.ru/design/basket-go.png", "http://img.labirint.ru/design/borodino/product_icons_done.png", "http://img.labirint.ru/design/statuses.png", "http://img.labirint.ru/design/social-icons37.png", "http://img.labirint.ru/design/social-icons.png", "http://img.labirint.ru/design/singin-icon.png", "http://img.labirint.ru/design/close-icon.png", "http://img.labirint.ru/design/triangleright-icon.png", "http://img.labirint.ru/design/sex-radio.png", "http://img.labirint.ru/design/red-arrow-right.png", "http://img.labirint.ru/design/red-arrow.png", "http://img.labirint.ru/design/check.png", "http://img.labirint.ru/design/lab_preloader.gif");
    for (i in a) {
        var f = new Image();
        f.onload = function () {
            c++
        };
        f.src = a[i]
    }
})();
function numberFormat(j, f, l, h) {
    j = (j + "").replace(/[^0-9+\-Ee.]/g, "");
    var c = !isFinite(+j) ? 0 : +j, a = !isFinite(+f) ? 0 : Math.abs(f), o = (typeof h === "undefined") ? "," : h, g = (typeof l === "undefined") ? "." : l, m = "", k = function (s, r) {
        var q = Math.pow(10, r);
        return"" + (Math.round(s * q) / q).toFixed(r)
    };
    m = (a ? k(c, a) : "" + Math.round(c)).split(".");
    if (m[0].length > 3) {
        m[0] = m[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, o)
    }
    if ((m[1] || "").length < a) {
        m[1] = m[1] || "";
        m[1] += new Array(a - m[1].length + 1).join("0")
    }
    return m.join(g)
}
function getLazyFunction(a, c) {
    var f;
    return function () {
        if (f) {
            clearTimeout(f)
        }
        var g = arguments;
        var h = this;
        f = setTimeout(function () {
            a.apply(h, g)
        }, c)
    }
}
function parseQuery(m, f) {
    var k = m.split("&"), n = typeof f != "undefined", a = {};
    for (var h = 0; h < k.length; h++) {
        var g = k[h].split("="), l, c;
        try {
            l = decodeURIComponent(g[0]);
            c = decodeURIComponent(g[1])
        } catch (j) {
            l = g[0];
            c = g[1]
        }
        if (n) {
            if (l == f) {
                return c
            }
        } else {
            a[l] = c
        }
    }
    return n ? null : a
}
function initJqPluginsAndActions(f) {
    if (typeof $.fn.tabs != "undefined") {
        var c = $("#search-rubric-tabs");
        if (c.length && typeof c.data("tabsinitialized") == "undefined") {
            c.data("tabsinitialized", true).tabs()
        }
    }
    if (typeof floatCards == "function") {
        floatCards()
    }
    if (typeof initWishlistFilling == "function") {
        initWishlistFilling()
    }
    if (typeof setBooksLikes == "function" && $("#wishlist-like-block-tmpl").length > 0) {
        $("#wishlist-like-block-tmpl").load("/tmpl/wishlist-like-block-tmpl.html", function () {
            w_like_block_cont = $("#wishlist-like-block-tmpl-inner").html();
            setBooksLikes()
        })
    }
    if (typeof initVideocontest == "function") {
        initVideocontest()
    }
    $(".ajax-content-container").each(function () {
        $(this).removeClass("ajax-content-container").load($(this).data("url"), function () {
            $(this).children().hide().fadeIn(1000)
        })
    });
    $("[data-skey]").each(function () {
        var o = $(this), q = o.data("stype"), n = o.data("skey");
        switch (q) {
            case"href":
                o.attr("href", Base64.decode(seoHrefs[n]));
                break;
            case"content":
                o.replaceWith(Base64.decode(seoContent[n]));
                break;
            case"html":
                o.html(Base64.decode(seoHtml[n]));
                break
        }
        o.removeAttr("data-skey")
    });
    if (typeof $.fn.lazyload != "undefined") {
        $(".news-img-cover, .book-img-comment-full").lazyload();
        $(".book-img-cover").lazyload({resetImgSize: true, callback: function () {
            var n = $(this), q = n.parents(".product-cover").children(".product-hint").addClass("lazyloaded"), o = n.position().top - 20;
            q.css({top: o < 0 ? 0 : o}).fadeIn()
        }, init: function () {
            $(this).parents(".product-cover").children(".product-hint:not(.lazyloaded)").hide()
        }});
        var j = $("#small_images");
        j.find(".lazyload").lazyload({area: j, events: [
            {obj: ".left_arrow, .right_arrow", events: "click"},
            {obj: window, events: "resize"}
        ], paddings: {left: function () {
            return j.width()
        }, right: function () {
            return j.width()
        }}, scroll: false, horizontal: true})
    }
    if (typeof $.fn.addtocopy != "undefined") {
        var m = $("#right");
        if (m.length && typeof m.data("addtocopyinitialized") == "undefined") {
            m.data("addtocopyinitialized", true).addtocopy({htmlcopytxt: '<br>Подробнее: <a href="' + window.location.href + '">' + window.location.href + "</a>", minlen: 50, addcopyfirst: false})
        }
    }
    if (typeof $.fn.carusel != "undefined") {
        var k = $(".banner-big");
        if (k.length && typeof k.data("caruselsettings") == "undefined") {
            if ("ontouchstart" in window) {
                $(".banners").addClass("banner-can-touch")
            }
            k.carusel({movespeed: 1000, freezetime: 10000, onchange: function (q, o, n) {
                var r = $(this);
                r.find(".scroll-left, .scroll-right").removeClass("hidden");
                o++;
                if (o === 1) {
                    r.find(".scroll-left").addClass("hidden")
                } else {
                    if (o === n) {
                        r.find(".scroll-right").addClass("hidden")
                    }
                }
            }})
        }
    }
    if (typeof $.fn.datepicker != "undefined") {
        $(".datepicker-input").each(function () {
            var q = $(this);
            if (typeof q.data("datepickerinitialized") == "undefined") {
                var n = q.data("minyear") || 1900, o = q.data("maxyear") || "+1";
                var r = q.data("callback");
                r = typeof window[r] == "function" ? window[r] : null;
                q.data("datepickerinitialized", true).datepicker({yearRange: n + ":" + o, onSelect: r, showButtonPanel: true, showOtherMonths: true}).datepicker("widget").addClass(q.data("css"))
            }
        })
    }
    if (typeof $.fn.labqtip != "undefined") {
        $("#genres-menu a, #genres-menu-top a, #genres-menu-search a").labqtip({position: "left"});
        $("#main-menu a").labqtip({position: "right"})
    }
    if (typeof $.fn.autocomplete != "undefined") {
        var g = $("#region-post");
        if (g.length && typeof g.data("autocomplete") == "undefined") {
            g.autocomplete({autoFocus: true, search: function (n, o) {
                $("#id_post").val("");
                $("#from_ip").val("")
            }, source: function (o, n) {
                $("input[name=post]").addClass("ajax-loading").animate({backgroundPosition: "+=200px"}, {duration: 3000, easing: "linear"});
                if (JsHttpRequestXHR != null) {
                    JsHttpRequestXHR.abort()
                }
                JsHttpRequestXHR = JsHttpRequest.myquery("/ajax.php", {search: o.term, func: "SearchRegion"}, function (q, r) {
                    if (q) {
                        n(q.listsearch);
                        $("input[name=post]").removeClass("ajax-loading");
                        if (q.firstID) {
                            $("#id_post").val(q.firstID)
                        }
                    }
                }, true)
            }, minLength: 3, select: function (n, o) {
                $("#id_post").val(o.item.id);
                self.VKI_close();
                root.onbeforeunload = null;
                $("#select-post-form").submit().loadingPanel()
            }, open: function (o, q) {
                var n = $(this).data("autocomplete").menu.element;
                n.addClass("change-region-autocomplete").css({width: ($(this).outerWidth() - 2) + "px"});
                n.find(".ui-corner-all").removeClass("ui-corner-all");
                n.find("li").each(function () {
                    if ($(this).data("item.autocomplete").value.substring(0, 5) == "Мы не") {
                        $(this).addClass("ui-menu-item-small");
                        n.find("a").html($(this).data("item.autocomplete").value)
                    } else {
                        n.find("a").append($("<span>").addClass("ahelp-results").css({height: "30px"}))
                    }
                })
            }, close: function (n, o) {
            }})
        }
        $(".navisort .navisort-autocats-text").each(function () {
            var o = $(this), n = o.parent("span"), q = n.find("[name='itemtype']");
            if (typeof o.data("autocomplete") == "undefined") {
                o.autocomplete({autoFocus: true, appendTo: n, minLength: 2, source: function (s, r) {
                    if (JsHttpRequestXHR != null) {
                        JsHttpRequestXHR.abort()
                    }
                    JsHttpRequestXHR = $.ajax({url: "/ajax/autocomplete/" + $.trim(q.val()) + "/", dataType: "json", type: "GET", data: {txt: s.term}, success: function (u, t, v) {
                        if (u) {
                            r(u)
                        }
                    }})
                }, select: function (r, s) {
                    n.find("[name=itemid]").val(s.item.id);
                    o.val(s.item.value);
                    o.parents("form").submit()
                }, search: function (r, s) {
                    n.find("[name=itemid]").val("")
                }}).data("autocomplete")._renderItem = function (r, s) {
                    return $("<li>").data("item.autocomplete", s).append("<a class='nopstate' href='/" + q + "/" + s.id + "/'>" + s.value + "</a>").appendTo(r)
                }
            }
        });
        $(".navisort-find-suggests").suggests({select: function (n, o) {
            $(this).val(o.item.value).parents(".navisort-find").find(".navisort-find-btn").click()
        }});
        if ("ontouchstart" in window) {
            var l = $(".search-top-wrapper");
            var a = l.find("input[type=text]");
            var h = $("<span>").addClass("clean-search red-cross");
            l.addClass("cleanable-search");
            h.insertAfter(a);
            if (a.val() === "") {
                h.hide()
            }
        }
        $(".cleanable-search input[type=text]").live("keyup", function () {
            var o = $(this);
            var n = o.siblings(".clean-search");
            if (o.val() !== "") {
                n.fadeIn()
            } else {
                n.fadeOut()
            }
            return true
        });
        $(".clean-search").live("click", function () {
            $(this).prev().val("").trigger("keyup")
        })
    }
    if (typeof $.fn.slider != "undefined") {
        $(".age-slider").each(function () {
            var r = $(this);
            if (typeof r.data("sliderinitialized") == "undefined") {
                r.data("sliderinitialized", true);
                var s = r.closest(".slider-filter"), q = r.data("func"), o = s.find(".min-age").val(), n = s.find(".max-age").val(), t = false;
                r.slider({range: true, min: 0, max: 19, values: [o, n], step: 1, slide: function (w, x) {
                    var v = x.values[0], u = x.values[1];
                    t = true;
                    if (v > 18 || u < 1) {
                        return false
                    }
                    s.find(".min-age-label").text(v && v != u ? "от " + v + wordEndings(v, " года", u == 19 ? " лет" : "", u == 19 ? " лет" : "") : "");
                    s.find(".max-age-label").text(v != u ? (u == 19 ? (v == 0 ? "общая" : "") : "до " + u + " " + wordEndings(u, "года", "лет", "лет")) : (u == 19 ? "от 18 лет" : u + " " + wordEndings(u, "год", "года", "лет")))
                }, change: function (w, x) {
                    var v = x.values[0], u = x.values[1];
                    s.find(".min-age-label").text(v && v != u ? "от " + v + wordEndings(v, " года", u == 19 ? " лет" : "", u == 19 ? " лет" : "") : "");
                    s.find(".max-age-label").text(v != u ? (u == 19 ? (v == 0 ? "общая" : "") : "до " + u + " " + wordEndings(u, "года", "лет", "лет")) : (u == 19 ? "от 18 лет" : u + " " + wordEndings(u, "год", "года", "лет")));
                    s.find(".min-age").val(v);
                    s.find(".max-age").val(u);
                    if (t && typeof window[q] == "function") {
                        window[q]()
                    }
                }}).slider("values", [o, n])
            }
        })
    }
    (function () {
        var s = "ontouchstart" in window;
        var w = !s ? $(".have-dropdown") : $(".have-dropdown").not(".have-dropdown-notouch");
        w.unbind(".dropdown");
        var q = null;
        var t;
        var x;

        function v(B) {
            q = $(B).addClass("have-dropdown-selected").trigger("dropdownshow");
            q.find(".dropdown-block").addClass("dropdown-block-opened");
            setTimeout(function () {
                if (q !== null) {
                    q.find(".dropdown-content").addClass("dropdown-content-in")
                }
            }, 50)
        }

        function o(E, C) {
            var D = E ? $(E) : q;
            var B = D.find(".dropdown-content-in").removeClass("dropdown-content-in");
            D.removeClass("have-dropdown-selected");
            if (B.length > 0 && typeof C === "undefined") {
                var F = parseFloat(B.css("transition-duration"));
                if (!isNaN(F)) {
                    C = F * 1000
                }
            }
            setTimeout(function () {
                if (q === null || q.get(0) !== D.get(0)) {
                    D.find(".dropdown-block").removeClass("dropdown-block-opened");
                    D.trigger("dropdownclose")
                }
            }, C);
            if (!E) {
                q = null
            }
        }

        function r(C, B) {
            B = typeof B !== "undefined" ? B : ($.browser.msie ? 300 : 100);
            if (q === null || q.get(0) !== $(C).get(0)) {
                return setTimeout(function () {
                    var D = q;
                    v(C);
                    if (D !== null) {
                        o(D)
                    }
                }, B)
            }
            return null
        }

        function n() {
            if (q !== null) {
                return setTimeout(o, 150)
            }
            return null
        }

        function z(C) {
            if (q === null || q.get(0) !== $(C).get(0)) {
                var B = q;
                v(C);
                if (B !== null) {
                    o(B)
                }
            } else {
                o()
            }
        }

        if (s) {
            var u = null;

            function A() {
                if (u !== null) {
                    o();
                    u = null
                }
            }

            $(".have-dropdown-touchlink").bind("click", function (B) {
                if (u !== null && q !== null) {
                    if (u.closest(".have-dropdown").get(0) === q.get(0)) {
                        return true
                    }
                }
                u = $(this);
                t = r($(this).closest(".have-dropdown"), 0);
                B.preventDefault();
                return false
            });
            $("body").unbind(".dropdown").bind("click.dropdown touchmove.dropdown", A)
        }
        $(".have-dropdown:not(.have-dropdown-clickable)" + (s ? ":not(.have-dropdown-notouch)" : "")).bind({"mousemove.dropdown": function () {
            if (t !== null) {
                clearTimeout(t)
            }
            t = r(this)
        }, "mouseenter.dropdown": function (B) {
            if (x !== null) {
                clearTimeout(x)
            }
            t = r(this);
            return true
        }, "mouseleave.dropdown": function () {
            if (t !== null) {
                clearTimeout(t)
            }
            x = n();
            return true
        }});
        $(".dropdown-link").unbind("click.dropdown").bind("click.dropdown", function () {
            z($(this).closest(".have-dropdown-clickable").get(0));
            return false
        });
        $("body").bind("click.dropdown", function (B) {
            if (q !== null && !$(B.target).closest(".have-dropdown-clickable").length) {
                o()
            }
        })
    }())
}
function initLiveEvents() {
    if ($.browser.opera || is_ie6 || is_ie7 || is_ie8 || is_ie9) {
        $(".btn").live({mousedown: function () {
            $(this).addClass("btn-active-white")
        }, mouseup: function () {
            $(this).removeClass("btn-active-white")
        }})
    }
    if (is_ie6 || is_ie7 || is_ie8) {
        $(".checkbox-ui, .radio-ui").live("click", function () {
            var a = $(this);
            var c = a.find("input");
            c.attr("checked", !c.attr("checked"));
            c.trigger("change")
        })
    }
    $(".checkbox-ui input").live("change", function () {
        $(this).parent().toggleClass("checked", this.checked)
    });
    $(".radio-ui input").live("change", function () {
        $(".radio-ui input[name=" + this.name.replace(/([\[\]])/g, "\\$1") + "]").each(function () {
            $(this).parent().toggleClass("checked", this.checked)
        })
    });
    $(".b-radio-e-input").live("change", function () {
        $(".b-radio-e-input[name=" + this.name.replace(/([\[\]])/g, "\\$1") + "]").each(function () {
            $(this).parent().toggleClass("b-radio-m-checked", this.checked)
        })
    });
    if (is_ie6 || is_ie7 || is_ie8) {
        $(".b-radio:not(.js-dl-radio)").live("click", function () {
            var a = $(this);
            var c = a.find(".b-radio-e-input");
            c.attr("checked", !c.attr("checked"));
            c.trigger("change");
            return false
        })
    }
    $(".navisort-autocats-item").live("click", function () {
        var a = $(this), c = a.data();
        $(".navisort-autocats-text").toggleClass("hidden", c.type == "").click().focus().val("");
        a.parents(".navisort-filter-autocats").find("[name=itemtype]").val(c.type);
        a.parents(".navisort-menu").find(".menu-open").text(a.text());
        if (c.type == "") {
            if (typeof histlab != "undefined") {
                histlab.getPage(c.url)
            } else {
                location = c.url
            }
        }
        return false
    });
    $(".navisort-groupcatalog").live("change", function () {
        var m = $(this), j = m.attr("name"), f = location.href, o = location.pathname, c = location.search.substring(1), k = parseQuery(c, "searchtxt") || o.replace("/search/", "") != o ? true : false, a = !m.data("notreload") && k, l = {totop: !!m.data("top"), tonavi: !m.data("notonavi")}, g = m.attr("checked") ? j + "=1" : "", h = null;
        if (!a) {
            h = $(this).parents(".navisort-find").find(".navisort-find-btn");
            f = h.data("findurl")
        }
        f = f.replace("&" + j + "=1", "").replace("&" + j + "=0", "").replace(j + "=1", "").replace(j + "=0", "");
        f = f + (g ? (f.indexOf("?") == -1 ? "?" : "&") + g : "");
        f = f.replace("?&", "?").replace("&&" + j, "&" + j);
        if (!a) {
            h.data("findurl", f)
        } else {
            histlab.getPage(f, l)
        }
        return false
    });
    $(".navisort-find-here").live("click", function () {
        var f = $(this), c = f.hasClass("active"), a = f.parents(".navisort").find(".navisort-find");
        if (f.hasClass("animating")) {
            return false
        }
        f.addClass("animating");
        if (c) {
            a.css({opacity: 1}).animate({opacity: 0}, "fast", function () {
                $(this).slideUp("fast", function () {
                    f.removeClass("animating");
                    f.removeClass("active")
                })
            })
        } else {
            a.css({opacity: 0}).slideDown("fast", function () {
                $(this).animate({opacity: 1}, "fast", function () {
                    f.removeClass("animating");
                    f.addClass("active")
                })
            })
        }
    });
    $(".navisort .datepicker-input, .navisort .age-small").live("change", function () {
        $(this).parents("form").submit()
    });
    $(".navisort-alpha-changer-item").live("click", function (j) {
        var h = $(".navisort-alpha-changer-item"), g = $(".navisort-alpha-items"), a = h.length - 1, k = h.index(this) - 1, c = k == a ? 0 : k + 1, f = c == a ? 0 : c + 1;
        h.hide().eq(f).show();
        g.hide().eq(c).show()
    });
    $(".navisort-find-text").live("keydown", function (a) {
        if (a.keyCode == 13) {
            $(".navisort-find-btn").click();
            return false
        }
    });
    $(".navisort-find-btn").live("click", function () {
        var f = $(this);
        var a = f.data("findurl"), c = f.data("submit"), h = f.parent().find(".navisort-find-text").val(), g = {totop: !!f.data("top"), tonavi: !f.data("notonavi")};
        if (c) {
            f.parents("form").submit()
        } else {
            if (typeof histlab != "undefined") {
                histlab.getPage(a.replace("{txt}", h), g)
            } else {
                location = a.replace("{txt}", h)
            }
        }
    });
    $(".menu-open").live("click", function () {
        var f = $(this), c = f.width();
        if (!f.hasClass("active")) {
            var a = f.addClass("active").parent().find(".menu-items").show(), g = a.width();
            a.css("left", (c - g) / 2).find("ul.menu-items-list").width(g)
        } else {
            f.removeClass("active").parent().find(".menu-items").hide()
        }
        return false
    });
    $(document.body).bind("click", function (a) {
        if (!$(a.target).is(".menu-open.active") && !$(a.target).parents(".menu-items").length) {
            $(".menu-open.active").removeClass("active").parent().find(".menu-items").hide()
        }
    });
    $("a[sendto],span[sendto],a[data-sendto],span[data-sendto]").live("click", function () {
        var c = $(this).attr("sendto") || $(this).data("sendto");
        var a = !$(this).data("nourl") ? $(this).attr("href") : "";
        return sendTo(c, a)
    });
    $(".social-icon").live("click", function () {
        var c = $("#show_agreement").html() && !$("input[name=user_agreement]:checked").val();
        var a = "Вы даете добровольное согласие на обработку своих персональных данных?";
        if (c && !confirm(a)) {
            return false
        }
        $("<div class='lab-loader' title='Нажмите для отмены'></div>").appendTo($(this).parents(".openap_list")).loadingTxt({txt: "Идет авторизация"}).bind("click", function () {
            $(this).loadingTxt("destroy").remove()
        });
        var f = $(this);
        if (f.hasClass("vk-icon")) {
            VK.Auth.login(function (g) {
                if (g.session) {
                    window.location = "/authorization/login_vk/"
                }
            })
        } else {
            if (f.hasClass("jj-icon")) {
                overlayWindow("auth_lj")
            } else {
                if (f.hasClass("od-icon")) {
                    document.forms.ok_form.submit()
                } else {
                    if (f.hasClass("fb-icon")) {
                        FB.login(function (g) {
                            if (g.authResponse) {
                                window.location = "/authorization/login_fb/"
                            }
                        }, {scope: "email,publish_actions"})
                    } else {
                        if (f.hasClass("ya-icon")) {
                            document.forms.ya_form.submit()
                        } else {
                            if (f.hasClass("gl-icon")) {
                                document.forms.g_form.submit()
                            } else {
                                if (f.hasClass("tw-icon")) {
                                    document.forms.t_form.submit()
                                } else {
                                    if (f.hasClass("ml-icon")) {
                                        mailru.connect.login()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false
    });
    $(".b-contents-link").live("click", function () {
        $(".b-contents").load("/ajax/contents/" + $(this).data("id") + "/", function () {
            overlayWindow({id: "contents-tooltip"})
        });
        return false
    });
    $("#genre-list-link a").live("click", function () {
        genrelist();
        return false
    });
    $("form.search-form").removeAttr("onsubmit").live("submit", function () {
        var a = $(this);
        var g = a.data();
        var c = "";
        if (g.genre === -9 || g.genre === -10) {
            DublyagVip()
        } else {
            var f = a.find("input[type=text]").val();
            if (!f) {
                return false
            } else {
                if (g.section === "search" && g.url !== "") {
                    c = g.url;
                    window.location.href = "/search/" + encodeURIComponent(f) + "/" + c;
                    return false
                } else {
                    a.attr("action", "/search/" + encodeURIComponent(f) + "/")
                }
            }
        }
        return true
    });
    $(".js-suggests").live("click", function () {
        if (autohelptimeout) {
            clearTimeout(autohelptimeout);
            autohelptimeout = null
        }
        if (autohelpelement) {
            $(autohelpelement).focus();
            autohelpelement = null
        }
    });
    $(".js-suggests-del").live("click", function () {
        var c = $(this), a = c.data("txt");
        $.ajax({url: "/ajax.php", type: "post", data: {cl_name: "suggests", me_name: "del", txt: c.data("txt")}, success: function (g, f, m) {
            var l = c.hasClass("js-suggests-item-del");
            var h = l ? null : c.parent();
            var j = c.parents(".js-suggests");
            var k = l ? c.parent() : j.find(".js-suggests-listitem");
            if (h) {
                h.remove()
            }
            k.fadeOut("fast", function () {
                k.remove();
                var n = j.find(".js-suggests-listitem").length;
                autocache[j.attr("id")][parseInt(j.data("dhp"))][""] = n ? j.html() : "";
                if (!n) {
                    j.hide()
                }
            })
        }})
    });
    $(".b-flash-mess-e-close").live("click", function () {
        $(this).closest(".b-flash-mess").remove();
        return false
    });
    $("body").live("click", function (a) {
        if (!$(a.target).is(".b-flash-mess") && !$(a.target).closest(".b-flash-mess").length) {
            $(".b-flash-mess").remove()
        }
    });
    $(".ajax-click-loader").live("click", function () {
        $(this).removeClass().load($(this).data("url"), function () {
            $(this).removeAttr("data-url").children().hide().fadeIn(500)
        });
        return false
    })
}
function initQtips() {
    var a = 0;
    a = 1;
    if (a != 1) {
        $("a.book-qtip, #recommendbook a.rcb, #best-user-comments a").each(function () {
            var g = $(this).attr("id_books"), f = Math.ceil(g / 10000);
            var c = $(this).attr("href").replace("/reviews/goods", "/books").replace("/reviews/ebooks", "/ebooks").substr(0, 7) == "/ebooks" ? "http://img.labirint.ru/images/ebooks/" + g + "/small.jpg" : "http://img" + (2 - g % 2) + ".labirint.ru/books" + f + "/" + g + "/small.jpg";
            $(this).qtip({style: {width: 87, height: 132, padding: 0, background: "#fff url(http://img.labirint.ru/design/upload_big.gif) no-repeat center center", border: {width: 1, radius: 0, color: "#ccc"}, tip: false}, position: {corner: {target: "topRight", tooltip: "bottomLeft"}}, content: '<a href="' + $(this).attr("href").replace("/reviews/goods", "/books") + '"><img src="' + c + '"></a>', hide: {fixed: true}})
        })
    }
    $(".prompt").qtip({style: {tip: "bottomLeft", border: {radius: 8, color: "#90D8F0"}, background: "#90D8F0", width: 300, "font-size": 11, "font-family": "Arial,Helvetica,sans-serif", color: "#5A5A5A"}, position: {corner: {target: "topMiddle", tooltip: "bottomLeft"}}, show: {solo: true, delay: 0, effect: {length: 0}}, hide: {delay: 0, effect: {length: 0}}})
}
function initBindEvents() {
    var a = $("#footer");
    a.find(".mobile").bind("click", function () {
        openUrl("http://m.labirint.ru");
        return false
    });
    a.find(".copyright").bind("click", function () {
        openUrl("http://www.labirint.org/");
        return false
    });
    a.find(".tw-icon").bind("click", function () {
        openUrl("http://twitter.com/labirint_ru");
        return false
    });
    a.find(".jj-icon").bind("click", function () {
        openUrl("http://labirintshop.livejournal.com/");
        return false
    });
    a.find(".vk-icon").bind("click", function () {
        openUrl("http://vk.com/labirint_ru");
        return false
    });
    a.find(".fb-icon").bind("click", function () {
        openUrl("http://www.facebook.com/labirint.ru");
        return false
    });
    a.find(".gp-icon").bind("click", function () {
        openUrl("https://plus.google.com/102611960923919011497/posts");
        return false
    });
    a.find(".od-icon").bind("click", function () {
        openUrl("http://www.odnoklassniki.ru/labirintshop");
        return false
    });
    $("#product-about span.youtubelink").bind("click", function () {
        if (!$("#product_video_window").length) {
            $('<div id="product_video_window" class="overlay_content" style="width:590px; height:380px;"><span class="close_bloc" onclick="clearWindow(\'product_video_window\')"></span><div class="cleaner"></div><div id="product_video_window_inner" style="padding:5px 15px 15px"></div></div>').appendTo(document.body)
        }
        $("#product_video_window_inner").html($(this).data("iframe"));
        overlayWindow("product_video_window");
        return false
    });
    $("a.videolink").bind("click", function () {
        var g = $(this), h = g.data("hash"), f = g.data("showed"), c = $("#" + h);
        $("div.videocont:not(#" + h + ")").hide();
        if (g.hasClass("showed")) {
            g.removeClass("showed")
        } else {
            $("a.videolink.showed").removeClass("showed");
            g.addClass("showed")
        }
        if (!c.length) {
            c = $('<div id="' + h + '" class="videocont"></div>');
            c.insertAfter(g).html(g.data("iframe"))
        } else {
            c.toggle()
        }
        return false
    });
    $(".search-top-input").bind("keyup", function () {
        $(this.form).find(".search-top-submit").toggleClass("search-top-disabled", this.value === "")
    });
    fixedHeader.init();
    fixedHeader.toggle();
    freeShiping.init()
}
var fixedHeader = {elem: null, close: null, checkbox: null, cookieName: "dont_show_fixed_header_1", init: function () {
    var a = this;
    a.elem = $(".header-fixed");
    a.close = $(".header-fixed-close-icon").bind("click", function () {
        a.hideAlways(1)
    });
    a.checkbox = $(".option-header-fixed");
    $(window).bind("scroll", function () {
        a.toggle()
    });
    a.toggle()
}, hideAlways: function (a) {
    setCookie("dont_show_fixed_header", a);
    this.checkbox.attr("checked", a ? true : false);
    this.toggle()
}, toggle: function () {
    if (this.canShow()) {
        this.elem.fadeIn()
    } else {
        this.elem.fadeOut()
    }
}, canShow: function () {
    return this.elem.length > 0 && !("ontouchstart" in window) && getCookie(this.cookieName) != 1 && $(window).scrollTop() >= 325
}};
function initCallBackEvents() {
    $("#callback-time-interval-today").combobox({cssclass: "callback-combobox"});
    $("#callback-time-interval-tomorrow").combobox({cssclass: "callback-combobox"});
    $("#callday_left_checkbox, #callday_right_checkbox").live({click: function () {
        var f = ($("#callday_left_checkbox").attr("checked") ? "on" : "off");
        var g = (f == "on" ? "off" : "on");
        $("#callday_span_left").removeClass().addClass("left_" + f);
        $("#callday_span_right").removeClass().addClass("right_" + g);
        var c = ($("#callday_left_checkbox").attr("checked") ? "left" : "right");
        var a = $("#callday_" + c + "_checkbox").attr("value");
        if (a == 0) {
            $("#callback-time-today").css("display", "block");
            $("#callback-time-tomorrow").css("display", "none")
        } else {
            $("#callback-time-tomorrow").css("display", "block");
            $("#callback-time-today").css("display", "none")
        }
    }});
    $("#callback-country-code").live({blur: function () {
        checkCallbackFields("countrycode")
    }});
    $("#callback-city-code").live({blur: function () {
        checkCallbackFields("citycode")
    }});
    $("#callback-phone-number").live({blur: function () {
        checkCallbackFields("phonenumber")
    }});
    $("#callback-name").live({blur: function () {
        checkCallbackFields("namedata")
    }});
    $(".ui-combobox-input.callback-combobox").live({click: function () {
        $(this).parent().find(".ui-combobox-button.callback-combobox").trigger("click");
        return false
    }})
}
if (typeof $ != "undefined") {
    $.ajaxPrefilter(function (a) {
        if (!("dataType" in a && a.dataType === "jsonp") && "type" in a && "data" in a && a.type === "POST" && a.data && typeof a.data === "string") {
            a.data += "&_jqpostrand=" + Math.random();
            if ("url" in a && (a.url === "/ajax.php" || a.url === "/post.php")) {
                a.url += "?_jqgetrand=" + Math.random()
            }
        }
    });
    $.cachedScript = function (a, c) {
        return $.ajax({dataType: "script", cache: true, url: a, success: c})
    };
    (function (n, j, m) {
        var q = j.getElementsByTagName("head")[0], k = /loaded|complete/, o = {}, r = 0, l;
        m.getCSS = function (f, g, a) {
            if (m.isFunction(g)) {
                a = g;
                g = {}
            }
            var c = j.createElement("link");
            c.rel = "stylesheet";
            c.type = "text/css";
            c.media = g.media || "screen";
            c.href = f;
            if (g.charset) {
                c.charset = g.charset
            }
            if (g.title) {
                a = (function (h) {
                    return function () {
                        c.title = g.title;
                        h(c, "success")
                    }
                })(a)
            }
            if (c.readyState) {
                c.onreadystatechange = function () {
                    if (k.test(c.readyState)) {
                        c.onreadystatechange = null;
                        a(c, "success")
                    }
                }
            } else {
                if (c.onload === null && c.all) {
                    c.onload = function () {
                        c.onload = null;
                        a(c, "success")
                    }
                } else {
                    o[c.href] = function () {
                        a(c, "success")
                    };
                    if (!r++) {
                        l = n.setInterval(function () {
                            var s, v, t = j.styleSheets, h, w = t.length;
                            while (w--) {
                                v = t[w];
                                if ((h = v.href) && (s = o[h])) {
                                    try {
                                        s.r = v.cssRules;
                                        throw"SECURITY"
                                    } catch (u) {
                                        if (/SECURITY/.test(u)) {
                                            s(c, "success");
                                            delete o[h];
                                            if (!--r) {
                                                l = n.clearInterval(l)
                                            }
                                        }
                                    }
                                }
                            }
                        }, 13)
                    }
                }
            }
            q.appendChild(c)
        }
    })(this, this.document, this.jQuery);
    var favicon = (function () {
        var c = $("head"), a = "http://img.labirint.ru/favicon.ico?20130611";
        return new function () {
            this.change = function (f, g) {
                if (g) {
                    document.title = g
                }
                c.find("link[image/x-icon][rel~=icon]").remove();
                $("<link>").attr({type: "image/x-icon", rel: "shortcut icon", href: f}).appendTo(c)
            };
            this.reset = function () {
                this.change(a)
            }
        }
    })();
    (function (a) {
        a.fn.addtocopy = function (f) {
            var c = {htmlcopytxt: '<br>More: <a href="' + window.location.href + '">' + window.location.href + "</a><br>", minlen: 25, addcopyfirst: false};
            a.extend(c, f);
            var g = document.createElement("span");
            g.id = "ctrlcopy";
            g.innerHTML = c.htmlcopytxt;
            return this.each(function () {
                a(this).mousedown(function () {
                    a("#ctrlcopy").remove()
                });
                a(this).mouseup(function () {
                    if (window.getSelection) {
                        var j = window.getSelection();
                        var h = j.toString();
                        if (!h || h.length < c.minlen) {
                            return
                        }
                        var k = j.getRangeAt(0);
                        h = k.cloneRange();
                        h.collapse(c.addcopyfirst);
                        h.insertNode(g);
                        if (!c.addcopyfirst) {
                            k.setEndAfter(g)
                        }
                        j.removeAllRanges();
                        j.addRange(k)
                    } else {
                        if (document.selection) {
                            var j = document.selection;
                            var k = j.createRange();
                            var h = k.text;
                            if (!h || h.length < c.minlen) {
                                return
                            }
                            h = k.duplicate();
                            h.collapse(c.addcopyfirst);
                            h.pasteHTML(g.outerHTML);
                            if (!c.addcopyfirst) {
                                k.setEndPoint("EndToEnd", h);
                                k.select()
                            }
                        }
                    }
                })
            })
        }
    })(jQuery);
    (function (c) {
        var f = {target: null, theme: "white", position: "auto", from: "title", message: "", left: 0, top: 0, show: {auto: true, time: 0, delay: 0, beforeshow: null, onshow: null, hideafter: 0}, hide: {auto: true, time: 0, delay: 0, beforehide: null, onhide: null}};
        var a = {init: function (g) {
            var h = c.extend(true, {}, f, g);
            return this.each(function () {
                var j = c(this);
                if (typeof j.data("labqtipparams") != "undefined") {
                    return true
                }
                j.data("labqtiptitle", h.message ? h.message : j.attr(h.from)).attr(h.from, null);
                j.data("labqtipparams", h);
                if (h.show.auto) {
                    j.bind("mouseover.labqtip", a.show)
                }
                if (h.hide.auto) {
                    j.bind("mouseout.labqtip", a.hide)
                }
            })
        }, show: function () {
            var j = c(this);
            var k = j.data("labqtipparams");
            var h = k.target ? c(k.target) : c(this);
            if (!h.length || !j.data("labqtiptitle") || j.data("labqtipshowed")) {
                return false
            }
            if (!j.data("labqtiptip")) {
                var o = c('<div><div class="jqtip-' + k.theme + '"><div class="jqtipi-top"></div><div class="jqtipi-middle"><span class="jqtip-content"></span></div><div class="jqtipi-bottom"></div><div class="jqtipi-arrow"></div></div></div>').appendTo(document.body);
                j.data("labqtiptip", o)
            } else {
                var o = j.data("labqtiptip")
            }
            var q = {};
            var l = {};
            if (k.theme == "yellow") {
                l = {left: -2, right: -2};
                q = {left: -30, right: 30}
            } else {
                l = {left: -5, right: -5};
                q = {left: -10, right: 10}
            }
            var n = k.position;
            var g = h.offset();
            o.addClass("jqtip-left").css({left: "-400px", top: "-400px"}).show();
            o.find("span.jqtip-content").html(j.data("labqtiptitle"));
            if (k.position == "left") {
                var m = g.left - 270 + (k.theme == "yellow" ? h.width() : 0) + q.left
            } else {
                if (k.position == "right") {
                    var m = g.left + (k.theme == "yellow" ? 0 : h.width()) + q.right
                } else {
                    if (k.position == "auto") {
                        if (g.left + 290 + h.width() > c(document.body).width()) {
                            n = "left";
                            var m = g.left - 270 + (k.theme == "yellow" ? h.width() : 0) + q.left
                        } else {
                            n = "right";
                            var m = g.left + (k.theme == "yellow" ? 0 : h.width()) + q.right
                        }
                    }
                }
            }
            var r = g.top - (k.theme == "yellow" ? o.height() : 0) + l[n];
            j.data("labqtipshowed", true);
            o.removeClass("jqtip-left").addClass("jqtip-" + n).hide().css({left: m + k.left + "px", top: r + k.top + "px"});
            if (typeof k.show.beforeshow == "function") {
                k.show.beforeshow.apply(this)
            }
            setTimeout(function () {
                o.fadeIn(k.show.time, function () {
                    if (typeof k.show.onshow == "function") {
                        k.show.onshow.apply(j.get(0))
                    }
                });
                if (k.show.hideafter > 0) {
                    setTimeout(function () {
                        j.labqtip("hide")
                    }, k.show.hideafter)
                }
            }, k.show.delay)
        }, hide: function () {
            var h = c(this);
            var g = h.data("labqtipparams");
            if (!h.data("labqtiptitle") || !h.data("labqtiptip") || !h.data("labqtipshowed")) {
                return false
            }
            h.removeData("labqtipshowed");
            var j = h.data("labqtiptip");
            if (typeof g.hide.beforehide == "function") {
                g.hide.beforehide.apply(this)
            }
            setTimeout(function () {
                j.fadeOut(g.hide.time, function () {
                    c(this).removeClass("jqtip-left jqtip-right");
                    if (typeof g.hide.onhide == "function") {
                        g.hide.onhide.apply(h.get(0))
                    }
                })
            }, g.hide.delay)
        }, update: function (g) {
            return this.each(function () {
                var h = c(this);
                var j = h.data("labqtiptip");
                h.data("labqtiptitle", g);
                j.find("span.jqtip-content").text(h.data("labqtiptitle"))
            })
        }, destroy: function () {
            return this.each(function () {
                var h = c(this);
                var g = h.data("labqtipparams");
                var j = h.data("labqtiptip");
                h.unbind(".labqtip");
                j.remove();
                if (!g.message) {
                    h.attr(g.from, h.data("labqtiptitle"))
                }
                h.removeData("labqtiptip").removeData("labqtiptitle").removeData("labqtipshowed").data("labqtipparams")
            })
        }};
        c.fn.labqtip = function (g) {
            if (a[g]) {
                return a[g].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                if (typeof g === "object" || !g) {
                    return a.init.apply(this, arguments)
                } else {
                    c.error("Метод " + g + " в jQuery.labqtip не существует")
                }
            }
        }
    })(jQuery);
    (function (a) {
        var c = {time: 300, txt: "Загрузка"};
        a.fn.loadingTxt = function (g) {
            if (typeof g === "object" || !g) {
                var f = a.extend(true, {}, c, g);
                return this.each(function () {
                    var l = a(this), k = 0, j = "";
                    if (l.attr("nodeName") == "INPUT") {
                        j = l.val();
                        l.val(f.txt)
                    } else {
                        j = l.html();
                        l.text(f.txt)
                    }
                    l.addClass("loadingtxt");
                    var h = setInterval(function () {
                        var o = l.data("loadingtxt");
                        if (typeof o == "undefined") {
                            clearInterval(h);
                            return
                        }
                        var m = o.txt, n = o.points;
                        for (i = 0; i < n; i++) {
                            m += "."
                        }
                        if (++n > 3) {
                            n = 0
                        }
                        if (l.attr("nodeName") == "INPUT") {
                            l.val(m)
                        } else {
                            l.text(m)
                        }
                        l.data("loadingtxt", {points: n, txt: o.txt, oldtext: j, interval: o.interval})
                    }, f.time);
                    l.data("loadingtxt", {points: k, txt: f.txt, oldtext: j, interval: h})
                })
            } else {
                if (g == "destroy") {
                    return this.each(function () {
                        var j = a(this).removeClass("loadingtxt"), h = "", k = j.data("loadingtxt");
                        if (typeof k != "undefined") {
                            clearInterval(k.interval);
                            h = k.oldtext
                        }
                        j.removeData("loadingtxt");
                        if (j.attr("nodeName") == "INPUT") {
                            j.val(h)
                        } else {
                            j.html(h)
                        }
                    })
                }
            }
            return this
        }
    })(jQuery);
    (function (c) {
        var f = {auto: true, cssclass: null};
        var a = {init: function (g) {
            var h = c.extend(true, {}, f, g);
            return this.each(function () {
                var k = c(this), j = k.data("loadingpanel");
                if (!j) {
                    j = c("<div class='loading-panel'><div class='loading-panel-inner'></div></div>").appendTo(document.body).hide();
                    if (h.cssclass) {
                        j.addClass(h.cssclass)
                    }
                    k.data("loadingpanel", j)
                }
                if (h.auto) {
                    k.loadingPanel("start")
                }
            })
        }, start: function () {
            return this.each(function () {
                var l = c(this), j = l.data("loadingpanel");
                if (j) {
                    var m = l.offset(), g = l.width(), k = l.height();
                    j.css({left: m.left, top: m.top, width: g, height: k}).show();
                    c(window).bind("resize.loadingpanel", function () {
                        l.loadingPanel("resize")
                    })
                }
            })
        }, resize: function () {
            return this.each(function () {
                var l = c(this), j = l.data("loadingpanel");
                if (j) {
                    var m = l.offset(), g = l.width(), k = l.height();
                    j.css({left: m.left, top: m.top, width: g, height: k})
                }
            })
        }, stop: function () {
            return this.each(function () {
                var h = c(this), g = h.data("loadingpanel");
                if (g) {
                    g.hide();
                    c(window).unbind("resize.loadingpanel")
                }
            })
        }, destroy: function () {
            return this.each(function () {
                var h = c(this), g = h.data("loadingpanel");
                if (g) {
                    g.remove();
                    h.removeData("loadingpanel");
                    c(window).unbind("resize.loadingpanel")
                }
            })
        }};
        c.fn.loadingPanel = function (g) {
            if (a[g]) {
                return a[g].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                if (typeof g === "object" || !g) {
                    return a.init.apply(this, arguments)
                } else {
                    c.error("Method " + g + " does not exist on jQuery.reverse")
                }
            }
        }
    })(jQuery);
    (function (c, a) {
        c.fn.lazyload = function (h) {
            var g = {src: "src", auto: true, fadetime: 400, paddings: {top: 100, right: 100, bottom: 100, left: 100}, area: a, scroll: true, events: {obj: a, events: "scroll resize"}, horizontal: false, loader: false, callback: null, init: null, resetImgSize: false};
            var f = {init: function (s) {
                var k = c.extend(true, {}, g, s);
                var j = this;
                j.data("lazyloadelement", 1);
                if (typeof k.init == "function") {
                    j.each(function () {
                        k.init.call(this)
                    })
                }
                if (k.auto) {
                    j = f._refresh.apply(j, [k])
                }
                if (k.events) {
                    var m = [], r = [];
                    if (k.events instanceof Array) {
                        for (var n in k.events) {
                            m.push(k.events[n].obj);
                            r.push(f._getEvents(k.events[n].events))
                        }
                    } else {
                        if (typeof k.events == "object") {
                            m.push(k.events.obj);
                            r.push(f._getEvents(k.events.events))
                        } else {
                            m.push(k.area);
                            r.push(f._getEvents(k.events))
                        }
                    }
                    var l = getLazyFunction(function (t) {
                        j = f._refresh.apply(j, [k]);
                        if (!j.length) {
                            c(this).unbind(t)
                        }
                    }, 100);
                    for (var n in m) {
                        var o = m[n], q = r[n];
                        c(o).bind(q, function (t) {
                            l.apply(this, [t.type + "." + t.handleObj.namespace])
                        })
                    }
                }
            }, _getEvents: function (k) {
                var j = ".lazyload" + Math.random().toString().replace(".", "");
                return typeof k == "string" && k ? (k.replace(" ", j + " ") + j).replace(j + j, j) : null
            }, _getValue: function (j) {
                return typeof j == "function" ? j.apply() : j
            }, _refresh: function (l) {
                var k, j, n, m = c(l.area);
                if (!m.length) {
                    return this.filter(function (o) {
                        return false
                    })
                }
                if (l.horizontal) {
                    n = l.scroll ? m.scrollLeft() : m.offset().left;
                    k = n - f._getValue(l.paddings.left);
                    j = n + m.width() + f._getValue(l.paddings.right)
                } else {
                    n = l.scroll ? m.scrollTop() : m.offset().top;
                    k = n - f._getValue(l.paddings.top);
                    j = n + m.height() + f._getValue(l.paddings.bottom)
                }
                return this.filter(function (s) {
                    var q = c(this), v = q.data(l.src), t = q.data("lazyloadelement");
                    if (!v || !t) {
                        return false
                    }
                    var r, o, w = q.offset();
                    if (l.horizontal) {
                        r = w.left;
                        o = w.left + q.width()
                    } else {
                        r = w.top;
                        o = w.top + q.height()
                    }
                    if (j > r && o > k) {
                        var u = new Image();
                        q.removeData(l.src).removeAttr("data-" + l.src).data("oldsrc", v);
                        if (l.loader) {
                            q.loadingPanel()
                        }
                        u.onload = function () {
                            if (q.is("img")) {
                                q.attr("src", v);
                                if (l.resetImgSize) {
                                    q.removeAttr("width").removeAttr("height")
                                }
                            } else {
                                q.css("background-image", "url(" + v + ")")
                            }
                            if (l.loader) {
                                q.loadingPanel("destroy")
                            }
                            q.hide().fadeIn(l.fadetime, function () {
                                if (typeof l.callback == "function") {
                                    l.callback.call(q.get(0))
                                }
                            });
                            delete u
                        };
                        u.src = v;
                        return false
                    }
                    return true
                })
            }};
            if (typeof h === "object" || !h) {
                return f.init.apply(this, arguments)
            } else {
                c.error("Метод " + h + " в jQuery.lazyload не существует")
            }
        }
    })(jQuery, window);
    $.widget("labirint.suggests", $.ui.autocomplete, {_renderItem: function (a, c) {
        return $('<li class="suggests-item ' + (c.classname || "") + '"><a href="' + (c.url ? c.url : "#") + '" class="suggests-item-link" id="suggest-' + c.id + '" title="' + c.label + '">' + (c.type ? '<span class="suggests-item-type">' + c.type + "</span>" : "") + '<span class="suggests-item-txt">' + c.label + '</span> <span class="' + (c.dopclass || "suggests-item-dop") + '">' + (c.dop || "") + "</span></a></li>").data("item.autocomplete", c).appendTo(a)
    }, _renderMenu: function (g, f) {
        var c = this, a = f.length;
        $.each(f, function (h, j) {
            li = c._renderItem(g, j);
            if (h == 0) {
                li.addClass("first-item")
            }
            if (h == a - 1) {
                li.addClass("last-item")
            }
        });
        if (this.options.dopElements) {
            $(this.options.dopElements).appendTo(g).zIndex(g.zIndex() + 1)
        }
    }, _init: function () {
        this.menu.widget().addClass("suggests " + (this.options.elemClass || ""));
        this.menu.refresh = function () {
            var c = this;
            var a = this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem");
            a.children("a").attr("tabindex", -1).mouseenter(function (f) {
                c.activate(f, $(this).parent())
            }).mouseleave(function () {
                c.deactivate()
            })
        }
    }, _resizeMenu: function () {
        var c = this.menu.element, f = this.options.dopWidth || 0, a = this.options.width;
        if (a) {
            c.width(a)
        } else {
            c.outerWidth(this.element.outerWidth() + f)
        }
    }});
    var suggests_cache = {}, suggests_lastXhr;
    $.extend($.labirint.suggests.prototype.options, {delay: 300, minLength: 2, dopElements: null, source: function (h, a) {
        var g = this.element.data("suggeststype") || this.element.attr("name");
        var f = $.extend(true, {}, h, this.element.data("suggestsdata") || {});
        var c = h.term;
        if (!suggests_cache[g]) {
            suggests_cache[g] = {}
        }
        if (c in suggests_cache[g]) {
            a(suggests_cache[g][c]);
            return
        }
        suggests_lastXhr = $.getJSON("/suggests/" + g + "/", f, function (k, j, l) {
            suggests_cache[g][c] = k;
            if (l === suggests_lastXhr) {
                a(k)
            }
        })
    }, select: function (a, c) {
        if (c.item.url) {
            typeof histlab != "undefined" ? histlab.getPage(c.item.url, {nothist: !!$(this).data("suggestsnopstate")}) : window.location = c.item.url
        } else {
        }
    }});
    if (typeof $.datepicker != "undefined") {
        $.datepicker.regional.ru = {closeText: "Закрыть", prevText: "Пред", nextText: "След", currentText: "Сегодня", monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"], monthNamesShort: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"], dayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"], dayNamesShort: ["вск", "пнд", "втр", "срд", "чтв", "птн", "сбт"], dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], dateFormat: "dd.mm.yy", firstDay: 1, isRTL: false, changeMonth: true, changeYear: true, yearRange: "1900:+1"};
        $.datepicker.setDefaults($.datepicker.regional.ru)
    }
    $(function () {
        fixedHeader.init();
        if (window.location.hash == "#_=_") {
            window.location.hash = ""
        }
        if (window.location.hash.replace("sendto", "") != window.location.hash) {
            var a = window.location.hash.substr(1).replace("sendto_", "");
            sendTo(a.substring(0, a.indexOf("_")), "")
        }
        initJqPluginsAndActions();
        initLiveEvents();
        initBindEvents();
        mediaQs();
        initQtips();
        initCallBackEvents();
        $(window).resize(function () {
            execTimeout(floatCards)
        });
        $(".js-email, .js-getemail").live("blur", function () {
            var n = ["yandex", "gmail", "gmail", "mail", "bk", "hotmail", "ya", "yahoo", "icloud", "inbox", "my", "list", "rambler", "lenta", "autorambler", "myrambler", "ro", "r0", "labirint", "labirint-t", "live", "pochta", "ngs", "meta", "mail", "km", "inbox", "walla"];
            var g = ["ru", "com", "ru", "ru", "ru", "com", "ru", "com", "com", "ru", "com", "ru", "ru", "ru", "ru", "ru", "ru", "ru", "ru", "ru", "ru", "ru", "ru", "ua", "com", "ru", "lv", "co.il"];
            var l = $.trim($(this).val());
            if (!l) {
                return
            }
            var c = "", f = 0, m = false;
            for (var j in n) {
                var h = n[j], k = g[j];
                c = h;
                f = c.length;
                if (l.substr(-1 * f) == c) {
                    l = l.replace(c, h + "." + k);
                    m = true
                }
                c = h + k;
                f = c.length;
                if (!m && l.substr(-1 * f) == c) {
                    l = l.replace(c, h + "." + k);
                    m = true
                }
                c = h + k.replace(".", "");
                f = c.length;
                if (!m && l.substr(-1 * f) == c) {
                    l = l.replace(c, h + "." + k);
                    m = true
                }
                c = h + "." + k;
                f = c.length;
                if (l.substr(-1 * f) == c && l.indexOf("@") == -1) {
                    l = l.replace(c, "@" + c);
                    m = true
                }
                if (m) {
                    break
                }
            }
            if (m) {
                $(this).val(l)
            }
        });
        $(".form-getemail-checkout").live("keyup change focus blur click", function (g) {
            var j = $(this), m = $(this).find(".getemail-form-input"), n = $(this).find(".getemail-form-label"), o = j.find(".getemail-btn"), q = $.trim(m.val()), r = /^[\.\-_A-Za-z0-9]+?@[\.\-A-Za-z0-9]+?\.[a-z0-9]{2,6}$/i.test(q);
            if (!$(g.target).objectEquals(o) && !$(g.target).objectEquals(m)) {
                return false
            }
            h();
            if (!r && ($(g.target).objectEquals(o) || (g.type == "focusout" && q != ""))) {
                c("Укажите почту")
            } else {
                if (r) {
                    l()
                } else {
                    if (q == "") {
                        k()
                    }
                }
            }
            function h() {
                m.removeClass("formvalidate-ok");
                o.toggleClass("btn-enabled", false)
            }

            function f() {
                n.removeClass("getemail-form-e-text");
                m.removeClass("formvalidate-error").removeClass("formvalidate-ok")
            }

            function c(s) {
                f();
                j.find(".getemail-form-label").text(s);
                n.addClass("getemail-form-e-text");
                m.addClass("formvalidate-error");
                o.toggleClass("btn-enabled", j.find(".formvalidate-error").length == 0)
            }

            function l() {
                f();
                j.find(".getemail-form-label").text("");
                m.addClass("formvalidate-ok");
                o.toggleClass("btn-enabled", j.find(".formvalidate-error").length == 0)
            }

            function k() {
                f();
                j.find(".getemail-form-label").text("Введите почту")
            }
        });
        $(".form-getemail-checkout .getemail-btn.btn-enabled").live("click", function () {
            $(".form-getemail-checkout").trigger("submit")
        });
        $(".form-getemail-checkout").live("submit", function () {
            var c = $this = $(this), g = $this[0], f = $this.find(".getemail-btn.btn-enabled");
            if (f.length > 0) {
                f.attr("disabled", true);
                $.ajax({type: "POST", url: c.attr("action"), data: {cl_name: "getemail", me_name: "setemail", setemail: g.email.value, form_place: g.form_place != undefined ? g.form_place.value : "site"}, dataType: "json", success: function (h) {
                    f.removeAttr("disabled");
                    if (h && h.error) {
                        c.find(".getemail-form-input").removeClass("formvalidate-ok").addClass("formvalidate-error");
                        c.find(".getemail-form-label").text(h.error);
                        c.find(".getemail-form-label").addClass("getemail-form-e-text")
                    } else {
                        if (g.actionurl) {
                            window.location = g.actionurl.value
                        } else {
                            window.location = window.location.href
                        }
                    }
                }})
            }
            return false
        });
        if (typeof $.fn.carusel != "undefined" && $(".main-block-carousel").length) {
            $(".main-block-carousel").each(function (c) {
                $this = $(this);
                $this.carusel({auto: false, round: true, movespeed: 1000, freezetime: 10000, leftbtn: $this.find(".carousel-arrow-left"), rightbtn: $this.find(".carousel-arrow-right"), onchange: function (j, h, g) {
                    var k = $(this);
                    console.log(k.data("carousel"));
                    var f = k.find(".carusel-item").eq(1);
                    f.find(".book-img-cover").lazyload({area: f, events: null, scroll: false, auto: true});
                    h++
                }})
            })
        }
    })
}
function floatCards() {
    var a = $(".product:eq(0)").outerHeight(true);
    $(".float-cards").each(function () {
        var g = $(this);
        var f = g.css({height: "auto"}).outerHeight(true);
        var c = g.height();
        c = a * Math.ceil(c / a) - (f - c);
        g.css({height: c + "px"})
    })
}
function wordEndings(j, h, g, f) {
    if (j == 0) {
        return f
    }
    var c = j % 100;
    var a = j % 10;
    if (c >= 11 && c <= 19) {
        return f
    }
    if (a >= 2 && a <= 4) {
        return g
    }
    if (a == 1) {
        return h
    }
    return f
}
function charityCatalogSubmitFunc() {
    $("#right").loadingPanel();
    document.forms.filterform.submit()
}
function sendTo(f, a) {
    var c = $("#" + f).find("form input[name=actionurl]");
    if (c.length > 0) {
        c.val(a)
    } else {
        $("#" + f).find("form").append($('<input name="actionurl" type="hidden">').val(a))
    }
    overlayWindow(f);
    return false
}
function switchGenre(a) {
    var c = document.forms.searchform;
    if (a == 1) {
        $("#search-in-genre").html(js_search_in_genre);
        $("#search-all-genre").html('<span class="serach_kategory_menu"><a class="dashed" href="javascript: switchGenre(0);">везде</a></span>');
        $("#search-in-curent-genre").html('<span class="serach_kategory_menu"><a class="dashed" href="javascript: switchGenre(2);">в жанре</a></span>');
        if (js_section_genre != -9) {
            c.id_genre.value = js_sform_genre
        }
        if (js_section_genre == -9) {
            c.action = "/school/";
            $(c.id_genre).remove()
        } else {
            if (js_section_genre == -10) {
                c.action = "/ny/search/"
            }
        }
    } else {
        if (a == 2) {
            $("#search-in-genre").html('<span class="serach_kategory_menu"><a class="dashed" href="javascript: switchGenre(1);">' + js_search_in_genre + "</a></span>");
            $("#search-all-genre").html('<span class="serach_kategory_menu"><a class="dashed" href="javascript: switchGenre(0);">везде</a></span>');
            $("#search-in-curent-genre").html("в жанре");
            c.id_genre.value = js_search_genre
        } else {
            $("#search-all-genre").html("везде");
            $("#search-in-genre").html('<span class="serach_kategory_menu"><a class="dashed" href="javascript: switchGenre(1);">' + js_search_in_genre + "</a></span>");
            $("#search-in-curent-genre").html('<span class="serach_kategory_menu"><a class="dashed" href="javascript: switchGenre(2);">в жанре</a></span>');
            if (c.id_genre) {
                c.id_genre.value = ""
            }
            if (js_section_genre == -9 || js_section_genre == -10) {
                c.action = "/search/"
            }
        }
    }
}
function DublyagVip() {
    $("#dublyag").val($("#search-field").val());
    $(document.forms.searchform.genre).remove();
    return true
}
function selectBooks(f, c, g) {
    var a = $("#table_books");
    JsHttpRequest.query("/catalog/selectBooks.ajax.php", {id_books: f, inBasket: c, id_Main: g}, function (h, j) {
        if (h.mess != "") {
            $("#div_info").html(h.mess)
        } else {
            a.html(a.html() + h.str)
        }
    }, true)
}
function AddArticle() {
    var c = $("#article_id").val();
    var g = $("#list_articles").val();
    var a = $("#list_articles_name").html();
    var f = $("#mess_act");
    if (c == "") {
        f.html("Не введено значение!")
    } else {
        if (isNaN(c)) {
            f.html("В поле введено не число!")
        } else {
            f.html("");
            JsHttpRequest.query("/catalog/addinadvise.ajax.php", {id_article: c, list_id: g, list_name: a}, function (h, j) {
                if (h.error != "") {
                    f.html(h.error)
                } else {
                    $("#list_articles").val(h.list_id);
                    $("#list_articles_name").html(h.list_name);
                    $("#articles_block").css("height", parseInt(h.height) + "px")
                }
            }, true)
        }
    }
}
function DelArticle(c) {
    var f = $("#list_articles").val();
    var a = $("#list_articles_name").html();
    JsHttpRequest.query("/catalog/addinadvise.ajax.php", {id_article: c, list_id: f, list_name: a, del: 1}, function (g, h) {
        $("#list_articles").val(g.list_id);
        $("#list_articles_name").html(g.list_name);
        $("#articles_block").css("height", parseInt(g.height) + "px")
    }, true)
}
function hasClass(c, a) {
    if (c && c.parentNode && c.parentNode.className != undefined) {
        return c.parentNode.className.match("(^| )" + a + "($| )")
    }
    return false
}
function hasIDName(c, a) {
    return c.parentNode.id.match("(^| )" + a + "($| )")
}
function genrelist() {
    var c = $("#genre-list-tooltip");
    if (c.is(":hidden")) {
        var a = getBounds($("#genre-list-link").get(0));
        c.css({left: a.left + a.width - 500 + "px", top: a.top + 20 + "px"}).fadeIn(500)
    } else {
        c.fadeOut(500)
    }
}
function toggle(j) {
    var h = $("#" + j);
    if (h.is(":hidden")) {
        var c = getBounds($("#product-info").get(0));
        var a = getBounds($("#view-contents").get(0));
        h.show();
        var g = getBounds($("#contents-arrow").get(0));
        var f = getBounds($("#contents-tooltip").get(0));
        $("#contents-arrow").css("top", f.height / 2 - g.height / 2 + 2 + "px");
        $("#contents-tooltip").css("top", a.top + a.height / 2 - c.top - f.height / 2 + "px")
    } else {
        h.hide()
    }
}
function getBounds(a) {
    var g = a.offsetLeft;
    var f = a.offsetTop;
    for (var c = a.offsetParent; c; c = c.offsetParent) {
        g += c.offsetLeft;
        f += c.offsetTop
    }
    return{left: g, top: f, width: a.offsetWidth, height: a.offsetHeight}
}
function getCookie(c) {
    var g = " " + document.cookie;
    var f = " " + c + "=";
    var h = null;
    var j = 0;
    var a = 0;
    if (g.length > 0) {
        j = g.indexOf(f);
        if (j != -1) {
            j += f.length;
            a = g.indexOf(";", j);
            if (a == -1) {
                a = g.length
            }
            h = unescape(g.substring(j, a))
        }
    }
    return(h)
}
function setCookie(f, g) {
    cswitch = getCookie("cswitch");
    if (!cswitch) {
        var c = new Date();
        d = new Date(c.getTime() + 7790000000);
        var a = f + "=" + escape(g) + ";expires=" + d.toGMTString() + ";path=/ ;";
        document.cookie = a
    }
}
function deleteCookie(a, f, c) {
    if (getCookie(a)) {
        document.cookie = a + "=" + ((f) ? ";path=" + f : "") + ((c) ? ";domain=" + c : "") + ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
    }
}
function delshoping(f, a) {
    if (a == "") {
        a = 0
    }
    if (a == 1) {
        var c = "/buy.php?check=1&id=" + f;
        window.location = c
    } else {
        if (a == 2) {
            var c = "/buy.php?check=1&step=1&id=" + f;
            window.location = c
        } else {
            var c = "/buy.php?id=" + f;
            window.open(c, "", "toolbar=0,location=0,menubar=0,scrollbars=0,resizable=0,width=10,height=10,top=20000,left=20000")
        }
    }
}
function delshoping2(f, a) {
    if (a == "") {
        a = 0
    }
    if (a == 1) {
        var c = "/buy.php?check=1&ido=" + f;
        window.location = c
    } else {
        var c = "/buy.php?ido=" + f;
        window.open(c, "", "toolbar=0,location=0,menubar=0,scrollbars=0,resizable=0,width=10,height=10,top=20000,left=20000")
    }
}
function screenshot(c) {
    var f = c.href;
    window.open(f, "Screenshot", "width=932,height=800,scrollbars=yes,resizable=yes");
    return false
}
function autotarif() {
    var a = "/catalog/popuptarif.php";
    window.open(a, "calculator", "width=643,height=762,top=100, left=200, menubar=no,status=no,location=no,toolbar=no,scrollbars=yes,resizable=yes")
}
function fragment(c) {
    var a = "/fragment/" + c + "/";
    this.window.open(a, "Fragment", "width=872,height=612,scrollbars=yes,resizable=yes")
}
function commentpic(a, f) {
    var c = "/commentpic/" + a + "/" + f + "/";
    window.open(c, "Screenshot", "width=872,height=612,scrollbars=yes,resizable=yes")
}
function advisepic(a, g, f) {
    var c = "/advisepic/" + g + "/" + a + "/" + f + "/";
    window.open(c, "Screenshot", "width=872,height=612,scrollbars=yes,resizable=yes")
}
function alreadyInBasket(a) {
    var c = p(a);
    c.find("#buy" + a).html('<a href="' + CARTPATH + '">В корзине</a>');
    c.data("inbasket", 1)
}
function alreadyInBasketOffer(c) {
    var f = "buyof" + c;
    for (i = 0; i < document.getElementsByTagName("span").length; i++) {
        var a = document.getElementsByTagName("span")[i];
        if (a.id == f) {
            a.innerHTML = '<a href="' + CARTPATH + '">В корзине</a>'
        }
    }
}
function alreadyInBasketCharity(c) {
    var f = "buychar" + c;
    for (i = 0; i < document.getElementsByTagName("span").length; i++) {
        var a = document.getElementsByTagName("span")[i];
        if (a.id == f) {
            a.innerHTML = '<a href="' + CARTPATH + '">В корзине</a>'
        }
    }
}
function p(a) {
    return $("div[data-product-id=" + a + "]")
}
var pleft = 0;
var ptop = 0;
var incr = 0;
var id_books = 0;
var bwidth = 0;
var show = 1;
function showpicture(h, r, m, s, o, c, q, l) {
    if (getCookie("dontshowbig")) {
        dont_showbig = getCookie("dontshowbig")
    } else {
        dont_showbig = 0
    }
    if (dont_showbig != 1) {
        var t = p(h);
        if (t.parents(".b-suggests").length) {
            return false
        }
        id_books = h;
        bwidth = r;
        picturediv = document.getElementById("bigpic");
        var j = t.find("a.cover").attr("href");
        pleft = s.x - 15;
        ptop = s.y - 15;
        var f = 2 - id_books % 2;
        if (navigator.userAgent.indexOf("MSIE 7.0") != -1) {
            pleft -= 11
        }
        picturediv.style.left = pleft + "px";
        picturediv.style.top = ptop + "px";
        var n = 0;
        if (t.find(".reviews-val").length > 0) {
            n = t.find(".reviews-val").html()
        }
        var g = "";
        if (q == 1) {
            if (t.data("inbasket") != 1) {
                g = "<a id='cover-buy-button' class='cover-buy-button' onmousemove='show=1' onclick='shopingnew(" + id_books + "," + l + ");'><span>В корзину</span></a>"
            } else {
                g = "<a id='cover-buy-button' class='cover-buy-button done' onmousemove='show=1' href='" + CARTPATH + "'><span>Оформить</span></a>"
            }
        }
        var a = t.find(".cover img").data("src") || t.find(".cover img").data("oldsrc") || t.find(".cover img").attr("src");
        var k = a.replace("small.jpg", "");
        picturediv.innerHTML = "<div onmouseout='hidepicture()' onmousemove='show=1'><a href='" + j + "'><img id='" + id_books + "' src='" + k + "small.jpg'></a></div>" + g + "<div id='bigpic-bottom' onmouseout='hidepicture()' onmousemove='show=1'>" + (t.length > 0 ? "<div class='product-icons-outer'><div class='product-icons'><div class='product-icons-inner'>" + (n > 0 ? "<a title='Рецензий: " + n + "' rel='nofollow' href='/reviews/goods/" + id_books + "/' class='reviews'><span class='reviews-val'>" + n + "</span><i class='r4'></i><i class='r3'></i><i class='r2'></i><i class='r1'></i></a>" : "") + (t.data("metkascreenshot") == 1 ? "<a title='Иллюстрации' rel='nofollow' onclick='return screenshot(this);' href='/screenshot/goods/" + id_books + "/1/' class='screens'></a>" : "") + (t.data("incompare") == 1 ? "<a title='Перейти к сравнению' rel='nofollow' class='compare done' href='/compare/" + t.data("dir") + "/'></a>" : "<a title='Добавить товар к сравнению' rel='nofollow' onclick='return compare(" + id_books + ', "' + t.data("sgenre") + "\");' class='compare' data-idtov='" + id_books + "'></a>") + (t.data("inputorder") == 1 ? "<a title='Перейти в отложенные' rel='nofollow' class='fave done' href='/cabinet/putorder/'></a>" : "<a title='Добавить товар в отложенные' rel='nofollow' onclick='return putbook(" + id_books + ");' class='fave'  data-idtov='" + id_books + "'></a>") + "</div></div></div>" : "") + "<div id='loading-pic' onmouseout='hidepicture()' onmousemove='show=1'></div><span class='dontshowbig' onclick='dontshowbig(true); hidepicture();'>Не увеличивать</span></div>";
        bpic = new Image();
        bpic.onload = function () {
            document.getElementById("loading-pic").style.display = "none";
            pic.src = bpic.src
        };
        bpic.src = k + "big.jpg";
        pic = document.getElementById(id_books);
        pic.width = o;
        picturediv.style.display = "block";
        increase()
    }
}
function randomMoving(f) {
    var c = Math.round(Math.random() * 200);
    var a = Math.round(Math.random() * 200);
    var k = Math.round(Math.random() * 11);
    var g = Math.round(Math.random() * 11);
    var j = "+=" + (k < 6 ? (-1) : 1) * c + "px";
    var h = "+=" + (g < 6 ? (-1) : 1) * a + "px";
    $(f).animate({left: j, top: h}, 400);
    setTimeout(function () {
        randomMoving(f)
    }, 400)
}
function setObjectPosition(a) {
    var c = absPosition(a);
    $(a).css("position", "absolute");
    $(a).css("top", c.y ? c.y : "300px");
    $(a).css("left", c.x ? c.x : "100px")
}
var countBookRuns = 0;
var isIE = (String(typeof(document.all)) != "undefined");
var runTime = new Date();
var lastRunTime = runTime.getTime();
function showpicture2(k, h, g, a) {
    var c = new Date();
    var j = c.getTime();
    if ((j - lastRunTime) / 1000 >= 0.5) {
        h.onmouseover = null;
        var f = h.parentNode.parentNode.parentNode;
        setObjectPosition(f);
        randomMoving(f);
        if (countBookRuns == 1) {
            setObjectPosition($("div#main-menu"));
            randomMoving($("div#main-menu"))
        }
        if (countBookRuns == 2) {
            setObjectPosition($("div#visit-menu"));
            randomMoving($("div#visit-menu"))
        }
        if (countBookRuns == 3) {
            setObjectPosition($("div#navigation-left"));
            randomMoving($("div#navigation-left"))
        }
        if (countBookRuns == 4) {
            setObjectPosition($("div#navigation-right-right"));
            randomMoving($("div#navigation-right-right"))
        }
        if (countBookRuns == 5) {
            setObjectPosition($("div#navigation-right-left"));
            randomMoving($("div#navigation-right-left"))
        }
        countBookRuns++;
        lastRunTime = j
    }
}
function hidepicture2(j, f, c, a) {
    var g = 85;
    var h = 130;
    $(f).animate({width: g + "px", height: h + "px", left: "+=" + (c - g) / 2 + "px", top: "+=" + (a - h) / 2 + "px"});
    spic = new Image();
    spic.onload = function () {
        f.src = spic.src
    };
    spic.src = "http://img.labirint.ru/images/books4/" + j + "/small.jpg"
}
function hidepicture() {
    show = 0;
    setTimeout(starthide, 10)
}
function starthide() {
    if (show == 0) {
        document.getElementById("bigpic-bottom").style.display = "none";
        pic.width = pic.width - 10;
        pleft = pleft + 5;
        ptop = ptop + 5;
        picturediv.style.left = pleft + "px";
        picturediv.style.top = ptop + "px";
        if (pic.width > 100) {
            setTimeout(starthide, 0)
        } else {
            picturediv.style.display = "none"
        }
    }
}
function increase() {
    if ((pic.width + incr) > bwidth) {
        incr = (bwidth - pic.width)
    } else {
        incr = 8
    }
    pic.width = pic.width + incr;
    pleft = pleft - Math.round(incr / 2);
    ptop = ptop - Math.round(incr / 2);
    picturediv.style.left = pleft + "px";
    picturediv.style.top = ptop + "px";
    if (pic.width < bwidth) {
        setTimeout(increase, 10)
    } else {
        if (bpic.complete) {
            pic.src = bpic.src
        } else {
            document.getElementById("loading-pic").style.display = "block"
        }
        document.getElementById("bigpic-bottom").style.display = "block";
        if (document.getElementById("cover-buy-button")) {
            document.getElementById("cover-buy-button").style.display = "inline"
        }
    }
}
function dontshowbig(a) {
    UserSes = getCookie("UserSes");
    if (a) {
        setCookie("dontshowbig", "1");
        big_pics_stat(UserSes, "dontshow")
    } else {
        setCookie("dontshowbig", "0");
        big_pics_stat(UserSes, "show")
    }
}
function absPosition(c) {
    var a = y = 0;
    while (c) {
        a += c.offsetLeft;
        y += c.offsetTop;
        c = c.offsetParent
    }
    return{x: a, y: y}
}
var your_mark = 0;
function fillstar(c) {
    var a = Array("", "Хуже не бывает", "Очень плохо", "Плохо", "Ниже среднего", "Средне", "Выше среднего", "Нормально", "Хорошо", "Отлично", "Лучше не бывает!");
    document.getElementById("count-marks-label").style.display = "none";
    document.getElementById("status-label").innerHTML = a[c];
    document.getElementById("status-label").style.display = "block";
    for (i = 1; i <= c; i++) {
        document.getElementById("star" + i).src = "http://img.labirint.ru/images/design/zvezda.gif"
    }
    for (i = c + 1; i <= 10; i++) {
        document.getElementById("star" + i).src = "http://img.labirint.ru/images/design/zvezda2.gif"
    }
}
function outstar() {
    if (your_mark > 0) {
        fillstar(your_mark)
    }
    document.getElementById("status-label").style.display = "none";
    document.getElementById("count-marks-label").style.display = "block"
}
var FadeInterval = 300;
var StartFadeAt = 6;
var FadeSteps = [];
FadeSteps[FadeSteps.length] = "#ececec";
FadeSteps[FadeSteps.length] = "#eaeaea";
FadeSteps[FadeSteps.length] = "#e7e7e7";
FadeSteps[FadeSteps.length] = "#e5e5e5";
FadeSteps[FadeSteps.length] = "#e2e2e2";
FadeSteps[FadeSteps.length] = "#dfdfdf";
FadeSteps[FadeSteps.length] = "#dcdcdc";
FadeSteps[FadeSteps.length] = "#dadada";
FadeSteps[FadeSteps.length] = "#d7d7d7";
FadeSteps[FadeSteps.length] = "#d5d5d5";
FadeSteps[FadeSteps.length] = "#d2d2d2";
FadeSteps[FadeSteps.length] = "#d5d5d5";
FadeSteps[FadeSteps.length] = "#d7d7d7";
FadeSteps[FadeSteps.length] = "#dadada";
FadeSteps[FadeSteps.length] = "#dcdcdc";
FadeSteps[FadeSteps.length] = "#dfdfdf";
FadeSteps[FadeSteps.length] = "#e2e2e2";
FadeSteps[FadeSteps.length] = "#e5e5e5";
FadeSteps[FadeSteps.length] = "#e7e7e7";
FadeSteps[FadeSteps.length] = "#eaeaea";
FadeSteps[FadeSteps.length] = "#ececec";
FadeSteps[FadeSteps.length] = "#efefef";
FadeSteps[FadeSteps.length] = "#f2f2f2";
FadeSteps[FadeSteps.length] = "#f5f5f5";
FadeSteps[FadeSteps.length] = "#f7f7f7";
FadeSteps[FadeSteps.length] = "#fafafa";
FadeSteps[FadeSteps.length] = "#fcfcfc";
FadeSteps[FadeSteps.length] = "#ffffff";
function DoFade(c, a) {
    if (c >= 0) {
        document.getElementById(a).style.backgroundColor = FadeSteps[c];
        if (c == 0) {
            document.getElementById(a).style.backgroundColor = "#efefef"
        }
        c--;
        setTimeout("DoFade(" + c + ",'" + a + "')", FadeInterval)
    }
}
function checkAuthorize(a) {
    document.getElementById("authorize").style.display = "block";
    document.getElementById("authorize").style.top = "800px";
    document.getElementById("authorize").style.top = (getElementPosition(a) - 50) + "px"
}
function getElementPosition(f) {
    var a = f;
    var c = 0;
    while (a) {
        c += a.offsetTop;
        a = a.offsetParent
    }
    return c
}
function authorizeClose() {
    document.getElementById("authorize").style.display = "none"
}
function onScroll_center() {
    var a = clientHeight();
    var c = document.compatMode == "CSS1Compat" && !window.opera ? document.documentElement : document.body;
    if (document.getElementById("authorize")) {
        document.getElementById("authorize").style.top = c.scrollTop + 250 + "px"
    }
    if (document.getElementById("change_region")) {
        document.getElementById("change_region").style.top = c.scrollTop + 250 + "px"
    }
}
function clientHeight() {
    return document.compatMode == "CSS1Compat" && !window.opera ? document.documentElement.clientHeight : document.body.clientHeight
}
function show_tag_add(c) {
    var a = document.getElementById("tags-add-cont");
    if (a.style.display == "block") {
        a.style.display = "none";
        c.className = "closed"
    } else {
        a.style.display = "block";
        c.className = "opened"
    }
}
function show_win(c) {
    var a = document.getElementById(c);
    if (a.style.display == "block") {
        a.style.display = "none"
    } else {
        a.style.display = "block"
    }
}
document.onclick = function (h) {
    if (typeof dont_close_my_tags == "undefined") {
        var c = (String(typeof(document.all)) != "undefined");
        var g = c ? event.srcElement : h.target;
        var a = document.getElementById("tags_book_tags");
        var f = document.getElementById("tags_your_tags");
        if (a && a.style.display == "block" && g.parentNode.id != "tags_book_tags_cont") {
            a.style.display = "none"
        }
        if (f && f.style.display == "block" && g.parentNode.id != "tags_your_tags_cont") {
            f.style.display = "none"
        }
    }
};
function copy_tag(a) {
    var c = document.forms.add_tag_form;
    c.tag.value = a.replace(/%27|%22|%26/g, decodeURIComponent);
    c.tag.focus()
}
function showallprops(a) {
    for (var c in a) {
        displayLine = a.name + "." + c + "=" + a[c];
        document.write(displayLine + "<BR>")
    }
}
function confirmDel() {
    if (confirm("Удалить?")) {
        return true
    } else {
        return false
    }
}
function showGiftPack(a, c) {
    if ($("#gift_packing_body").css("display") == "none") {
        $("#gift_packing_body").slideDown(600);
        $("#head_label").addClass("disabled");
        document.forms.asd.giftpack.value = "1"
    } else {
        $("#gift_packing_body").slideUp(600);
        $("#head_label").attr("class", "");
        document.forms.asd.giftpack.value = ""
    }
}
function showGiftPackType(a) {
    if ($("#box_radio").attr("checked")) {
        $("#gift_box_body").slideDown(600);
        $("#gift_box_head > label").addClass("disabled");
        $("#gift_paper_body").slideUp(600);
        $("#gift_paper_head > label").attr("class", "")
    } else {
        if ($("#paper_radio").attr("checked")) {
            $("#gift_paper_body").slideDown(600);
            $("#gift_paper_head > label").addClass("disabled");
            $("#gift_box_body").slideUp(600);
            $("#gift_box_head > label").attr("class", "")
        }
    }
}
function giftImgHl(a) {
    $(a).attr("class", "sel_label_active")
}
function giftImgUnhl(a) {
    $(a).attr("class", "sel_label")
}
function selectGiftBox(a) {
    $("#box_price_label").text(box_prices[a.value] != undefined ? box_prices[a.value] + " ." : "");
    var c = $("td.price:last span", a.parentNode.parentNode.parentNode);
    c.text(200 + (document.forms.asd.hasBowBox.checked ? 50 : 0) + (box_prices[a.value] != undefined ? box_prices[a.value] : 0))
}
function addGiftBow(c) {
    var a = $("td.price:last span", c.parentNode.parentNode.parentNode);
    if (c.checked) {
        $("td.price", c.parentNode.parentNode).text("50 .");
        a.text(a.text() * 1 + 50)
    } else {
        $("td.price", c.parentNode.parentNode).text("");
        a.text(a.text() * 1 - 50)
    }
}
function showGiftPaperBig(l, k) {
    var g = (String(typeof(document.all)) != "undefined");
    var j = (g ? event.clientX : k.clientX);
    var h = (g ? event.clientY : k.clientY);
    var a = $("img.sel_label", l.parentNode);
    $("#gift_paper_big").css("display", "none");
    $("#gift_paper_big").empty();
    var f = l.id.substring(5);
    if (l.id.substring(0, 5) == "paper") {
        var c = $("<img />").attr("src", "http://img.labirint.ru/images/gift_paper/" + f + ".jpg").attr("width", 300).attr("height", 300).appendTo($("#gift_paper_big"))
    } else {
        var c = $("<img />").attr("src", "http://img.labirint.ru/images/books/" + f + "/big.jpg").attr("width", 220).attr("height", 340).appendTo($("#gift_paper_big"))
    }
    setInScreen($("#gift_paper_big"), j, h);
    $("#gift_paper_big").fadeIn(300)
}
function setInScreen(h, c, k) {
    var f = $("body").width() - document.body.parentNode.scrollLeft - 20;
    var j = $("body").height() - document.body.parentNode.scrollTop - 20;
    var g = h.width();
    var a = h.height();
    if ((c + g) > f) {
        var c = c - g - 10
    }
    if ((k + a) > j) {
        var k = k - a - 10
    }
    $(h).css("left", document.body.parentNode.scrollLeft + c - 10);
    $(h).css("top", document.body.parentNode.scrollTop + k - 10)
}
function selectGiftPaper(c) {
    var a = $(c.parentNode.parentNode.parentNode);
    $("div:first", a).remove();
    var f = $(c.parentNode).clone().css("float", "right").prependTo($(a));
    $("img:first", f).attr("class", "sel_label");
    $("img:first", f).attr("onclick", "");
    var g = $(a).attr("id");
    $("input[name=" + g + "]").attr("value", c.id)
}
function selectPostcard(a) {
    selectGiftPaper(a);
    var c = $(a.parentNode.parentNode.parentNode.parentNode);
    $("textarea", c).attr("class", "postcard_comment")
}
function itemAddToList(c, f) {
    if ($("#selected_items_head").css("display") == "none") {
        $("#selected_items_head").css("display", "block")
    }
    b = false;
    $("input:checkbox", "#selected_items").each(function () {
        if ($(this).attr("value") == f) {
            b = true
        }
    });
    if (b == true) {
        if (confirm("Уже в списке! Вы точно хотите добавить запись?") == false) {
            return
        }
    }
    var a = $('<input type="checkbox">').attr("name", "items[]").attr("value", f).appendTo($("#selected_items")).attr("checked", 1);
    $("#selected_items").append($(c.parentNode).children("span").text() + "<br />");
    $(c.parentNode).empty().css("display", "none")
}
function fullCommentShow(f) {
    var c = f.parentNode.parentNode;
    var g = c.childNodes;
    for (var h in g) {
        if (g[h].id != "undefined" && g[h].style) {
            g[h].style.display = "block";
            var a = $(g[h]).find(".comment-user-pic");
            a.find(".lazyload").lazyload({area: a, events: null, scroll: false})
        }
    }
    f.parentNode.style.display = "none"
}
function AdviceSearch() {
    var c = document.getElementById("advises-search-opened");
    var a = document.getElementById("search_advise");
    if (c.style.display == "block") {
        a.className = "search_advise_cl";
        c.style.display = "none"
    } else {
        a.className = "search_advise_op";
        c.style.display = "block"
    }
}
function helpcard_open_scr(c, a) {
    window.open("/screenshelp/" + c + "/" + a + "/", "screenshelp" + c + a, "width=872,height=612,scrollbars=yes,resizable=yes")
}
function helpcard_open(a) {
    window.open("/helpcard/" + a + "/", "helpcard" + a, "width=800,height=540,scrollbars=yes,resizable=yes")
}
function helpcard_open_isadmin(a) {
    window.open("/helpcard/" + a + "/isadmin/", "helpcard" + a, "width=800,height=540,scrollbars=yes,resizable=yes")
}
function check_other_subject(a) {
    document.getElementById("other_subject").style.display = (a.value == 5 ? "block" : "none")
}
function changeCallDay(a) {
    document.getElementById("time").style.display = (a > 0 ? "block" : "none")
}
var currentContenPage = 1;
function contenPage(c) {
    $("#contents_page" + currentContenPage).hide();
    $("#contents_page" + c).show();
    var a = $("<a></a>").attr("href", "javascript: contenPage(" + currentContenPage + ");").html(currentContenPage);
    $("#contents_page_num" + currentContenPage).html(a);
    $("#contents_page_num" + c).html(c);
    currentContenPage = c
}
function dhmyoncm() {
    var a = document.getElementById("dhcena");
    var c = document.getElementById("dhmassa");
    var g = document.getElementById("dhcena").value;
    var f = document.getElementById("dhmassa").value;
    if (g == "") {
        alert('Не заполнено поле "Цена"!');
        a.focus();
        return false
    } else {
        if (f == "") {
            alert('Не заполнено поле "Вес"!');
            c.focus();
            return false
        } else {
            if (isNaN(g)) {
                alert('В поле "Цена" введено не число!');
                a.focus();
                return false
            } else {
                if (isNaN(f)) {
                    alert('В поле "Вес" введено не число!');
                    c.focus();
                    return false
                } else {
                    return true
                }
            }
        }
    }
}
var dhshowautohelp = true, autocache = {}, ahelptmptxt = {}, autohelptimeout = null, autohelpelement = null;
function autohelp_timeout(h, k) {
    if (dhshowautohelp) {
        var m = h;
        if (m != 16 && m != 17 && m != 18 && m != 13 && m != 20 && m != 192 && m != 37 && m != 38 && m != 39 && m != 40 && m != 116) {
            autohelp_change(k)
        }
        if (m == 38 || m == 40 || m == 13) {
            if (k == 1) {
                var l = "autohelp_rows";
                var j = document.getElementById("search-field")
            } else {
                if (k == 10) {
                    var l = "autohelp_rows_fixed";
                    var j = document.getElementById("search-field-fixed")
                } else {
                    if (k == 7 || k == 8 || k == 9) {
                        var l = "autohelp_rows_list";
                        var j = document.forms.list_search.lit
                    } else {
                        if (k == 6) {
                            var l = "autohelp_rows_genre";
                            var j = document.forms.genre_search.txt
                        } else {
                            if (k == 4) {
                                var l = "autohelp_rows_big";
                                var j = document.forms.searchformadvanced.helptxt
                            } else {
                                if (k == 3) {
                                    var l = "autohelp_rows_big";
                                    var j = document.getElementById("txtwordsadv")
                                } else {
                                    if (k == 2) {
                                        var l = "autohelp_rows_width";
                                        var j = document.getElementById("txtwords")
                                    }
                                }
                            }
                        }
                    }
                }
            }
            l = $("#" + l);
            j = $(j);
            selclass = "active-li";
            if (m == 13) {
                var a = l.find("ul.ahelp-ul li.active-li a").attr("href");
                if (typeof a != "undefined" && (a.substr(1, 5) == "books" || a.substr(1, 7) == "authors" || a.substr(1, 8) == "pubhouse")) {
                    window.location = a
                }
                return false
            }
            if (l.is(":visible")) {
                var f = -1;
                var c = false;
                var g = l.find("ul.ahelp-ul li[class!=ahelp-li-close]");
                g.each(function (n) {
                    if ($(this).hasClass(selclass)) {
                        f = m == 40 ? n + 1 : n - 1;
                        c = true;
                        $(this).removeClass(selclass);
                        return false
                    }
                });
                if (!c) {
                    ahelptmptxt[k] = j.val()
                }
                if (f == -1) {
                    if (m == 40) {
                        f = 0
                    } else {
                        if (m == 38 && c) {
                            f = g.length
                        } else {
                            if (m == 38 && !c) {
                                f = g.length - 1
                            }
                        }
                    }
                }
                if (f >= 0 && f < g.length) {
                    l.find("ul.ahelp-ul li:eq(" + f + ")").each(function () {
                        $(this).addClass(selclass);
                        j.val($(this).find("span.ahelp-item").text())
                    })
                } else {
                    j.val(ahelptmptxt[k])
                }
            }
        }
    }
}
function autohelp_show(h, a, f, k, c, j, g) {
    if (h) {
        c.html(h).show();
        if (j) {
            c.css({left: j, right: 0, width: "auto", marginLeft: 0})
        } else {
            if (g) {
                c.width(g)
            }
        }
        c.find(".product-placeholder").each(function () {
            var l = $(this).data("id");
            $(this).load("/suggests/getproduct/" + l + "/", function () {
                $(this).removeClass("product-placeholder");
                c.find(".book-img-cover").lazyload({callback: function () {
                    autocache[k][f][a] = c.html()
                }, resetImgSize: true})
            })
        })
    }
}
function autohelp_request(g, l, a, f, k, c, j, h) {
    if (JsHttpRequestXHR != null) {
        JsHttpRequestXHR.abort()
    }
    JsHttpRequestXHR = JsHttpRequest.myquery(g, l || {txt: a, dhp: f}, function (m, n) {
        if (m) {
            if (!m.err || m.err == "no") {
                if (m.html) {
                    autocache[k][f][a] = m.html;
                    autohelp_show(autocache[k][f][a], a, f, k, c, j, h)
                } else {
                    c.hide()
                }
            } else {
                c.hide()
            }
        }
    }, true)
}
function autohelp_change(r, g) {
    var k = null;
    if (dhshowautohelp) {
        if (r == 1) {
            var l = document.getElementById("search-field").value;
            var s = "autohelp_rows";
            var q = "/ajax.php";
            k = {cl_name: "suggests", me_name: "advanced", txt: l, dhp: r}
        } else {
            if (r == 10) {
                var l = document.getElementById("search-field-fixed").value;
                var s = "autohelp_rows_fixed";
                var q = "/ajax.php";
                k = {cl_name: "suggests", me_name: "advanced", txt: l, dhp: r}
            } else {
                if (r == 7 || r == 8 || r == 9) {
                    var l = document.forms.list_search.lit.value;
                    var s = "autohelp_rows_list";
                    var q = "/catalog/autohelp.ajax.php"
                } else {
                    if (r == 6) {
                        var l = document.forms.genre_search.txt.value;
                        var s = "autohelp_rows_genre";
                        var q = "/catalog/autohelp.ajax.php"
                    } else {
                        if (r == 4) {
                            var l = document.forms.searchformadvanced.helptxt.value;
                            var s = "autohelp_rows_big";
                            var q = "/catalog/autohelp.ajax.php"
                        } else {
                            if (r == 3) {
                                var l = document.getElementById("txtwordsadv").value;
                                var s = "autohelp_rows_big";
                                var q = "/catalog/autohelp.ajax.php"
                            } else {
                                if (r == 2) {
                                    var l = document.getElementById("txtwords").value;
                                    var s = "autohelp_rows_width";
                                    var q = "/catalog/autohelp.ajax.php"
                                }
                            }
                        }
                    }
                }
            }
        }
        var a = $.trim(l).length;
        if (a > 1 || (a != 1 && (s == "autohelp_rows" || s == "autohelp_rows_fixed"))) {
            var o = document.getElementById(s), n = $(o), j = n.data("id"), f = $(j), h = n.data("width") || f.width(), m;
            if (n.data("full")) {
                var c = f.position();
                m = c.left
            }
            if (typeof autocache[s] == "undefined") {
                autocache[s] = {};
                autocache[s][r] = {}
            }
            if (typeof autocache[s][r] == "undefined") {
                autocache[s][r] = {}
            }
            if (!autocache[s][r][l]) {
                autohelp_request(q, k, l, r, s, n, m, h)
            } else {
                autohelp_show(autocache[s][r][l], l, r, s, n, m, h)
            }
        } else {
            $("#" + s).hide()
        }
    }
}
function open_helpercard(id, search) {
    var file_name = "/catalog/helpercard.ajax.php";
    var list = document.getElementById("CardHelp" + id);
    list.innerHTML = '<div style="width:100%; text-align: center;"><img src="http://img.labirint.ru/images/design/loadingnew.gif"></div>';
    JsHttpRequest.query(file_name, {id: id, search: search}, function (result, errors) {
        if (result.err == "no") {
            if (result.html) {
                list.innerHTML = "";
                list.innerHTML = result.html;
                eval(result.js);
                var childs = $("div", document.getElementById("CardHelp" + id));
                for (var i in childs) {
                    if (childs[i] != undefined && childs[i].id != undefined && childs[i].id.substr(0, 7) == "YMapsID") {
                        var id_map = childs[i].id.substr(7, childs[i].id.length - 1);
                        loadMiniMap(id_map)
                    }
                }
            }
        } else {
            list.innerHTML = result.log
        }
    }, true)
}
function dhdisplaynone(a, g, c) {
    if (dhshowautohelp) {
        var f = "";
        if (a == 1) {
            f = "autohelp_rows"
        } else {
            if (a == 10) {
                f = "autohelp_rows_fixed"
            } else {
                if (a == 3 || a == 4) {
                    f = "autohelp_rows_big"
                } else {
                    if (a == 2) {
                        f = "autohelp_rows_width"
                    } else {
                        if (a == 5) {
                            f = "postlist"
                        } else {
                            if (a == 6) {
                                f = "autohelp_rows_genre"
                            } else {
                                if (a == 7 || a == 8 || a == 9) {
                                    f = "autohelp_rows_list"
                                }
                            }
                        }
                    }
                }
            }
        }
        if (f) {
            g = typeof g == "number" ? g : 0;
            if (typeof c != "undefined") {
                autohelpelement = c
            }
            autohelptimeout = setTimeout(function () {
                document.getElementById(f).style.display = "none"
            }, g)
        }
    }
}
function dhautohelpclose() {
    dhshowautohelp = false;
    $("#autohelp_rows_big,#autohelp_rows_width,#autohelp_rows,#autohelp_rows_fixed,#autohelp_rows_genre,#autohelp_rows_list").css("display", "none")
}
function alreadyInCompList(c, g, a) {
    var f = p(c);
    f.data("incompare", 1);
    $(".compare[data-idtov=" + c + "]").each(function () {
        var j = $(this), h = j.data("html");
        j.attr({title: "Перейти к сравнению", href: "/compare/" + gnres[g]}).addClass("done").removeAttr("onclick").unbind("click");
        j.find("span").html(h ? h : "")
    })
}
function compareShowContent(g, f) {
    var c = document.getElementsByTagName("div");
    var a = document.getElementsByTagName("span");
    for (i = 0; i < c.length; i++) {
        var h = c[i].id + "";
        if (h.substring(0, 6) == (f + "txt")) {
            c[i].style.display = g
        }
    }
    for (i = 0; i < a.length; i++) {
        var h = a[i].id + "";
        if (g == "block") {
            if (h.substring(0, 5) == (f + "vs")) {
                a[i].style.display = "none"
            }
            if (h.substring(0, 5) == (f + "vh")) {
                a[i].style.display = "inline"
            }
        } else {
            if (h.substring(0, 5) == (f + "vs")) {
                a[i].style.display = "inline"
            }
            if (h.substring(0, 5) == (f + "vh")) {
                a[i].style.display = "none"
            }
        }
    }
}
function selectSelfDelivery(a) {
    a = a.replace("place", "");
    showDelivery(a);
    document.forms.ShablonForm.NextStep.onclick = function () {
        writeHiddenSelfdelivery(a)
    };
    document.getElementById("delivery_maps").style.visibility = "hidden"
}
function getRegionPhones(c) {
    var a = c.value;
    $(c).addClass("upload");
    $(c).attr("disabled", "disabled");
    $("#region_phone1_phone").html("");
    $("#region_phone2_phone").html("");
    JsHttpRequest.query("/ajax.php", {func: "getRegionPhones", region: a}, function (f, g) {
        if (!f.err) {
            $("#region_phone1_phone").html(f.phones.phone1.code + " " + f.phones.phone1.number);
            $("#region_phone2_phone").html(f.phones.phone2.code + " " + f.phones.phone2.number)
        } else {
        }
        $(c).removeClass("upload");
        $(c).attr("disabled", "")
    }, true)
}
var overlay_id = null;
if (typeof jQuery != "undefined") {
    var is_ie = !!jQuery.browser.msie;
    var is_ie6 = "\v" == "v" && jQuery.browser.version == "6.0";
    var is_ie7 = "\v" == "v" && jQuery.browser.version == "7.0";
    var is_ie8 = is_ie && jQuery.browser.version == "8.0";
    var is_ie9 = is_ie && jQuery.browser.version == "9.0"
}
function overlayWindow(m) {
    switch (typeof m) {
        case"string":
            var r = m, c = null, j = true, k = "", q = "", w = null, x = null, s = false, a = false, g = false, l = false, u = "content_upload";
            break;
        case"object":
            var r = m.id, c = m.el, j = m.tobody, k = m.func, q = m.closefunc, w = m.target || null, x = m.position || null, s = m.transparent || false, a = m.nohide_prev || false, l = m.overlay_hidden || false, g = m.movetriangle || true, u = m.loadclass || "content_upload";
            break;
        default:
            return false
    }
    if (!a && overlay_id && overlay_id != r) {
        clearWindow(overlay_id)
    }
    if (!r && !(c && c.length)) {
        return false
    } else {
        if (c && c.length && !r) {
            r = c.attr("id");
            if (!r) {
                r = "b-overlay-" + (Math.floor(Math.random() * 100) + 1);
                c.attr("id", r)
            }
        }
    }
    var v = c || $("#" + r);
    var o = typeof j == "undefined" ? true : j;
    if (v.length) {
        if (o && !v.parent().is("body")) {
            v.appendTo("body")
        }
        if (!l) {
            var h = $("#overlay");
            if (h.length > 0) {
                h.show()
            } else {
                h = $("<div></div>").attr({id: "overlay"});
                if (o) {
                    h.appendTo("body")
                } else {
                    h.insertBefore(v)
                }
            }
            h.data("overlayid", r);
            if (s) {
                h.addClass("overlay-transparent")
            }
            h.unbind("click.overlay").bind("click.overlay", function () {
                clearWindow(r, q)
            });
            if (is_ie6) {
                resizeElement(h, $("body").width(), $("body").height());
                h.append("<iframe></iframe>")
            }
        }
        overlay_id = r;
        var t = "openOverlay" + r.charAt(0).toUpperCase() + r.slice(1);
        v.css({width: "", height: ""}).show();
        if (x != "fullscreen") {
            elementReposition(v, w, x, g);
            var n = clearId(r);
            if (w !== null) {
                $(window).bind("scroll." + n + " resize." + n + "", function () {
                    elementReposition(v, w, x, g)
                })
            }
        } else {
            v.css({left: 0, top: 0, marginLeft: 0, marginTop: 0, width: "100%", height: "100%"})
        }
        if (typeof k == "function") {
            k()
        } else {
            if (t && typeof window[t] == "function") {
                window[t]()
            }
        }
    }
}
function clearId(a) {
    return a.replace(/\W/g, "")
}
function elementRefresh(c, g, a, f) {
    elementReposition(c.css({width: "", height: ""}), g, a, f)
}
function elementReposition(n, t, s, g) {
    var k = $(n);
    if (typeof t == "undefined" || !t) {
        elementLocationCenter(k)
    } else {
        var j = $(t);
        if (j.length) {
            var l, x, u, r = j.offset(), q = j.width(), f = j.height(), v = k.width(), o = k.height(), c = $(".popup-limiter"), m = c.offset(), a = c.width();
            if (s === "righttop") {
                k.css({top: r.top, left: r.left + q + 10})
            } else {
                l = r.left + (q / 2 - v / 2);
                x = l;
                l = l < m.left ? m.left : (l + v > m.left + a ? m.left + a - v : l);
                k.css({top: r.top + f + 10, left: l});
                if (typeof t != "undefined" && g) {
                    k.find(".popup-window-arrow").css({backgroundPosition: (v / 2 - 11) + (x - l) + "px center"})
                }
            }
        }
    }
}
function resizeElement(f, c, a) {
    $(f).css({width: c + "px", height: a + "px"})
}
function elementLocationCenter(g) {
    var c = $(g), j = $(window).height(), l = c.height(), k = c.width();
    if (is_ie6) {
        var n = document.documentElement, m = ((n.clientHeight - l) / 2) + n.scrollTop, f = (n.clientWidth - k) / 2;
        c.css({top: (m > 0 ? m : 0) + "px", left: (f > 0 ? f : 0) + "px", height: l + "px", width: k + "px"})
    } else {
        var h = -k / 2 + "px", a = -l / 2 + "px";
        if (c.css("position") == "absolute") {
            a = -Math.min(l, j) / 2 + (c.css("position") == "absolute" ? $(window).scrollTop() : "") + "px"
        }
        c.css({"margin-left": h, "margin-top": a, height: l + "px", width: k + "px"})
    }
}
function clearWindow(l, h) {
    if (typeof l == "undefined" || !l) {
        return false
    }
    var j = "", g = $("#" + l);
    g.hide();
    j = "closeOverlay" + l.charAt(0).toUpperCase() + l.slice(1);
    if (typeof h == "function") {
        h.apply(g)
    } else {
        if (j && typeof window[j] == "function") {
            window[j].apply(g)
        }
    }
    var a = $("#overlay");
    var c = a.data("overlayid");
    if (c == l) {
        a.removeClass("overlay-transparent").hide()
    }
    var k = clearId(l);
    $(window).unbind("scroll." + k + " resize." + k + "", function () {
        elementReposition(inner, target, position, movetriangle)
    })
}
function ieScroll() {
    var c = 200;
    if (overlay_id) {
        var a = $("#" + overlay_id).height();
        var c = (document.documentElement.clientHeight - a) / 2 - 20;
        c = (c > 0 ? c : 0)
    }
    $("div.overlay_content").css("top", document.documentElement.scrollTop + c + "px")
}
function keytext(a) {
    if (navigator.appName == "Netscape") {
        if ((a.charCode > 0 && a.charCode < 48) || a.charCode > 57) {
            return false
        }
    } else {
        if (a.keyCode < 48 || a.keyCode > 57) {
            a.returnValue = false
        }
    }
}
function isEmpty(c) {
    for (var a in c) {
        return false
    }
    return true
}
function showDiv(l, c, a, j) {
    var k = $("#" + l);
    $(k).css("display", c ? "block" : "none");
    if (c) {
        var f = typeof document.documentElement != "undefined" ? document.documentElement : document.body;
        if (typeof j != "undefined" && j.id && $(j.id)) {
            var g = $(j.id).height();
            if (g) {
                $(k).css({height: g + "px"})
            }
        }
        if (a == 1) {
            $(k).css({left: 0, top: 250 + f.scrollTop})
        } else {
            if (a > 0) {
                window.scrollTo(0, a)
            }
        }
    }
}
var execTimeout = (function () {
    var c = 0;

    function a(h, g, j) {
        if (j == c) {
            h.apply(null, g)
        }
    }

    return function (j) {
        var h = 250;
        if (typeof j == "object") {
            if (typeof j.func != "function") {
                return false
            }
            if (j.timeout != undefined) {
                h = j.timeout
            }
            j = j.func
        }
        if (typeof j == "function") {
            c++;
            var g = Array.prototype.slice.call(arguments);
            g = g.slice(1);
            var k = function (m, l, o) {
                return function () {
                    a(m, l, o)
                }
            }(j, g, c);
            setTimeout(k, h)
        }
    }
}());
function sendID_Post(a) {
    var c = $("#select-post-form");
    c.find("input[name=id_post]").val(a);
    root.onbeforeunload = null;
    c.submit().loadingPanel();
    return false
}
function showPostList(a) {
    if (document.getElementById(a).innerHTML.length > 1) {
        $("#" + a).show()
    }
}
function getGTRuleAgain() {
    var a = $("#select-post-form");
    a.find("input[name=from_ip]").val(true);
    a.submit().loadingPanel()
}
function showIPQuestion(c, a) {
    $(typeof c == "string" ? "#" + c : c).css("display", a ? "block" : "none")
}
function dontshowsmall(a) {
    setCookie("dontshowsmall", a ? 1 : 0)
}
var scrnwidth = 146;
function scrnMoveRight() {
    var c = parseInt($("#small_images").css("width"));
    var f = parseInt($("#smi_list").css("width"));
    if (f < c) {
        return false
    }
    var a = parseInt($("#smi_list").css("margin-left"));
    var g = Math.floor(c / scrnwidth);
    a = Math.floor(a / scrnwidth) * scrnwidth;
    a = a - scrnwidth * g;
    if (a < -(f - c)) {
        a = c - f
    }
    $("#smi_list").animate({marginLeft: a}, 350)
}
function scrnMoveLeft() {
    var c = parseInt($("#small_images").css("width"));
    var a = parseInt($("#smi_list").css("margin-left"));
    if (a > 0) {
        return false
    }
    var f = Math.floor(c / scrnwidth);
    a = Math.floor(a / scrnwidth) * scrnwidth;
    a = a + scrnwidth * f;
    if (a > 0) {
        a = 0
    }
    $("#smi_list").animate({marginLeft: a}, 350)
}
function ltrim(a) {
    return a.replace(/^\s+/, "")
}
function rtrim(a) {
    return a.replace(/\s+$/, "")
}
function trim(a) {
    return rtrim(ltrim(a))
}
function htmlspecialchars(a) {
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}
var glavskazlimit = 0;
function chekGlavskazkaBonus() {
    var c = 0;
    for (var a = 1; a < 7; a++) {
        if ($("#glavskazka" + a).attr("checked")) {
            c++
        }
    }
    if (c >= glavskazlimit) {
        for (var a = 1; a < 7; a++) {
            if (!$("#glavskazka" + a).attr("checked")) {
                $("#glavskazka" + a).attr("disabled", true)
            } else {
                $("#glavskazka" + a).attr("disabled", false)
            }
        }
    } else {
        $("#glavskazkabonus input").attr("disabled", false)
    }
}
function writesearchform(g, a, c) {
    var f = "";
    if (typeof c == "object") {
        for (id in c) {
            f += '<input type="hidden" name="' + id + '" value="' + c[id] + '" />'
        }
    }
    document.write('<div id="sale-search" style="margin: 0px 20px 0px 0px; z-index: 1000;"><div id="search"><div id="searchadvvip"><div class="searchadv-top"><div class="searchadv-left"><div class="searchadv-right"><div class="searchadv-bottom"><div class="searchadv-topleft"><div class="searchadv-bottomleft"><div class="searchadv-topright"><div class="searchadv-bottomright"><div class="more">Поиск по каталогу:</div><form name="salesearch" action="' + g + '" method="get">' + f + '<div id="list-hidden" style="width: 0px; float: left;"></div><div class="searchadvleft"><input autocomplete="off" type="text" id="txtwordsadv" value="" class="input-width keyboardInput adv" name="' + a + '" /><br /></div><div class="searchadvright"><input type="submit" class="red-button-adv" value="Найти" /></div></form></div></div></div></div></div></div></div></div></div></div></div><div class="cleaner"></div>')
}
function showepicture(f, k, j, h, c, g) {
    if (!getCookie("dontshowbig")) {
        bwidth = k;
        picturediv = document.getElementById("bigpic");
        var a = document.getElementById("href" + f).href;
        pleft = j.x;
        ptop = j.y;
        if (navigator.userAgent.indexOf("MSIE 7.0") != -1) {
            pleft -= 11
        }
        if (c == 1) {
            str_buy_batton = "<div id='cover-buy-button' class='cover-buy-button' onmouseout='hidepicture()' onmousemove='show=1' onclick=' shoping(" + f + "," + g + "); hidepicture();'><img src='http://img.labirint.ru/images/design/kupit.gif'></div>"
        } else {
            str_buy_batton = ""
        }
        picturediv.style.left = pleft + "px";
        picturediv.style.top = ptop + "px";
        picturediv.innerHTML = "<div onmouseout='hidepicture()' onmousemove='show=1'><a href='" + a + "'><img id='" + f + "' src='http://img.labirint.ru/images/ebooks/" + f + "/small.jpg'></a></div>" + str_buy_batton + "<div id='loading-pic' onmouseout='hidepicture()' onmousemove='show=1'>Загружается...<img src='http://img.labirint.ru/images/design/upload.gif'></div><div id='noshow' onmouseout='hidepicture()' onmousemove='show=1'><input type='checkbox' onChange='dontshowbig(this.checked)' onmousemove='show=1'> Не показывать всплывающие обложки</div>";
        bpic = new Image();
        bpic.onload = function () {
            document.getElementById("loading-pic").innerHTML = "";
            pic.src = bpic.src
        };
        if (c == 1 && navigator.userAgent.indexOf("MSIE 7.0") != -1) {
            document.getElementById("cover-buy-button").style.bottom = "144px"
        }
        bpic.src = "http://img.labirint.ru/images/ebooks/" + f + "/big.jpg";
        pic = document.getElementById(f);
        pic.width = h;
        picturediv.style.display = "block";
        increase()
    }
}
function captchaRefresh(f) {
    var a = $("#" + f);
    var c = $("<img>").css("vertical-align", "middle");
    var g = a.find("img").attr("src");
    g = g.replace(/&r=[0-9\.]+/, "");
    c.load(function () {
        a.html(c)
    });
    c.attr("src", g + "&r=" + Math.random())
}
function close_openapi() {
    clearWindow("auth_openapi");
    $("#openap_list").show();
    $("#add-socsrv").show();
    $("#check-havecode").hide();
    $("#checkcode_error").hide()
}
function getPubhouse(c) {
    var a = document.forms.filter.txt.value;
    var f = document.getElementById("select-pubhouse");
    document.forms.diagram.txt.value = a;
    f.innerHTML = "<center>Загрузка... <img src='http://img.labirint.ru/design/upload.gif'></center>";
    JsHttpRequest.query("/obmb/diagram/getpubhouse.php", {txt: a}, function (g, j) {
        f = document.getElementById("select-pubhouse");
        if (g.err == "no") {
            f.innerHTML = g.html;
            document.forms.filter.id_pubhouse.value = c;
            document.getElementById("id_p").focus();
            var h = document.forms.filter.id_pubhouse.value;
            if (h > 0) {
                document.getElementById("but").disabled = false
            } else {
                document.getElementById("but").disabled = true
            }
        } else {
            f.innerHTML = g.log
        }
    }, true)
}
function mediaQs() {
    if ("\v" == "v" && jQuery.browser.version <= "8.0") {
        function c(f) {
            var g = f.width();
            $(".fave-txt").toggleClass("m-big", g > 1235);
            $("#head-social-title,.basket-my-txt,.basket-main-txt").toggleClass("m-small", g <= 1152);
            $(".media-small,.media-big").toggleClass("m-small", g <= 1048);
            $(".product").toggleClass("product-w20p", g <= 1560).toggleClass("product-w25p", g <= 1240);
            $(".navisort-status-head,.navisort-view-head,.pagination-onpages-head").toggleClass("dnone", g <= 1152);
            $(".top-navi .top-navi-skype").toggle(g > 1270);
            $(".top-navi .top-navi-certificates").toggle(g > 1210);
            $(".top-main-menu .top-main-menu-soc").toggle(g > 1320);
            $(".top-main-menu .top-main-menu-rating").toggle(g > 1210);
            $(".max-width").toggleClass("max-width-1100", g > 1100)
        }

        var a = $(window).bind("resize.labmediaqueries", function () {
            c(a)
        });
        c(a)
    }
}
function superMario(k, j, h, g, m) {
    var c = j.offset(), a = $('<div class="' + (typeof m != "undefined" ? m : "plusone-buble") + '"></div>').html(k).appendTo(document.body), f = c.left + (j.width() - a.width()) / 2;
    a.css({top: c.top - 10, left: f}).animate({top: "-=50", opacity: "1"}, h, function () {
        a.animate({top: "-=50", opacity: "0"}, g, function () {
            a.remove()
        })
    })
}
function plusOne(g, f, a) {
    var c = $(".plusone[data-idtov=" + g + "]"), h = c.data("quantity");
    c.data("quantity", ++h);
    superMario("Добавлено <br/>Всего " + h, c, 900, 1000);
    JsHttpRequest.query("/ajax.php", {cl_name: "basket", me_name: "plusone", id: g, type: f, dd: a || null}, function (j, k) {
        if (!j.err) {
            incBasketBooks();
            setBasketPrices(j[0].total_full_price, j[0].total_price);
            freeShiping.update(j.fs)
        }
    }, true);
    return false
}
function refreshShoping(f, c, a) {
    $(".btn-buy[data-idtov=" + f + "]").each(function () {
        var h = $(this), g = h.data("pluscount") || 1;
        superMario("Добавлено <br/>Всего " + g, h, 900, 1000);
        $(".tobasket").remove();
        if (h.data("bonus")) {
            $('<a class="btn btn-small btn-more tobasket only" href="' + CARTPATH + '">Оформить заказ</a>').insertAfter(h);
            h.remove();
            return
        }
        h.removeAttr("onclick").unbind("click").removeClass("btn-buy").addClass("plusone").data("quantity", g).bind("click",function () {
            return plusOne(f, c, a)
        }).find("span").html("<span class='media-small'>+</span><span class='media-big'>еще</span> 1");
        $('<a class="btn btn-small btn-more tobasket" href="' + CARTPATH + '">Оформить заказ</a>').insertAfter(h)
    })
}
function shoping(c, a, l) {
    if (a == "") {
        a = 0
    }
    var f = a > 1 ? a : 0, j = l > 1000 ? l : 0;
    if (a == 1) {
        var k = "/buy.php?check=1&s=1&id=" + c + "&charity=" + j;
        window.location = k;
        if (j == 0) {
            incBasketBooks();
            var g = "buy" + c;
            var m;
            for (var h = 0; h < document.getElementsByTagName("span").length; h++) {
                m = document.getElementsByTagName("span")[h];
                if (m.id == g) {
                    m.innerHTML = '<a href="' + CARTPATH + '">В корзине</a>'
                }
            }
        }
    } else {
        $("#buy" + c).html("&nbsp;").addClass("buyload");
        JsHttpRequest.query("/buy.php", {id: c, imho: f, s: 1, charity: j}, function (n, s) {
            $("#buy" + c).removeClass("buyload");
            if (n.err == "no") {
                if (n.books_limit == 0) {
                    var r = p(c);
                    incBasketBooks(n.add_count, r);
                    setPutBooks(n.put_book);
                    setBasketPrices(n.fullsumcena, n.sumcena);
                    var q = "buy" + c;
                    var o = "buychar" + c + j;
                    for (h = 0; h < document.getElementsByTagName("span").length; h++) {
                        m = document.getElementsByTagName("span")[h];
                        if (m.id == q) {
                            if (a == 20) {
                                m.innerHTML = '<a target="_blank" href="' + CARTPATH + '">В корзине</a>'
                            } else {
                                m.innerHTML = '<a href="' + CARTPATH + '">В корзине</a>'
                            }
                        }
                        if (m.id == o) {
                            if (a == 20) {
                                m.innerHTML = '<a target="_blank" href="' + CARTPATH + '">В корзине</a>'
                            } else {
                                m.innerHTML = '<a href="' + CARTPATH + '">В корзине</a>'
                            }
                        }
                    }
                    if (a == 7) {
                        $("#cover-buy-button").unbind("click").addClass("done").attr("href", CARTPATH).find("span").html("Оформить");
                        r.data("inbasket", 1)
                    }
                    refreshShoping(c, j ? 4 : 1, j ? j : null);
                    freeShiping.update(n.fs)
                } else {
                    alert("В корзину нельзя положить более 500 товаров!")
                }
            } else {
                var q = "buy" + c;
                for (h = 0; h < document.getElementsByTagName("span").length; h++) {
                    m = document.getElementsByTagName("span")[h];
                    if (m.id == q) {
                        m.innerHTML = '<a href="/helpgopage/support/">Купить</a>'
                    }
                }
            }
        }, true)
    }
}
function shoping2(a) {
    JsHttpRequest.query("/buy.php", {ido: a, s: 1}, function (c, f) {
        if (c.err == "no") {
            if (c.books_limit == 0) {
                incBasketBooks();
                $("#buyof" + a + " a").attr("href", CARTPATH).addClass("btn-more").html("ОФОРМИТЬ");
                refreshShoping(a, 2)
            } else {
                alert("В корзину нельзя положить более 500 товаров!")
            }
        }
    }, true)
}
function shoping3(c) {
    var a = $(".clbuyof" + c);
    a.html("&nbsp;").addClass("buyload");
    JsHttpRequest.query("/buy.php", {ido: c, s: 1}, function (f, g) {
        a.removeClass("buyload");
        if (f.err == "no") {
            if (f.books_limit == 0) {
                incBasketBooks();
                a.addClass("btn-more").attr({href: CARTPATH, onclick: ""}).html("ОФОРМИТЬ")
            } else {
                alert("В корзину нельзя положить более 500 товаров!")
            }
        }
    }, true)
}
var freeShiping = (function () {
    var a, m, l, j, h, g;
    var k, c = false, f = 800;
    return{init: function () {
        a = $(".b-freeshiping-popup");
        m = $(".b-freeshiping-info-e-price");
        l = $(".b-freeshiping-info-e-message");
        j = $(".b-freeshiping-info-e-progress");
        h = $(".b-freeshiping-info-e-progress-cover");
        var n = this;
        g = $(".b-freeshiping-buttons-e-cancel").bind("click.freeshiping", function () {
            n.hidePopup(true)
        })
    }, showPopup: function (n) {
        if (a.legth === 0) {
            return
        }
        a.stop(true, true).fadeIn("slow");
        var o = this;
        $("body").bind("click.freeshiping", function (q) {
            if (!$(q.target).closest(".b-freeshiping-popup").length) {
                o.hidePopup(c)
            }
        });
        if ($(window).scrollTop() < 250) {
            elementReposition(a.css({position: "absolute"}), $(".basket-block"))
        } else {
            if (fixedHeader.canShow()) {
                a.css({position: "fixed", top: "38px", left: $(".basket-fixed-icon").offset().left + "px", right: "auto"})
            } else {
                a.css({position: "fixed", top: "15px", left: $(".basket-block").offset().left + "px", right: "auto"})
            }
        }
    }, hidePopup: function (n) {
        $("body").unbind(".freeshiping");
        if (a.legth === 0) {
            return
        }
        a.stop(true, true).fadeOut("slow", function () {
            if (n) {
                g.unbind(".freeshiping");
                $(this).remove()
            }
        })
    }, update: function (q) {
        var o = function () {
            return true
        };
        if (q !== null && q.price > 0) {
            if (q.showMessage) {
                clearTimeout(k);
                this.showPopup(q.id);
                c = parseInt(q.progress, 10) === 1;
                if (c) {
                    $(".b-freeshiping-buttons").slideDown();
                    $(".b-freeshiping-popup").css({height: "auto"})
                }
                var n = this;
                k = setTimeout(function () {
                    n.hidePopup(c)
                }, f + (c ? 3000 : 5000))
            } else {
                o = function () {
                    return $(this).parents(".basket-popup").length > 0
                }
            }
            m.filter(o).html(q.diffMessage);
            l.filter(o).html(q.message);
            j.filter(o).addClass("b-freeshiping-info-e-progress-m-active");
            h.filter(o).css({width: (q.progress * 100) + "%"})
        }
    }}
})();
function shopingnew(h, a, c) {
    if (a == "") {
        a = 0
    }
    var g = a > 1 ? a : 0;
    var k = c > 1000 ? c : 0;
    var j = p((k > 0 ? k + "-" : "") + h);
    var f = j.find(".buy-link");
    if (a == 1) {
        window.location = "/buy.php?check=1&s=1&id=" + h + "&charity=" + k;
        if (k == 0) {
            incBasketBooks()
        }
    } else {
        f.html("&nbsp;").addClass("buyload");
        JsHttpRequest.query("/buy.php", {id: h, imho: g, s: 1, charity: k}, function (m, n) {
            f.removeClass("buyload");
            if (m.err == "no") {
                if (m.books_limit == 0) {
                    j.data("inbasket", 1);
                    incBasketBooks(m.add_count, j);
                    setPutBooks(m.put_book);
                    setBasketPrices(m.fullsumcena, m.sumcena);
                    f.addClass("btn-more").attr({href: CARTPATH, target: a == 20 ? "_blank" : null, onclick: ""}).html(f.data("carttext") || "ОФОРМИТЬ");
                    if (a == 7) {
                        $("#cover-buy-button").unbind("click").addClass("done").attr("href", CARTPATH).find("span").html("Оформить")
                    }
                    var l = m.fs;
                    if (l) {
                        l.id = h;
                        freeShiping.update(l)
                    }
                } else {
                    alert("В корзину нельзя положить более 500 товаров!")
                }
            }
        }, true)
    }
}
function shopingmany(g, f, h, c) {
    var a = g.split(",");
    for (i in a) {
        shoping(a[i], 21)
    }
    $.get("/shopingmany/buy/" + g + "/");
    if (typeof h != "undefined" && h) {
        setTimeout(function () {
            window.location = CARTPATH
        }, 500)
    } else {
        if (typeof f != "undefined") {
            $(f).unbind().text("В корзине").attr({href: CARTPATH, title: "Перейти в корзину"})
        }
    }
    return false
}
function shopingoffer(f, c) {
    var a = f.split(",");
    for (i in a) {
        shoping(a[i], 0)
    }
    $(c).addClass("btn-more").removeAttr("onclick").attr({href: CARTPATH}).html("ОФОРМИТЬ");
    return false
}
function putmany(f, c) {
    var a = f.split(",");
    for (i in a) {
        put_book(a[i])
    }
    $.get("/shopingmany/put/" + f + "/");
    if (typeof c != "undefined") {
        $(c).unbind().text("Отложено").attr({href: "/cabinet/putorder/", title: "Перейти в отложенные товары"})
    }
    return false
}
function getSubGenres(a) {
    if (document.getElementById("gl" + a).innerHTML.length > 0) {
        document.images["gi" + a].src = "http://img.labirint.ru/design/plus.gif";
        document.getElementById("gl" + a).innerHTML = "";
        document.getElementById("gl" + a).style.display = "none"
    } else {
        document.images["gi" + a].style.visibility = "hidden";
        JsHttpRequest.query("/catalog/genretree.php", {more_genre: a}, function (c, f) {
            if (c.err == "no") {
                document.getElementById("gl" + a).style.display = "block";
                document.images["gi" + a].style.visibility = "visible";
                document.images["gi" + a].src = "http://img.labirint.ru/design/minus.gif";
                document.getElementById("gl" + a).innerHTML = c.html
            }
        }, true)
    }
}
function big_pics_stat(a, c) {
    JsHttpRequest.query("/catalog/big_pics_stat.php", {UserSes: a, dontshow: c}, function (f, g) {
    }, true)
}
function sendvote(c, a) {
    JsHttpRequest.query("/catalog/vote.ajax.php", {book: c, votemark: a}, function (f, g) {
        if (f.err == "no") {
            document.getElementById("rate").innerHTML = f.rate;
            document.getElementById("count-marks-label").innerHTML = "Ваша оценка: " + f.your_mark + " (оценило: " + f.countmarks + ")";
            your_mark = f.your_mark * 1;
            outstar()
        }
    }, true)
}
function send_mailticket(a) {
    JsHttpRequest.query("/cabinet/send_mailticket.php", {id_order: a}, function (c, f) {
    }, true)
}
var is_typing = 0;
var is_sended = 0;
function list_timeout(g, f, h) {
    is_typing++;
    var a = document.forms.list_search.lit.value;
    var c = f.keyCode;
    if (c != 16 && c != 17 && c != 18 && c != 13 && c != 20 && c != 192 && c != 37 && c != 38 && c != 39 && c != 40 && c != 116) {
        setTimeout("waaait('" + g + "', " + is_typing + ", '" + h + "')", 500)
    }
}
function waaait(a, f, c) {
    if (is_typing == f) {
        list_change(a, c)
    }
}
function list_change(f, h) {
    var a = document.forms.list_search.lit.value;
    if (a.length > 2) {
        var g = document.getElementById("list_text");
        var c = document.getElementById("list_rows");
        c.innerHTML = "<br><br><center style=\"font: 12px Arial, Helvetica, sans-serif;\"><img src='http://img.labirint.ru/design/upload_big.gif'></center>";
        JsHttpRequest.query("/catalog/list_change.php", {txt: a, path: f, adm: h}, function (j, l) {
            var k = document.getElementById("list_rows");
            if (j.err == "no") {
                k.innerHTML = "";
                k.innerHTML = j.html
            } else {
                pubhouses.innerHTML = j.log
            }
        }, true)
    }
}
function commentVote(f, g, j, h) {
    var c = $("#comment_vote" + f), a = $("#comment_mark" + f);
    if (j == 1) {
        var k = $("#best")
    }
    c.html('<center style="font: 12px Arial, Helvetica, sans-serif;"> Загрузка...&nbsp; <img style="float: none; border: 0px solid #cccccc; margin:0;" src=\'http://img.labirint.ru/design/upload_old.gif\'></center>');
    JsHttpRequest.query("/catalog/commentVote.ajax.php", {id_comment: f, voting: g, best: j}, function (l, m) {
        if (l.err == "no") {
            c.html(l.html);
            a.css({color: l.comment_thanks_color, weight: "bold"}).html(l.comment_thanks);
            if (j == 1) {
                k.html(l.best)
            }
        } else {
            c.html(l.log)
        }
    }, true)
}
function deleteCommentPic(c, g) {
    var a = document.getElementById("commentPic" + g);
    var f = document.getElementById("commentPics");
    a.innerHTML = '<div style="font: 12px Arial, Helvetica, sans-serif;"> Удаление...&nbsp; <img style="float: none; border: 0px solid #cccccc; margin:0;" src=\'http://img.labirint.ru/design/upload.gif\'></div>';
    JsHttpRequest.query("/catalog/commentDelPic.ajax.php", {id_comment: c, id_pic: g}, function (h, j) {
        if (h.err == "no") {
            a.innerHTML = "";
            a.innerHTML = h.html;
            f.style.border = h.border
        } else {
            a.innerHTML = h.log
        }
    }, true)
}
function be_Paid(a, c) {
    JsHttpRequest.query("/cabinet/be_paid.php", {id_order: a}, function (f, g) {
        if (f.err == "no") {
            if (c == 1) {
                document.forms.form1.submit()
            }
        }
    }, true)
}
function CabinetMess(a, c) {
    document.getElementById("MessForm").style.visibility = "hidden";
    document.getElementById("MessForm").style.position = "absolute";
    document.getElementById("MessTXT").innerHTML = "<center><img src='http://img.labirint.ru/design/upload.gif'></center>";
    JsHttpRequest.query("/cabinet/cabinet_mess.php", {id_order: a, mess: c}, function (f, g) {
        if (f.err == "no") {
            document.forms.newMessForm.mess.value = "";
            document.getElementById("MessTXT").innerHTML = 'Сообщение отправлено.<br/>Окно автоматически закроется через 3 секунды<br/><br/><input type=\'button\' value="Закрыть" class=\'red-button\' onClick=\'$("#newMess").css("display","none");\'/>';
            setTimeout("document.getElementById('newMess').style.visibility='hidden'; document.getElementById('MessTXT').innerHTML='';", 3000)
        } else {
            document.forms.newMessForm.mess.value = "";
            document.getElementById("MessTXT").innerHTML = 'Не верный номер заказа.<br/><br/><input type=\'button\' value="Закрыть" class=\'red-button\' onClick=\'$("#newMess").css("display","none"); document.getElementById("MessForm").style.visibility="visible";\'/>'
        }
        clearWindow("newMess")
    }, true)
}
function typeTimeOut(c, g) {
    is_typing++;
    var a = g.keyCode;
    if (a != 16 && a != 17 && a != 18 && a != 20 && a != 192 && a != 37 && a != 38 && a != 39 && a != 40 && a != 116) {
        setTimeout("type_waaait(" + is_typing + ", " + c + ")", 500)
    }
}
function type_waaait(c, a) {
    if (is_typing == c) {
        a()
    }
}
function chkSmsNumer() {
    var a = "7" + $("#smsphone_code").val() + $("#smsphone_end").val();
    a = !isNaN(a) && a.length == 11 && a.substr(0, 2) == "79" ? a : null;
    if (a) {
        $("#phonesdiv").attr("class", "phoneg");
        $("#phonestat").html("верный формат")
    } else {
        $("#phonesdiv").attr("class", "phoneb");
        $("#phonestat").html("не соответствует формату")
    }
    return a
}
function changeSmsNumber(c) {
    var a = c.keyCode;
    if (a != 16 && a != 18 && a != 13 && a != 20 && a != 192 && a != 37 && a != 38 && a != 39 && a != 40 && a != 116) {
        chkSmsNumer()
    }
}
function saveNumber() {
    var a = chkSmsNumer();
    if (!a) {
        alert("Неверный формат телефона!");
        return false
    }
    $("#sendSMS").addClass("content_upload");
    JsHttpRequest.query("/basket/chekPhone4SMS.php", {phone: a, save: 1}, function (c, f) {
        if (c.err != "no") {
            if (c.err) {
                alert(c.err)
            }
        } else {
            clearWindow("sendSMS");
            $("#smscbx").attr("checked", 1)
        }
        $("#sendSMS").removeClass("content_upload")
    }, true)
}
function smsChange() {
    if ($("#smscbx").attr("checked")) {
        var a = chkSmsNumer();
        if (!a) {
            $("#smscbx").attr("checked", "");
            overlayWindow("sendSMS")
        } else {
            saveNumber()
        }
    }
}
function dont_puBooks(a) {
    dont_put = a ? 1 : 0;
    JsHttpRequest.query("/cabinet/dont_putBooks.php", {dont_put: dont_put}, function (c, f) {
    }, true)
}
function geoTargetingTimeOut(c, f) {
    is_typing++;
    var a = f.keyCode;
    if (a != 16 && a != 17 && a != 18 && a != 13 && a != 20 && a != 192 && a != 37 && a != 38 && a != 39 && a != 40 && a != 116) {
        setTimeout("geoTargeting_waaait('" + c + "'," + is_typing + ")", 500)
    }
}
function geoTargeting_waaait(a, c) {
    if (is_typing == c) {
        geoTargetingSearch(a, 0)
    }
}
function geoTargetingSearch(c, f) {
    var a = document.getElementById(c).value;
    var f = f > 0 ? f : null;
    if (a.length) {
        var g = document.getElementById("result_" + c);
        g.innerHTML = "<center style=\"font: 12px Arial, Helvetica, sans-serif;\"><img src='http://img.labirint.ru/design/upload.gif'></center>";
        JsHttpRequest.query("geoTargeting.ajax.php", {txt: a, type: c, id_rule: f}, function (h, j) {
            if (h.err == "no") {
                if (f) {
                    document.getElementById(c).value = ""
                }
                g.innerHTML = "";
                g.innerHTML = h.html
            } else {
                g.innerHTML = h.log
            }
        }, true)
    }
}
function add_user_tag(f, c) {
    var a = f.tag.value;
    var g = c > 10000000 ? "ebooks" : "books";
    JsHttpRequest.query("/catalog/userTags.ajax.php", {func: "addTag", id_books: c, tag: a}, function (v, t) {
        c = c > 10000000 ? c - 10000000 : c;
        if (v.err == undefined) {
            var w = document.getElementById("tags-add-cont");
            var r = document.getElementById("user-tags-main");
            if (document.getElementById("tags-added") == undefined) {
                var o = document.createElement("div");
                o.setAttribute("id", "tags-added");
                w.insertBefore(o, w.firstChild);
                var h = document.createElement("span");
                h.setAttribute("id", "tags-added-head");
                o.appendChild(h);
                h.innerHTML = "Добавлены: ";
                if (document.getElementById("all-tags") == undefined) {
                    r.className = "";
                    var n = document.getElementById("user-tags-bottom");
                    var u = document.createElement("div");
                    u.setAttribute("class", "right");
                    n.appendChild(u);
                    var q = document.createElement("a");
                    q.setAttribute("href", "/tags/" + g + "/" + c + "/");
                    q.innerHTML = "Все метки...";
                    u.appendChild(q)
                } else {
                    var s = document.createTextNode(", ");
                    r.appendChild(s)
                }
                var m = document.createTextNode(v.tag3);
                o.appendChild(m)
            } else {
                var o = document.getElementById("tags-added");
                if (o.lastChild.nodeValue != undefined) {
                    o.lastChild.nodeValue = ", " + v.tag3 + " "
                } else {
                    var m = document.createTextNode(", " + v.tag3 + " ");
                    o.appendChild(m)
                }
                var s = document.createTextNode(", ");
                r.appendChild(s)
            }
            var k = document.createElement("img");
            k.setAttribute("src", "http://img.labirint.ru/design/user_tags_minus.gif");
            k.setAttribute("title", "Удалить метку");
            k.className = "imgbutton";
            o.appendChild(k);
            var j = v.id;
            k.onclick = function () {
                del_user_tag(k, j)
            };
            var l = document.createElement("a");
            l.setAttribute("href", "/usertags/" + v.tagurl + "/");
            l.innerHTML = v.tag2;
            r.appendChild(l);
            f.tag.value = ""
        } else {
            alert(v.err)
        }
    }, true)
}
function del_user_tag(c, a) {
    JsHttpRequest.query("/catalog/userTags.ajax.php", {func: "delTag", id: a}, function (g, j) {
        if (g.err == undefined) {
            var h = document.getElementById("tags-added");
            if (c && c.previousSibling != undefined) {
                var f = c.previousSibling;
                if (f.previousSibling != undefined && f.previousSibling.id == "tags-added-head" && c.nextSibling != undefined) {
                    c.nextSibling.nodeValue = c.nextSibling.nodeValue.substring(2)
                }
                h.removeChild(c);
                h.removeChild(f)
            }
        } else {
            alert(g.err)
        }
    }, true)
}
function sendInquirer(l, f) {
    var h = document.getElementById("inquirer-questions");
    var c = document.getElementById("inquirer-anons");
    var a = Array();
    var g = Array();
    var k;
    var j = 1;
    $("input[name^=que]:checked").each(function () {
        var m = $(this).attr("name");
        m = m.replace("que", "");
        if (m == k) {
            a[m][j] = $(this).attr("value");
            j++
        } else {
            a[m] = Array();
            a[m][0] = $(this).attr("value")
        }
        k = m
    });
    $("textarea[name^=que]").each(function () {
        if ($(this).attr("value")) {
            var m = $(this).attr("name");
            m = m.replace("que", "");
            a[m] = Array();
            a[m][0] = $(this).attr("value")
        }
    });
    if (a.length > 0) {
        h.style.height = "500px";
        h.innerHTML = "<center style=\"font: 12px Arial, Helvetica, sans-serif; vertical-align: middle;\"><img style='vertical-align: middle; margin-top: 200px;' src='http://img.labirint.ru/design/upload_big.gif'></center>";
        JsHttpRequest.query("/catalog/inquirer.ajax.php", {func: "delTag", id: l, que: a, result: f}, function (m, n) {
            if (m.err == "no") {
                h.innerHTML = "";
                h.innerHTML = m.html;
                h.style.height = "auto"
            } else {
                h.innerHTML = m.log
            }
        }, true)
    } else {
        alert("Ничего не выбрано")
    }
}
function put_book(a) {
    var c = p(a);
    JsHttpRequest.query("/buy.php", {id: a, put_book: 1}, function (f, j) {
        if (f.err == "no") {
            setPutBooks(f.put_book);
            var h = "put" + a;
            for (i = 0; i < document.getElementsByTagName("span").length; i++) {
                var g = document.getElementsByTagName("span")[i];
                if (g.id == h) {
                    g.innerHTML = '&nbsp;<a href="/cabinet/putorder/" title="Перейти в Отложенные">Отложено</a>'
                }
            }
            $(".fave[data-idtov=" + a + "]").each(function () {
                var l = $(this), k = l.data("html");
                l.addClass("done").removeAttr("onclick").unbind("click").attr({title: "Перейти в Отложенные", href: "/cabinet/putorder/"});
                l.find("span").html(k ? k : "")
            });
            c.data("inputorder", 1)
        } else {
            var h = "put" + a;
            for (i = 0; i < document.getElementsByTagName("span").length; i++) {
                var g = document.getElementsByTagName("span")[i];
                if (g.id == h) {
                    g.innerHTML = '<a href="/helpgopage/support/">Отложить</a>'
                }
            }
        }
    }, true)
}
function adviseVote(f) {
    var c = $("#advise_vote" + f), a = $("#rating" + f);
    c.html('<center style="font: 12px Arial, Helvetica, sans-serif;"> Загрузка...&nbsp; <img style="float: none; border: 0px solid #cccccc; margin:0;" src=\'http://img.labirint.ru/design/upload_old.gif\'></center>');
    JsHttpRequest.query("/catalog/commentVote.ajax.php", {id_comment: f, type: "advise"}, function (g, h) {
        if (g.err == "no") {
            c.css({color: "#8C8C8C"}).html(g.html);
            a.css({color: g.color, fontWeight: "bold"}).html(g.rating)
        } else {
            c.html(g.log)
        }
    }, true)
}
function dont_sendmail(a, c) {
    JsHttpRequest.query("/cabinet/dont_sendmail.php", {id_contact: a, mailingType: c}, function (f, g) {
    }, true)
}
function comparethis(c) {
    var g = $(c), f = g.data("idtov"), h = g.data("sgenre");
    return compare(f, h)
}
function compare(a, c) {
    JsHttpRequest.query("/compare.php", {id: a, sgenre: c}, function (f, g) {
        alreadyInCompList(a, c, f.citems);
        if (f.err != "no") {
            alert(f.err)
        }
    }, true);
    return false
}
function putbook(a) {
    var c = p(a);
    JsHttpRequest.query("/buy.php", {id: a, put_book: 1}, function (f, g) {
        if (f.err == "no" && f.auth_need != 1) {
            setPutBooks(f.put_book);
            $(".fave[data-idtov=" + a + "]").each(function () {
                var j = $(this), h = j.data("html");
                j.addClass("done").removeAttr("onclick").unbind("click").attr({title: "Перейти в Отложенные", href: "/cabinet/putorder/"});
                j.find("span").html(h ? h : "")
            });
            c.data("inputorder", 1)
        } else {
            if (f.auth_need == 1) {
                sendTo("authorize")
            }
        }
    }, true);
    return false
}
function getQIWIBill(f, a) {
    var c = $("#qiwi_pay"), g = $("#qiwi_" + f);
    JsHttpRequest.query("/pay/qiwi/index.php", {id_order: f, mobile_pay: a}, function (h, j) {
        if (h.err == "no" && c.length) {
            if (h.status != 0) {
                c.html('Счет на оплату не создан, создать счет можно через <a href="/cabinet/hist/">Личное пространство</a>')
            } else {
                c.html("Создан счет для оплаты " + (a == 9 ? " в системе QIWI" : "с баланса телефона"))
            }
            $(".js-cart-phone-row").hide();
            c.show()
        } else {
            if (h.err == "no" && g.length) {
                if (h.status != 0) {
                    g.html("Попробуйте позже")
                } else {
                    g.html("Создан счет");
                    g.removeAttr("onclick")
                }
            }
        }
    }, true)
}
function addWish(c) {
    if (document.getElementById("participate_contest_warning")) {
        document.getElementById("participate_contest_warning").innerHTML = "";
        document.getElementById("participate_contest_warning").style.display = "none"
    }
    var a = "";
    if (c.subscription1.checked) {
        a += c.subscription1.value
    }
    if (c.subscription2.checked) {
        a += "," + c.subscription2.value
    }
    if (c.subscription3.checked) {
        a += "," + c.subscription3.value
    }
    if (c.subscription4.checked) {
        a += "," + c.subscription4.value
    }
    if (c.subscription5.checked) {
        a += "," + c.subscription5.value
    }
    if (c.subscription6.checked) {
        a += "," + c.subscription6.value
    }
    if (c.subscription7.checked) {
        a += "," + c.subscription7.value
    }
    if (c.subscription8.checked) {
        a += "," + c.subscription8.value
    }
    JsHttpRequest.query("/basket/addWish.php", {id_order: c.id_order.value, subscription: a, wish_txt: c.wish_txt.value, pindex: c.pindex.value, country: c.country.value, pstate: c.pstate.value, city: c.city.value, street: c.street.value, building: c.building.value, building_p: c.building_p.value, fflat: c.fflat.value, lastName: c.lastName.value, firstName: c.firstName.value, middleName: c.middleName.value}, function (f, g) {
        if (f.err == "no" && document.getElementById("participate_contest")) {
            if (f.rez_mess) {
                document.getElementById("participate_contest").innerHTML = f.rez_mess;
                if (document.getElementById("dopinfo")) {
                    document.getElementById("dopinfo").style.display = "block"
                }
                window.scrollTo(0, 0)
            }
            if (f.warning_mess) {
                $("#participate_contest_warning").html(f.warning_mess).css("display", "block")
            }
        }
    }, true)
}
function dontsavesort() {
    JsHttpRequest.query("/ajax.php", {func: "ajaxdontsavesort"}, function (a, c) {
    }, true)
}
function buyecert() {
    var a = $("input[name=ecert_value]").val();
    if (!(a >= 100 && a <= 5000)) {
        alert("Не верное значение номинала!")
    } else {
        JsHttpRequest.query("/buy.php", {ecert_value: a}, function (c, f) {
            if (c.err == "no") {
                if (c.books_limit == 0) {
                    incBasketBooks();
                    setPutBooks(c.put_book);
                    setBasketPrices(c.fullsumcena, c.sumcena);
                    $("input[name=ecert_value]").val("");
                    $("#ecert_rez").html("Добавлен сертификат номинал " + a + ' р., перейти в <a href="' + CARTPATH + '">корзину</a>')
                } else {
                    alert("В корзину нельзя положить более 100 электронных сертификатов!")
                }
            } else {
                $("#ecert_rez").html(c.error_message)
            }
        }, true)
    }
}
function setBasketPrices(c, a) {
    if (c && a) {
        $(".basket-full-price").html(sepThousands(c)).closest(".basket-full-item").toggle(c - a > 0);
        $(".basket-diff-price").html(sepThousands(c - a)).closest(".basket-full-item").toggle(c - a > 0);
        $(".basket-total-price").html(sepThousands(a))
    }
}
function setPutBooks(g, f) {
    f = typeof f == "undefined" ? 1 : f;
    if (typeof g != "undefined" && g == 1) {
        $(".otlog-block").addClass("notempty-otlog");
        var c = $(".basket-in-dreambox-a"), a = parseInt(c.html());
        c.html((!isNaN(a) ? a : 0) + f)
    }
}
function setBasketBooksCount(c) {
    $(".basket-block, .bl-basket-fixed").toggleClass("have-dropdown", c > 0);
    $(".bl-basket-fixed-e-tobasket").html(c > 0 ? "Оформить заказ" : "Корзина пуста");
    var a = $(".basket-in-cart-a").html(c < 100 ? c : "99+").toggleClass("basket-in-cart-full", c >= 100)
}
function incBasketBooks(a, o) {
    var m = $(".basket-in-cart-a"), k = parseInt(m.html());
    var h = typeof a != "undefined" && !isNaN(a) ? parseInt(a) : 1;
    var l = (!isNaN(k) ? k : 0) + h;
    setBasketBooksCount(l);
    if (typeof o !== "undefined") {
        var n = $(".basket-books-shelf");
        var j = o.find("img.book-img-cover");
        var q = o.find(".cover");
        var f = $("<img>").attr({src: j.attr("src"), width: 25});
        var c = $("<a></a>").attr({title: q.attr("title"), href: q.attr("href")}).append(f);
        var g = n.find("a");
        if (k === 0) {
            g.remove()
        }
        if (g.length >= 3) {
            g.last().remove()
        }
        if (g.length > 0) {
            n.prepend(c)
        } else {
            n.append(c)
        }
        $(".basket-go").removeClass("btn-disabled").attr("onclick", "")
    }
}
function sepThousands(c) {
    var f = (c + "").split("").reverse(), a = [];
    for (i in f) {
        a.push(f[i] + (i == 0 || i % 3 ? "" : " "))
    }
    return a.reverse().join("")
}
function bback_open() {
    window.open("/callback/", "callback", "width=872,height=750,scrollbars=yes,resizable=yes")
}
function showCallback(a) {
    $.ajax({url: "/ajax.php", type: "POST", dataType: "json", data: {cl_name: "callback", me_name: "getcontacts"}, success: function (c) {
        $("#callback-country-code").val(c.phone_countrycode);
        $("#callback-city-code").val(c.phone_citycode);
        $("#callback-phone-number").val(c.phone_number);
        $("#callback-name").val(c.user_name)
    }});
    overlayWindow({id: "popup-window-callback", target: typeof a != "undefined" ? a : "#head-call-callback", position: "bottomcenter", transparent: true})
}
function callback_save() {
    var c = new Array();
    c[0] = checkCallbackFields("countrycode");
    c[1] = checkCallbackFields("citycode");
    c[2] = checkCallbackFields("phonenumber");
    c[3] = checkCallbackFields("namedata");
    for (var a = 0; a < c.length; a++) {
        if (c[a] == false) {
            return false
        }
    }
    JsHttpRequest.query("/ajax.php", {cl_name: "callback", me_name: "saveCallbackForm", form: document.forms.callback_form}, function (f, g) {
        if (f.error) {
            $("#callback-errors").html(f.error)
        } else {
            $("#callback-errors").html("");
            $("#callback-content").html(f.html)
        }
        $("#popup-window-callback").css("height", "auto")
    }, true);
    return false
}
function checkCallbackFields(c) {
    if (c != "countrycode" && c != "citycode" && c != "phonenumber" && c != "namedata") {
        return false
    }
    var a = /^[\+]?[\d]+$/;
    var l = /[^\d]/;
    var g = /[^\d]/;
    var h = "";
    var k = "";
    var f;
    var j = {countrycode: jQuery.trim($("#callback-country-code").val()), citycode: jQuery.trim($("#callback-city-code").val()).replace(/^[-]/g, "").replace(/[-]$/g, ""), phonenumber: jQuery.trim($("#callback-phone-number").val()).replace(/^[-]/g, "").replace(/[-]$/g, ""), namedata: jQuery.trim($("#callback-name").val())};
    if (j.countrycode == "8" || j.countrycode == "+8") {
        j.countrycode = "+7"
    } else {
        if (/^[\d]+$/.exec(j.countrycode)) {
            j.countrycode = "+" + j.countrycode
        }
    }
    $("#callback-country-code").val(j.countrycode);
    $("#callback-city-code").val(j.citycode);
    $("#callback-phone-number").val(j.phonenumber);
    if (!checkCallbackFields.filling) {
        checkCallbackFields.filling = new Array()
    }
    if (!checkCallbackFields.filling[c]) {
        checkCallbackFields.filling[c] = j[c]
    }
    if (!j.countrycode && checkCallbackFields.filling.countrycode != undefined) {
        h = "ЗАПОЛНИТЕ ПОЛЕ";
        f = "#callback-country-code"
    } else {
        if (!j.citycode && checkCallbackFields.filling.citycode != undefined) {
            h = "ЗАПОЛНИТЕ ПОЛЕ";
            f = "#callback-city-code"
        } else {
            if (j.citycode.length < 3 && checkCallbackFields.filling.citycode != undefined) {
                h = "НЕ МЕНЕЕ 3 СИМВОЛОВ";
                f = "#callback-city-code"
            } else {
                if (!j.phonenumber && checkCallbackFields.filling.phonenumber != undefined) {
                    h = "ЗАПОЛНИТЕ ПОЛЕ";
                    f = "#callback-phone-number"
                }
            }
        }
    }
    if (!j.namedata && checkCallbackFields.filling.namedata != undefined) {
        k = "ЗАПОЛНИТЕ ПОЛЕ"
    }
    if (checkCallbackFields.filling.countrycode && !a.exec(j.countrycode)) {
        h = "НУЖНО ВВЕСТИ: +КОД СТРАНЫ";
        f = "#callback-country-code"
    } else {
        if (l.exec(j.citycode)) {
            h = "ТОЛЬКО ЦИФРЫ";
            f = "#callback-city-code"
        } else {
            if (g.exec(j.phonenumber)) {
                h = "ТОЛЬКО ЦИФРЫ";
                f = "#callback-phone-number"
            }
        }
    }
    if (h) {
        $("#callback-phonedata-error").html(h);
        $("#callback-phonedata-error").css("visibility", "visible");
        $(".phone-data-field").removeClass("error-border");
        $(f).addClass("error-border")
    } else {
        $("#callback-phonedata-error").html("");
        $("#callback-phonedata-error").css("visibility", "hidden");
        $(".phone-data-field").removeClass("error-border")
    }
    if (k) {
        $("#callback-namedata-error").html(k);
        $("#callback-namedata-error").css("visibility", "visible");
        $("#callback-name").addClass("error-border")
    } else {
        $("#callback-namedata-error").html("");
        $("#callback-namedata-error").css("visibility", "hidden");
        $("#callback-name").removeClass("error-border")
    }
    if (h || k) {
        return false
    } else {
        return true
    }
}
function sendProductVotes(f, a, c) {
    $.ajax({url: "/ajax.php", type: "POST", dataType: "json", data: {feature: f, votemark: a, type: c, cl_name: "vote", me_name: "modify"}, success: function (g) {
        if (g.err == false) {
            $("#rate").html(g.rate);
            $("#countmarks").html("Всего: " + g.countmarks);
            $("#product-rating-marks-label").html("Ваша оценка: " + g.your_mark + " (оценило: " + g.countmarks + ")").show();
            $("#status-label").hide()
        } else {
            if (!g.auth) {
                overlayWindow("authorize")
            }
        }
    }})
}
function changeRatingStars(f, c) {
    c *= 1;
    if (f == "product-rating") {
        $("input[type='hidden'][name='save-text']").val($("#" + f + "-marks-label").html())
    }
    clearRatingStars(f, c + 1);
    fillRatingStars(f, c);
    var a = Array("", "Хуже не бывает", "Очень плохо", "Плохо", "Ниже среднего", "Средне", "Выше среднего", "Нормально", "Хорошо", "Отлично", "Лучше не бывает!");
    $("input[type='hidden'][name='save-text']").val($("#" + f + "-marks-label").html());
    $("#" + f + "-marks-label").hide();
    $("#status-label").html(a[c]).show()
}
function outRatingStars(a) {
    val = $("input[name=" + a + "]").val();
    if (val > 0) {
        changeRatingStars(a, val)
    } else {
        clearRatingStars(a, 1)
    }
    $("#" + a + "-marks-label").show();
    $("#status-label").hide()
}
function clearRatingStars(c, a) {
    for (i = a; i <= 10; i++) {
        $("#" + c + "-star" + i).removeClass("full").addClass("empty")
    }
}
function selectRatingStar(c, a) {
    $("#" + c + "-result").addClass("complete");
    $("input[name=" + c + "]").val(a)
}
function fillRatingStars(c, a) {
    for (i = 1; i <= a; i++) {
        $("#" + c + "-star" + i).removeClass("empty").addClass("full")
    }
}
function openUrl(c) {
    var a = window.open("", "_blank");
    a.location.href = c
}
function litBubble(c) {
    var g = $(this);
    if (!g.hasClass("navisort-alpha-item-link")) {
        g = $(".navisort-alpha-item.alpha-selected a")
    }
    var a = $(".navisort-alpha-error").show(), j = a.width(), f = g.outerWidth(), h = g.position().left;
    a.css("left", h + (f - j) / 2).parents(".menu-open").addClass("active")
}
function bookBuble(n, m, k) {
    var a = $("#right"), c = a.offset(), h = $(".book-buble"), j = $('<div class="plusone-buble book-buble"></div>').appendTo(document.body).html('<div class="book-buble-inner">' + n + "</div>");
    $("<span class='closer'></span>").prependTo(j).bind("click", function () {
        j.remove()
    });
    var g = c.left + a.outerWidth() - j.outerWidth() - 10, f = j.outerHeight() + 2 + 10;
    h.animate({top: "-=" + f}, 1000);
    j.css("opacity", 0).css({top: m, left: g}).animate({top: "-=" + f, opacity: "1"}, 1000, function () {
        setTimeout(function () {
            j.animate({top: "-=50", opacity: "0"}, 1000, function () {
                j.remove()
            })
        }, k || 5000)
    })
}
$.fn.objectEquals = function (a) {
    if (!a || this.length != a.length) {
        return false
    }
    for (var c = 0; c < this.length; ++c) {
        if (this[c] !== a[c]) {
            return false
        }
    }
    return true
};











