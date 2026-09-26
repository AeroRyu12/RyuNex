let dQ = b;
(() => {
  var e = b;
  var n = a();
  while (true) {
    try {
      if (-parseInt(e(914)) * (parseInt(e(1348)) / 2) + -parseInt(e(970)) / 3 + parseInt(e(927)) / 4 + -parseInt(e(1288)) / 5 * (-parseInt(e(1166)) / 6) + -parseInt(e(907)) / 7 * (-parseInt(e(1414)) / 8) + -parseInt(e(609)) / 9 * (parseInt(e(1346)) / 10) + parseInt(e(735)) / 11 == 873343) {
        break;
      }
      n.push(n.shift());
    } catch (e) {
      n.push(n.shift());
    }
  }
})();
let {
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  REST,
  Collection,
  StringSelectMenuBuilder,
  MessageFlags
} = require("discord.js");
let fs = require("fs");
let path = require("path");
let colors = require("ansi-c" + dQ(443));
let axios = require("axios");
let Routes = require("discor" + dQ(1127) + dQ(641) + dQ(801)).Routes;
let moment = require("moment-timezone");
let mongoose = require("mongoose");
let {
  getConfig,
  getLang,
  getCommands,
  displayChannelIdError,
  validateChannelId
} = require("./util" + dQ(1125) + dQ(932) + dQ(1106) + "r");
let getLogChannel = require(dQ(855) + dQ(1160) + dQ(1159) + dQ(872) + dQ(1406)).getLogChannel;
let config = getConfig();
let commandConfig = getCommands();
let lang = getLang();
function findRoleForGuild(e, n) {
  var o;
  var t = dQ;
  if (e) {
    for (o of Array.isArray(e) ? e : [e]) {
      if (o && o !== "" && o !== "ROLE_ID") {
        var r = n[t(1203)].cache[t(483)](o);
        if (r) {
          return r;
        }
      }
    }
  }
  return null;
}
let client = require("./inde" + dQ(747));
let connectToMongoDB = require(dQ(1533) + dQ(488) + "ager.js").connectToMongoDB;
let UserData = require(dQ(1533) + "ls/Use" + dQ(1144) + "js");
let ReactionRole = require(dQ(1533) + dQ(1502) + "ctionR" + dQ(930));
let packageJson = require("./package.json");
let startGiveawayScheduler = require(dQ(640) + dQ(882) + "eaways/givea" + dQ(1267) + dQ(568) + ".js");
let startAlertScheduler = require(dQ(640) + "ts/Tic" + dQ(1114) + "heckAlerts").startAlertScheduler;
let startReminderScheduler = require("./even" + dQ(1308) + "inders/remin" + dQ(1296) + "eduler.js").startReminderScheduler;
let handleVoiceXP = require(dQ(640) + "ts/Lev" + dQ(968) + "ndleXP").handleVoiceXP;
let ChannelStat = require("./mode" + dQ(1527) + "nnelSt" + dQ(1304) + "ma");
let TempRole = require("./models/Tem" + dQ(1463));
let Reminder = require(dQ(1533) + "ls/rem" + dQ(940));
let Poll = require(dQ(1533) + dQ(766) + "l");
let Ticket = require(dQ(1533) + dQ(1541) + "kets");
let TIMER_REGISTRY = new Map();
let interactionDebounce = new Map();
function b(r, e) {
  let i = a();
  return (b = function (e, n) {
    e -= 412;
    let o = i[e];
    if (b.LoXQtZ === undefined) {
      b.ztqfde = function (r) {
        let i = "";
        let o = "";
        for (let e = 0, n, o, t = 0; o = r.charAt(t++); ~o && (n = e % 4 ? n * 64 + o : o, e++ % 4) && (i += String.fromCharCode(n >> (e * -2 & 6) & 255))) {
          o = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=".indexOf(o);
        }
        for (let e = 0, n = i.length; e < n; e++) {
          o += "%" + ("00" + i.charCodeAt(e).toString(16)).slice(-2);
        }
        return decodeURIComponent(o);
      };
      r = arguments;
      b.LoXQtZ = true;
    }
    var e = e + i[0];
    var t = r[e];
    if (t) {
      o = t;
    } else {
      o = b.ztqfde(o);
      r[e] = o;
    }
    return o;
  })(r, e);
}
function setupDiscordEventBridge(r, i) {
  let e = dQ;
  let a = {
    zcuQP: "guildMemberAdd",
    NDWay: e(1075) + "emberR" + e(1005),
    VreYH: "guildM" + e(880) + e(507),
    WXnpy: "channe" + e(1512) + "e",
    anuEB: "channelDelete",
    ZayaM: e(1132) + "eate",
    EGcjj: "roleDelete",
    yZzXc: "guildB" + e(853) + "ve",
    GIOKt: e(660),
    XHaFL: e(917) + "anAdd",
    hDJbx: "interactionC" + e(456)
  };
  let n = ["messag" + e(673) + "e", "messageUpdate", "messag" + e(775) + "e", "guildM" + e(755) + "dd", a[e(1197)], e(1075) + "emberU" + e(507), e(573) + "tateUp" + e(840), a.WXnpy, a.anuEB, e(1132) + e(881), a[e(513)], a.XHaFL, a.yZzXc, a[e(772)], a.GIOKt];
  n[e(491) + "h"](t => {
    r.on(t, (...e) => {
      var n = b;
      var o = {};
      switch (t) {
        case n(1278) + n(673) + "e":
        case n(1278) + "eUpdate":
        case "messag" + n(775) + "e":
          o[n(1278) + "e"] = e[0];
          if (e[1]) {
            o[n(704) + "sage"] = e[1];
          }
          break;
        case a.zcuQP:
        case a[n(1197)]:
          o[n(612)] = e[0];
          break;
        case a[n(771)]:
          o[n(1161) + "ber"] = e[0];
          o[n(572) + "ber"] = e[1];
          break;
        case n(573) + n(1276) + "date":
          o[n(512) + "te"] = e[0];
          o.newState = e[1];
          break;
        case a.WXnpy:
        case a.anuEB:
          o.channel = e[0];
          break;
        case a.ZayaM:
        case a.EGcjj:
          o.role = e[0];
          break;
        case n(917) + n(757):
        case a[n(1313)]:
          o.ban = e[0];
          break;
        case "interactionCreate":
          o.interaction = e[0];
          break;
        case a[n(493)]:
          o.client = r;
          break;
        default:
          o.args = e;
      }
      i[n(604) + "fe"](n(769) + "d:" + t, o);
    });
  });
}
process[dQ(1053) + "Listen" + dQ(1136)](20);
let GuildData = require("./mode" + dQ(998) + dQ(1025) + dQ(508));
let Invite = require("./mode" + dQ(451) + dQ(701) + "ema");
let Transaction = require("./models/Transction");
let createAutoBackup = require(dQ(1390) + dQ(845) + dQ(1498) + dQ(763) + "p").createAutoBackup;
let DataPurgeService = require(dQ(855) + dQ(1125) + "/dataPurge");
client[dQ(473) + "ds"] = new Collection();
client.slashCommands = new Collection();
client[dQ(1244)] = new Collection();
client["comman" + dQ(773) + "y"] = false;
global["slashC" + dQ(672) + "s"] = [];
let BATCH_SIZE = 100;
let MAX_SNIPES = 50;
let MAX_BOT_REACTIONS = 100;
let MAX_DEBOUNCE_ENTRIES = 1000;
let DEBOUNCE_CLEANUP_INTERVAL = 300000;
let REACTION_CLEANUP_INTERVAL = 600000;
let leaderboardCache = require(dQ(855) + "s/lead" + dQ(896) + "d-cache");
function forceGC() {
  if (global.gc) {
    global.gc();
  }
}
function checkMemoryUsage() {
  let i = dQ;
  let n = {
    UEahW: function (e, n) {
      return e / n;
    },
    scRfb: function (e, n) {
      return e !== n;
    },
    YTehr: function (e, n) {
      return n < e;
    },
    kMvXs: function (e, n) {
      return e - n;
    }
  };
  let e = process[i(1158) + i(1505)]();
  let o = Math.round(n[i(1330)](e.heapUsed / 1024, 1024));
  if (o > 250) {
    var a;
    leaderboardCache[i(683) + "p"]();
    if (client[i(1244)] && client[i(1244)][i(494)] > 25) {
      a = client.snipes[i(494)] - 25;
      Array[i(424)](client.snipes[i(674)]()).slice(0, a).forEach(e => client[i(1244)][i(1228)](e));
    }
    if (interactionDebounce[i(494)] > 50) {
      Date.now();
      let o = 0;
      for (let [e, n] of interactionDebounce[i(1413) + "s"]()) {
        clearTimeout(n);
        interactionDebounce[i(1228)](e);
        o++;
      }
    }
    if (client.invites) {
      if (n.scRfb("MTpvP", "EbRkG")) {
        for (var [s, c] of client.invites.entries()) {
          if (client[i(925)][i(1236)].has(s)) {
            if (c && n[i(1350)](c.size, 100)) {
              for (let e of Array[i(424)](c.keys())[i(756)](0, n[i(800)](c[i(494)], 100))) {
                c[i(1228)](e);
              }
            }
          } else {
            client[i(455) + "s"][i(1228)](s);
          }
        }
      } else if (j[i(1054)] === 10026) {
        q[i(751) + "ns"] = r[i(751) + "ns"].filter(e => e !== t);
      } else {
        t.error(i(1466) + i(1552) + "ban us" + i(590) + u.userId + ":", v);
      }
    }
    forceGC();
  }
  return o;
}
function a() {
  let e = ["zxrHAwXL", "Bg9WBwvU", "zw50CMLL", "mtCZmJa4ofnKze9RDq", "vgL0Bgu", "C2v0q29S", "Cev2zw50", "Chv0", "CMvTB3zP", "4PscicdWN5seifi", "EhbVCNqG", "zIbUzwvK", "zMLUze9U", "zgf5", "uwfbz2y", "BNnLsgfU", "ierPC2nV", "ig5VDcbL", "ChjLC2vU", "sgL3C0u", "AZOGzg9J", "BfHyC3u", "zxjZl2fW", "CZOVl2rV", "yw5KCYiG", "Bgv0zs4", "ig5LDYbV", "sgTTuLC", "zMLUzgLU", "tKvqzui", "zsbYzxf1", "C2v0vgL0", "AxjLzcbW", "t1PuC2W", "Cg9SBhm", "zgv2zwXV", "yMfZztO", "y291BNq", "CgvYihnJ", "v2L0Aa", "C2HVD19X", "lsboB2rL", "l0fKzg9U", "vw9sBgS", "uM9SzuLe", "kIOGAw4G", "ru5trv9l", "DcbWzxjT", "C2vUza", "tM8GCMvH", "iMjVDciG", "yxrLq2HH", "CfjVBgu", "DxiGCM9S", "AwXL", "rMfPBgvK", "BYbNzw5L", "C3rHDfn5", "ExL1wMW", "zwfJDhm", "CNDZyLi", "qvvvuNa", "y2HHBM5L", "B3zL", "D2vKigLU", "lsbnsvnt", "yK93uvK", "ms4GvxnL", "lMrYywTV", "DgLVBNmU", "DxiTyM90", "se5qwNO", "zgvZDhjV", "CevKuLi", "ihjVBguG", "Bwf4", "AgfUzgXP", "E3n0yxrZ", "rw1VAMK", "AxnbDxrV", "BgvUz3rO", "CMvWBhLF", "yxnLigvU", "DhmV", "ywDLigzV", "sLbQrwe", "ihnLy3rP", "DgLSAxr5", "zYbWyw5L", "vg90ywXt", "zw4Tvvm", "BhmVuMvH", "B3LxB1a", "zerlwNa", "vxnHz2u", "zgLMzG", "B2XLiefe", "lY9KAxnJ", "ywDNCMvN", "CY4UlG", "C2v0rgvZ", "BenYzwf0", "B3qGzM91", "y29UDgvU", "l2f1DgHV", "t25SAw5L", "Cgu9yM90", "uviGy29K", "twvTB3j5", "re9HqMK", "BMCGCgfY", "BMv0l2fW", "qM90vg9R", "BMv3ihrV", "uhnfB2i", "BIb5B3vY", "BhmVy2HH", "u2Xuqui", "zsbbre1j", "ChrZoIa", "zgrYzxnZ", "tLzbteLe", "lI9TB2rL", "AwnLBNnL", "AwnRigzV", "CMvKigzV", "ywn0Aw9U", "DgLTzxn0", "tK1Xzfq", "igzHAwXL", "BhmVDgLJ", "DgHLBG", "zxmU", "w0vsuK9s", "y2XLyxi", "DxnLCNm", "B2LJzq", "yxv0B2nV", "D2fYBG", "u1rMv2m", "mhWYFdD8", "ihrVihvU", "uM9SzsbU", "mI4Gu2vS", "Dg9ku09o", "qwjbtNu", "s3nKswG", "AwnVBLvs", "CIbNCMfJ", "zgLZywXS", "jhrVDgfS", "Bwf0y2G", "zgvMzxjY", "lIbnyxHP", "8j+uLYbODhrW", "yxv0BY1R", "zNjVBq", "FdeYFdeW", "u3r5Bgu", "Dg9tDhjP", "r2Lhwee", "A3fAsNq", "vgLJA2v0", "zxrHAwXZ", "DxiGyM90", "Dgf0zq", "BwfW", "zcb1CgrH", "igrLDgvJ", "y29UzMLN", "ze5HBwu", "DxnLCG", "zw1VAMK", "A2LxAwq", "C3vIC3rY", "B2XVCNm", "uM9Szxm", "B25ZlMnV", "vevqu3i", "AgfUicOQ", "Bw5Iufu", "BNmGyxjL", "wfrlrNK", "BhmVAw52", "rLbSCuC", "ywDHAw4U", "zfDHCM5P", "Aw52AxrL", "CMvHDgu", "lJeTB2j0", "uuPUrxi", "zxHLyW", "BMvKigLU", "yw5Hz2uG", "y29Uy2f0", "qxfwAMS", "AMr6yvm", "BNrnyw5H", "D2fZigfU", "Aw9UCW", "CMvHzgrP", "BM93", "z2HLCIb0", "Ce5IvKS", "B2DJree", "y29TBwfU", "zef0", "ruqGlsbj", "vgHLigjV", "rw5HyMXL", "z2vKigDH", "Aw4GEw91", "ig1PBNv0", "AxPLihrO", "4PscicdWN5sNifi", "z2v0", "igjLBg93", "CNjVCJOG", "icjcB3qI", "DKz1z2W", "BhmVBwfU", "Dc5UzxqV", "uvHrCKm", "zM9YrwfJ", "qxv0Ag9Y", "r0Lps3q", "C2L6zq", "BgLMDgvK", "CMvHy3rP", "uKvbq1q", "C3rsyxrL", "CIbJB3jL", "Dgv4Da", "vg90ywXs", "zwjTu0e", "B3PLANm", "zsbSAw5R", "qwXStgLZ", "De9lExK", "CgrHDgu", "u2nOzw1H", "zxHPDa", "y3rnzw51", "y3mUzhjH", "B2XKu3rH", "ruDJAMO", "yu5VEfG", "zw1VDMfS", "zhPUDuK", "vezSvha", "zs4GugXL", "zwXjra", "rwHwAMu", "mhWXmW", "jhrPBwvV", "C1DPDgHs", "zcaOr3jH", "zwnVBM9T", "DKjlBfu", "ig1PC3nP", "y29YCMvJ", "C0nVDw50", "u2vYDMvY", "B3qGD2LS", "igXVywrP", "DcbOyxzL", "BMqGzM9Y", "AK9ND1u", "zMXVB3i", "Aw50zxjL", "r3vPBgrw", "twvTyMvY", "A2LlA3q", "qKzgzgS", "rwnVBM9T", "z2v0rxzL", "vLLOv1O", "rxbOzw1L", "g1SZm20L", "C2v0rw1V", "zsbIB3qG", "zMLYC3rl", "zvvWzgf0", "ANPey3q", "BMCGCMvH", "ysbMDw5J", "ywXPzcb0", "y2uGqxr0", "sLHmve0", "Aw50zxjH", "y3vZDg9T", "B24GuM9S", "zs1PBNzP", "BIbSAw1P", "BgvHBG", "Aw1PEMvK", "D2fYBMLU", "rM9VDgvY", "4Psb4Psb4Psb4Psb4Psb4Psb", "wgTlEhy", "zwr1BgvY", "t1jeu0y", "z3vPBgrj", "EKXpvfe", "BMv3twvT", "DM9Py2vt", "BMvSoIa", "u2nOzwr1", "CMfS", "zxn0yw1W", "igjVDcbY", "zNvUy3rP", "BMCUlI4", "vg90ywXc", "lI9HzgrV", "DMfSAwqG", "De5my0O", "zwvKigHL", "Aw9UigfU", "CMvWBgLL", "Fde0Fdj8", "u0Lhvevs", "zxiG", "CMvZCg9U", "4PscicdWN5seiem", "zxjYB3i", "vhLjEe0", "B3iGCgfU", "vgLTzxPV", "zuLK", "4OAsifjVBgu", "sgXksLi", "wg1SAKu", "AhjNDxm", "AxrPB25H", "ChbSAwnH", "zw1PDfnH", "t1aGB2yG", "zg9UC0zY", "yxrTEue", "zs5QCW", "mtqYmteYmdDWCwLzAxq", "CMfUzg9T", "AwrSzq", "BwvTyMvY", "BxbSzxrL", "ihrVA2vU", "yxnOignV", "CgX5", "y2HVAwnL", "Bxb0ia", "Bg9HzefK", "C3mGBM90", "8j+AQYbct1qG", "zhnuy1m", "rKfpELK", "4PscicaGica", "4OcIienOzwm", "twLZC2LU", "Dg8GEw91", "A2vUiIb0", "BIbvC2vY", "EfbStxm", "x2nVzgu", "tuLosvnu", "q2PvCxq", "AxncDxr0", "wgX6Egi", "v3LHzKi", "qxv0B0TP", "CM1PC3nP", "whbUz20", "lI9LDMvU", "DhLWzxmV", "B3vUzcbM", "B21eAxjL", "wNrvAvi", "v29yC3G", "ms4G4PYfiei", "y29TCg9U", "B3qGBxvZ", "vgHLCMuG", "AuvJuuq", "BM5LBcbM", "BMfTzq", "s21yqum", "vg90ywXn", "zw1WyMfU", "CY9Ly29U", "BgvYCW", "AwrLigvY", "C2nOzwr1", "CMvHzhK", "B1D2vKO", "Dg8GAhr0", "CgfUzwW6", "BgvYCY9J", "uxjUtLq", "ChrPB24", "qwrKzwqG", "thP4vem", "zgvMzxjs", "igvYCM9Y", "ig9Jy3vY", "B21Tyw5K", "zunYzwf0", "A2v5CW", "tLPyBuG", "mY4GtMf2", "iejpveGG", "ug1pzgu", "ExnfveO", "zMv0y2G", "B3iGz3vP", "AwqGDgvT", "y2XLyw51", "CML6zt9J", "BcbPBIbe", "DgLHBcbY", "rNbdsee", "t2T2rwy", "mY4G8j+tIIbc", "ywrKB25m", "ChjLBwL1", "yNzZsgu", "C3vJy2vZ", "t1bf", "tLPOChy", "t0jewxG", "4P2micOQugu", "yw5PBwf0", "AxneAxjL", "DgHLihnL", "AxrLu2nO", "zw1VAMLZ", "yvLyBxK", "B2XKtwvZ", "A29KzxzL", "tKjJwvC", "rhjHA29c", "Aw1L", "wwjNEMW", "Axj5tMS", "Cg9ZDa", "kerelu1n", "Aw5JBhvK", "yxrL", "DgvYihnS", "Dg9Tswq", "yM90", "DguGEw91", "CgvYAw9K", "Aw5NihLV", "oIbKAxnJ", "qM90vxb0", "z2vY", "Aw5JB21W", "u0vmrunu", "y3H6Cum", "zhvYAw5N", "reX2D0y", "Fde1Fdz8", "swHREM8", "AwDHDguG", "B2XSia", "tgLJzw5Z", "zwjVDw5J", "mtm1mZq0mJjzsef4Dxy", "BeHxA3y", "qxr0zw1W", "DgL0Bgu", "jYbKB2vZ", "y291BNre", "yLfnB2W", "zw5KC1DP", "wePyDNO", "B2rLDMvS", "B2nLC3mG", "z1f4qw0", "Ec5QCW", "B2fKzxi", "Axm6", "igzVCIbL", "DgvTCejH", "B25Uzwn0", "zwqGDg8G", "B2XSig1L", "zw1Izxjb", "C2XPy2u", "yw5bzgq", "rM1PEfG", "yxrZoG", "B0zvrfO", "ihrVihvW", "z2v0vgLT", "l2jHy2T1", "uwPKwgG", "B25ZihrV", "BhmVCg9S", "xsbfDMvU", "tf9jra", "zgLZy29Y", "zML4ihrO", "vNjLwuG", "AerkyNG", "zhnszwfK", "C2v0vgLT", "zurLBgv0", "zwnRihLV", "ChrdwwO", "DgHLia", "C0Txuhu", "yw5Hz2vY", "z3rsA1y", "BIbLEhbP", "4PQHifnmqvm", "uMvHzhK", "B25FCM9S", "rffRAeS", "ievYCM9Y", "zhmIigfY", "lxn0zxaG", "ywrKq29T", "AM9PBG", "BgqG", "EdnQvxDH", "DwLYzsb0", "u0Lhsu5u", "lMPZ", "DguGzM9Y", "t25L", "ywjZ", "A012whm", "DJeW", "AwXLihjL", "x21ZzW", "Dcb0B2TL", "rhriyMq", "qNLTCNG", "wuPPu0q", "zxHLy3v0", "mY4GtwfR", "AMfNq1y", "igv4CgLY", "r0rtq0e", "vg90ywXd", "q2fQEvC", "A2v5", "Dg8GDgHL", "tvnVu0K", "tufTzei", "mI4GuMuT", "zgn4v2K", "AgfZ", "v1PjDhG", "yw50oIbl", "ywWGAw4G", "yw5K", "ihrVihbY", "vwPUCLK", "4PscicdWN4AyieC", "vw5RBM93", "C2LVBNng", "CNr1Ca", "zsbHDxrV", "C2v0q3vZ", "DgnOihjL", "z3vPBgq", "B2TLBIb3", "x292zxj2", "C2v0vgH1", "zsbbDhrL", "zgf0zq", "CL9JB2rL", "DM90zxm", "AxjLzcb0", "uM1SAMO", "yw5KCY9v", "CY5KCMfR", "zwfJDgLV", "ywLS", "C2LUzYbW", "sK9cwKK", "AgfUBMvS", "ms4Gr28G", "yw5szw1V", "zsaIyxbW", "lI91DgLS", "tNvTyMvY", "rvnuihjV", "C3rHCNrZ", "CM9Szq", "CNzHBa", "v2fSBgv0", "zcbHzNrL", "zgf0Aw9U", "Cen2tK4", "r05MC0K", "CMvHzhLt", "sLL5Bu4", "lM5LDa", "igf0DgvT", "weLoA3i", "Awq9", "zxnZywDL", "igLUigD1", "tgLZDgvU", "ihrVigXV", "zgf0zsbJ", "Bendu0u", "rxPWtvy", "rgvZy3jP", "zw1Izxjv", "zwf0zq", "DhmVr2L2", "zw1IzxjZ", "BMCGBwvT", "qMfJA3vW", "CM9SzuLK", "zwq6ia", "q3njuuS", "tNr3txG", "BM5Ly3qG", "yNHKCvi", "AwmV", "uM9SzxmQ", "EeXpAhG", "y0Twy0y", "zxjIB2fY", "ueHNrvu", "B25PDg9Y", "twfuvNi", "igLUDML0", "yNPjz1C", "AxntDhjP", "zurby2u", "C2nVCgu", "rgf0yvb1", "zwqGywz0", "mtrSuKX6swW", "4PscicdWN5sNieG", "4OcIifjLlwK", "y29TCgXL", "CMvNAxn0", "AfjHA2G", "yuveqKy", "otK2mZHss0zKt2y", "B3jKlMnV", "BeLK", "z3vPBgrc", "quLmruqG", "rLrAEwS", "DxnLqNv0", "y3jLyxrL", "DhjPBq", "y3jPChrP", "D3fctee", "z3vPBgrZ", "C2nVCgvZ", "nJuYodm0ogfHtNzyua", "y2f0Aw9U", "u3n0rfu", "B2XL", "DgvUDhm", "l2nVBMzP", "B3bLCYbP", "BgLKig9Y", "ChjOt0G", "zwWG", "B25sB2XL", "CMvWBhK", "C3rVCejH", "Aw5Kzxi", "AxqH", "B3jYzwn0", "zwvWihLV", "zcb1Cca", "A2vUigfU", "zw50CW", "t3bLBLrP", "kIbWzxjT", "Esb0AguG", "uKneyKG", "B2XSigLU", "svHPwxC", "Evnzzvq", "yw1L", "tKLtvfjb", "Bw9QAtOG", "kIOGCM9S", "CM9WzxiG", "C2LUzYbZ", "v2fYBMLU", "y3rPB246", "DgHVDxqG", "yxrPB25d", "y3rVCNK", "y29SB3i", "u2TPChbP", "y2f0y2G", "zwXZl2HH", "EwLUzYbS", "mZCXmta3ofjvsfrAEa", "sgnNz3i", "Fde2FdeW", "Bs9HCgKV", "q2HHBM5L", "CNLPBMCG", "CcbNDwLK", "tgPnq0q", "Ahr0Chm6", "zgvMyxvS", "C2f2zq", "DxrZ", "DgfN", "zgvZy3jP", "zgf0zsbW", "CgvJDgvK", "AMLwruu", "cUkaOIaQkK0", "u1rbuLrv", "AfLyt0q", "CMvKigr1", "x2LK", "C2HHCMuG", "zLzhExG", "ifzVDgvZ", "C2XHC2Hd", "4PscicdINyWGqq", "C0LuzxO", "BhmVz3vP", "igLUihbH", "zgLZCgXH", "t3ftswC", "l2rYywTV", "D2L5Euq", "ChjLzMvY", "zw1VDMu", "BhviENO", "y2XVC2u", "ALbUzha", "CgfUzwXo", "su5hifbf", "su1jvf9f", "CIbJAgvJ", "zvjLywn0", "4PscicdINyWGrq", "ig1LBwjL", "BgLLBNrF", "CMDL", "DhLWzq", "Dg9UCW", "DhmVDM9P", "z2vZDgLV", "BNqUBMv0", "zhPwy0S", "ssbKB24N", "BgreyxrH", "yuXMAM8", "vvPrrNa", "qwLTwLG", "ptGMC2nV", "ve9sihbL", "uMvTAw5K", "yw5Kia", "B25Z", "zgXLCNmU", "Dgv3yxKG", "BcaI", "tuzwyLi", "zsb2ywXP", "CMqGC2vY", "qu5euYbg", "q0LftLqG", "tejLufm", "t0rf", "C3nPB25Z", "BIb0Aw1L", "tfHctfG", "AK11z04", "igvUDhjP", "Bw1HBMrZ", "Bw1HBMqH", "uevstuLt", "ignVBw1H", "C2v0twf4", "y29Kzq", "C3rHDhvZ", "y2vMALq", "jtiWyxbW", "CMf0zsbH", "ic0GqxbW", "nhWXmxW1", "ihDPDgGG", "Cxjgs1e", "CMvK", "C3qGAgf2", "zsbZDxjL", "B3bLBG", "uK9s", "mI4G8j+BOE+4JYaG", "Cg9Uzw50", "lMPZia", "DgXOuMC", "4PscicdWN4Ayie4", "zgf0yq", "tMfTzq", "z3vPBgrn", "vhDQB3e", "DxnLCKLK", "BIbHDxrV", "igfWCgXP", "B3DLzcbP", "C3vYzsbj", "4OcIieDVihq", "B2n1BwvU", "AMHrzvm", "CMvTB3zL", "zxqGAgvS", "4PscicdWN5oAieq", "swnVBG", "ywTVzgv2", "BNjtu0i", "DhD6A2O", "ihjLz2LZ", "mtf8mxWX", "vgLTzq", "ks4GuMv0", "tgLUAW", "zungy0G", "C2LVBG", "AxjLzcb3", "zsbqyw5L", "rxjYB3iG", "CLn5BMm", "Dg90ywW", "y2SGiLjL", "Aw5N", "z0XVywrL", "tLnvrKzj", "qwXLCNq", "ihjLBw92", "zcbhDwLK", "zxmGywn0", "yxv0Ag9Y", "B3qGAxmG", "A2v0CY9J", "sMfKEhu", "EfLZmtiZ", "BZbQogOZ", "su9Tze8", "yvvRyNO", "uM9Szxnv", "DgvUzxjZ", "BguGAw4G", "BM5LBfn0", "igj1DhrV", "CY9JB3jL", "DhmVtxvZ", "zc1HCgKT", "nNWXmNW5", "sw1WB3j0", "igjLihrO", "DLnvr2S", "CM9SzunY", "rufHyMS", "yxbWBgLJ", "tML0CM9c", "zxjZ", "ihrVignV", "ns4Gq29W", "Bgv0zsbH", "AhPVvgS", "l3bLCMzn", "Aw9UuMvT", "iMfWCgXP", "CKrHDgeU", "AxnczwzV", "BguGBgLZ", "uMvTB3zL", "rM9YBwf0", "Bfn0yxrZ", "CYbPBNzP", "zevdtuK", "y3zqvxK", "CIbZDxbW", "Be5HBwu", "8j+uLYbtteft", "q2XLyw5L", "seG6Bw0", "BwvTB3j5", "BgvYCY9T", "CY9Oyw5K", "B2XKtwvT", "qxv0BY1l", "ywXjza", "CgrHDgvK", "lsbvtKTo", "nMLcwhLUtq", "zxm6", "DgvY", "yxjUAw5N", "BIbnzxnZ", "q29SB3i", "DMvYC2LV", "C3rVCMvb", "qM90ig11", "D25MC3y", "zsbTzxnZ", "C2v0", "yxj5", "CgXPy2f0", "ihn0yxj0", "ywLUlxLV", "C3zms0e", "Dw5UAw5N", "qxv0B0jH", "xsbgywLS", "zxiGu2v0", "CIbJB21T", "ihjLDhvY", "zfjVBgvZ", "B2XLihrV", "AwrLzcbP", "ucbgquLm", "BeHVBhO", "y2TLDa", "C0XMqva", "DM9Py2vy", "tKrxyxK", "ww91CIbI", "shDpu0W", "B3CGDg8G", "ig91CIbe", "zMv0y2HP", "CM9Szxm", "y3rPB25d", "vg5PEMm", "DgLUzYb0", "CNDSzNq", "ChvZAa", "qxHlDvq", "y3rPB24G", "vvjm", "tfbYDMi", "CMvTB3zH", "Aw5NihnS", "C29SDxrP", "CgvOExy", "AwnRoIbg", "C0PsB0W", "zhmGC2nV", "BM9kAhC", "tfjYBLK", "CY9SAwnL", "4OcIiePVAw4", "BMCGzxHW", "ihDOAwXL", "zxzLBg9W", "v1PzugC", "zgvSzxrL", "ChDoC3G", "B3bTzw50", "AgLZignV", "BYbtzxj2", "CNjVCIbK", "y29UBMvJ", "jNbLCM1P", "y2fJAgu", "r3jHy2uG", "BKzhB2G", "rw1Izwq", "BMqG", "Bg9N", "ievsuK9s", "BNrLBNrZ", "C25PCgvZ", "Chm6lY9K", "z29pthK", "BeLyv1C", "seG6Bw0G", "BKn1qxy", "CMfJDgLV", "C2v0ugXH", "zsbZzwXL", "CXTBmg0", "mxWZFdH8", "DcbMAwXL", "Aw50zxj2", "DgvZ", "tK9FteLd", "y2TLDhm", "DgLVBG", "CMvZzxrs", "yM9Sza", "zwXVCg1L", "uunAvMy", "yw1W", "igv4zwn1", "D2f5u2nO", "y0zyBNe", "ywXLCNrn", "B3vUDa", "CcbYB2XL", "C2v0rM9V", "vfjYyuO", "uuTWB2q", "quHfwMO", "Dgf0zvvW", "igzVDw5K", "BwvZC2fN", "Aw1ztKq", "zMLUza", "y2XVC2vK", "yM1mufe", "zwrPDfjL", "CMLUzYbI", "C3m6iga", "y2TZihbL", "ANbnyKO", "mJq2nZu5nxviBfzNBq", "nc4Grw5H", "4OcIifzPC2K", "sNnnrxK", "CgfYDgLH", "y3rLza", "C29YDa", "ChnpwuS", "zgvYu2nO", "A2LJAW", "8j+sPsbct1qG", "lxrVA2vU", "z2LZDgvY", "DgvKihDP", "sfrVsLG", "y29Yzc5K", "yxrty2HL", "DgHLihjV", "ywjdweG", "yxrPB24U", "DhmVuMvT", "B3iGCM9S", "Bwf4sw50", "uKfut1iG", "wenMBgW", "EvP6wgm", "tufiDM0", "t05t", "sKDACgy", "t09gz3y", "lYnPzc0X", "Dg8Gtw9U", "B3qGCM9S", "EgTgC3q", "y2vtDgf0", "y2HLy2TP", "zM9YBwf0", "mNW5FdeW", "ihzHBgLK", "Dg8GywnX", "zMLSDgvY", "DMfSDwvZ", "vuvHAfC", "wenfrurf", "vxnLzcbK", "DwLKztO", "Dgf0ia", "ueHgwxi", "lMnVBs9K", "Aw4G", "ChjVy2vZ", "uMvNAw9U", "surFq0fq", "Fdb8ohW1", "q3jLyxrP", "C3nPB24G", "rw9jBuy", "Bujnz2e", "mtbzwhrvqNq", "zfHACKe", "mLrnCfHkDa", "igrHDgfI", "wvrLAhi", "scbdt01n", "zg5K", "DMLKzwq", "lNLTBcbM", "uMvHy3rP", "icHhCMfJ", "ihrOzsbJ", "DcbIzsbP", "BMDtzwXL", "y2T1Ca", "AxnHBgXV", "AxnJB3jK", "DguGyM90", "zxjLC3rf", "yxnLCW", "vgv4Da", "zsbJAgvJ", "igfKzhjL", "ruqGlsbv", "CMfRB2rL", "u2v0DgLU", "ihrVigzL", "mtv8mtf8", "zxr1Ccbh", "su5hifnd", "igLUDMfS", "wgPHBum", "BwLU", "zgXLCJO", "BgLJyxrP", "B3qGC3rH", "BeLe", "zw1WDca", "Eu5HBwu", "ihvWzgf0", "C3bSAxq", "ztOGAhr0", "zsbTDxn0", "ywrK", "lI9JB21T", "AxzPEeu", "DgLVBI4G", "q291BNq", "qLvuve9o", "twvZC2fN", "Dg9vChbL", "CMvHy3q", "4OcIierYywC", "zxf1AxjL", "qM90igXH", "z29eqJOG", "ruPUzwi", "zufUzfvW", "4PscicdWN5olieu", "AxnbCNjH", "vxrPBhm", "CunPsMy", "Be5dC1C", "DgvWlwj5", "sw50zxj2"];
  return (a = function () {
    return e;
  })();
}
function registerTimer(e, n) {
  var o = dQ;
  if (TIMER_REGISTRY.has(e)) {
    clearInterval(TIMER_REGISTRY[o(483)](e));
  }
  TIMER_REGISTRY[o(1177)](e, n);
  return n;
}
function clearAllTimers() {
  var e;
  var n;
  var o = dQ;
  var t = {
    aNoxX: function (e, n) {
      return e(n);
    }
  };
  for ([e, n] of TIMER_REGISTRY[o(1413) + "s"]()) {
    t[o(514)](clearInterval, n);
  }
  TIMER_REGISTRY.clear();
}
registerTimer(dQ(1519) + "Monitor", setInterval(checkMemoryUsage, 60000));
(async () => {
  let q = dQ;
  let P = {
    hRakh: q(1492),
    cvPUy: function (e, n) {
      return e(n);
    },
    skYvf: function (e, n) {
      return e(n);
    },
    OOFgv: function (e, n, o) {
      return e(n, o);
    },
    eOwKq: "LRrnY",
    EhVje: function (e, n) {
      return e === n;
    },
    gtRkV: "lTOYn",
    dDKZp: q(901),
    sKWPu: function (e, n) {
      return e !== n;
    },
    XkKxv: "dvhMY",
    FTZyk: function (e, n) {
      return e - n;
    },
    eCFcH: function (e, n) {
      return e(n);
    },
    rwIqP: q(571),
    ONLrs: q(1518) + "e not found.",
    WJkVU: function (e, n) {
      return e === n;
    },
    tOKyy: "QaAgf",
    DQkhK: "KsdIh",
    LBePS: q(1101) + "in mai" + q(1078) + "complete han" + q(1379),
    WyafB: function (e, n) {
      return e !== n;
    },
    mBMga: function (e, n) {
      return n < e;
    },
    dHBHN: function (e, n, o) {
      return e(n, o);
    },
    kiWid: function (e, n) {
      return e === n;
    },
    fQCPx: q(1140),
    lIXWW: function (e, n) {
      return e !== n;
    },
    HLCPI: "iuObB",
    jpMbJ: function (e, n, o) {
      return e(n, o);
    },
    RGpgf: q(1101) + "updating rol" + q(1167),
    PHFYr: function (e, n) {
      return e - n;
    },
    VagyV: "dkojY",
    PSoUx: q(1027),
    GNfsI: q(665),
    oJtoP: q(1472),
    JOBZI: function (e) {
      return e();
    },
    IXiYw: function (e) {
      return e();
    },
    NZXmH: "unknown",
    UjnrY: "cmd_",
    AHEZj: function (e, n) {
      return e instanceof n;
    },
    dMnOA: function (e) {
      return e();
    },
    cFXnq: q(582) + "ns",
    kiKkt: q(1155) + "H COMMANDS FAILED " + q(1476) + q(1375) + q(694),
    XCfll: function (e, n) {
      return e(n);
    },
    bmQfR: q(974) + q(1149),
    OqSIg: function (e, n) {
      return e * n;
    },
    NjGAr: function (e, n) {
      return e(n);
    },
    Ezivl: q(905) + "rge",
    ZCqdy: function (e, n, o) {
      return e(n, o);
    },
    bQMol: "gOwvu",
    NZhpv: "slash." + q(911) + "er",
    ROgRF: "│  📚 D" + q(1411) + q(1110) + q(1387) + q(1245) + "ocs.dr" + q(1089) + "elopme" + q(1022) + "/#id-1" + q(457) + "ain-yo" + q(1481) + "-token",
    lNCsW: "━━━━━━━━━━━━" + q(566) + "━━━━━━" + q(566) + "━━━━━━" + q(566) + q(566) + "━━━━━━━━━━━━━━━━━━" + q(566),
    hpzBc: "│     4. ⚙️  " + q(1174) + q(1064) + "e \"app" + q(1380) + q(445) + q(1049) + "\" scope",
    vLFXL: "│     • Check if b" + q(1113) + "in your server",
    urSvb: q(624) + "• Go to Serv" + q(1186) + "tings " + q(598) + "s",
    ZKYlc: q(624) + "• Give bot r" + q(1507) + q(632) + q(1311) + "permis" + q(1098),
    lXXsu: q(624) + q(909) + "nvite bot with pro" + q(1449) + q(933) + q(1422) + "ed",
    OOucN: q(566) + q(566) + q(566) + q(566) + q(566) + q(566) + q(566) + "━━━━━━" + q(566) + q(566) + "━━━━━━━━━━━━\n",
    sJRoL: q(1134) + q(1307) + "comman" + q(1219) + "pe",
    xkFst: "│     1. Use" + q(1357) + q(942) + q(900) + "e link" + q(484),
    iryNk: "│     " + q(809) + q(1065) + q(677) + q(1461) + "and \"a" + q(603) + "tions." + q(473) + "ds\" ar" + q(1252) + q(1293),
    JfDmv: "│  📚 S" + q(1374) + q(1333),
    lzkev: q(996) + "n unex" + q(985) + " error" + q(671) + "red wh" + q(802) + q(1300) + q(1214) + "ash commands",
    yYIJn: "│     • Join" + q(1201) + q(1362) + q(721) + "ord.gg" + q(1002),
    eoqQb: q(624) + "• Provide error details " + q(479) + "r support ti" + q(1194),
    MAHvm: "No additional details available",
    QXMLx: function (e, n) {
      return e === n;
    },
    EAabk: function (e, n) {
      return e === n;
    },
    sITez: "TFlTp",
    tapLe: function (e, n, o) {
      return e(n, o);
    },
    hYXOD: q(639),
    ZxNQE: q(1062),
    QXQrC: "iXyJZ",
    oFUDZ: function (e, n) {
      return e * n;
    },
    WFlWK: function (e, n) {
      return e * n;
    },
    LjMCD: function (e, n) {
      return e <= n;
    },
    JCUao: "{stats}",
    twzkj: "│     2. Select your bot" + q(1079) + "cation",
    AvzLP: function (e, n) {
      return e !== n;
    },
    CsJYn: q(464),
    ISLWr: q(1273),
    kGOeX: "TotalEmojisC" + q(1270),
    RCDbH: "OnlineMember" + q(529),
    LPrvb: q(1151),
    QVmtt: q(1175),
    ePBOc: q(678),
    Twjoq: q(418) + q(1395) + "es",
    EzpMV: function (e, n) {
      return e / n;
    },
    EJneb: function (e, n) {
      return e / n;
    },
    CJtyn: function (e, n) {
      return e !== n;
    },
    meQuN: "mHIcf",
    fVGyx: q(807),
    FAbRW: "qXseU",
    ozejs: "$warnings",
    DtHbd: "$bans",
    cNdAF: q(522) + q(981),
    svLKA: q(730),
    yIaVn: "deleted",
    wMyZN: q(581) + "annedM" + q(883),
    eDAce: q(530) + "CreationDate",
    LzxTC: function (e, n) {
      return e !== n;
    },
    JGZpf: function (e, n) {
      return e instanceof n;
    },
    EHLAb: q(1544) + "]",
    Ybgzl: function (e, n) {
      return e === n;
    },
    cKVcF: "LpPEa",
    JPjEa: q(899),
    WmrsV: "RxMzq",
    ROkwe: function (e, n) {
      return e === n;
    },
    QJnEr: "bWiEb",
    ZtUiR: q(1037),
    QjdXh: function (e, n) {
      return e === n;
    },
    UWkDB: function (e, n, o, t) {
      return e(n, o, t);
    },
    OtKzA: q(864),
    waTfF: q(1394),
    gRPQj: q(725),
    CsIQK: q(1440),
    HkmRW: function (e, n) {
      return e(n);
    },
    TxMAE: function (e, n) {
      return e - n;
    },
    aEDBF: "lCCSE",
    DGfME: q(817),
    VYhWZ: "closed",
    cefjT: "Expire" + q(1189),
    NBcYW: function (e, n, o, t) {
      return e(n, o, t);
    },
    nonoG: "JBYpP",
    HiwsE: q(1014) + q(485) + "Bot lacks permissions to" + q(1092) + q(715) + "ash commands",
    Jadxu: q(1420) + "e-invite bot" + q(1061) + "correc" + q(1458) + "issions:",
    FPlqG: function (e, n) {
      return e !== n;
    },
    prhOH: "Failed to update p" + q(951) + q(1349) + "ase:",
    PHgEU: function (e, n) {
      return e === n;
    },
    pehyv: function (e, n, o, t) {
      return e(n, o, t);
    },
    OZTsl: function (e, n) {
      return e !== n;
    },
    XJXvz: q(1279),
    mnbPU: "PFaFz",
    ogcDA: function (e, n) {
      return e === n;
    },
    HwOSL: q(829) + q(1170) + "age",
    WZItx: q(1466) + q(875) + "ad polls from data" + q(1447),
    gnRyH: function (e, n) {
      return e <= n;
    },
    sZryL: function (e, n) {
      return e === n;
    },
    XINkr: q(894),
    ptCYj: "MAX_HW" + q(1340),
    FpCHA: function (e, n) {
      return e(n);
    },
    bvsHe: "RATE_L" + q(1011) + q(1331) + "D",
    psOYK: function (e, n) {
      return e !== n;
    },
    yyuZl: q(693) + "s",
    KmXAC: function (e, n) {
      return e === n;
    },
    QKpod: q(707) + "ot",
    mJSsC: "OuhzA",
    ZBesp: function (e, n) {
      return e === n;
    },
    fyWEP: q(463),
    CjUqt: function (e, n) {
      return e !== n;
    },
    ysETJ: function (e, n) {
      return e + n;
    },
    oyWoP: "🚫 BOT " + q(988) + "P FAIL" + q(475) + q(1107) + q(1041) + q(1051) + "SIONS",
    abCXH: q(1014) + q(485) + "Your b" + q(1113) + "using disall" + q(1080) + q(1243),
    Xcrja: q(624) + "1. Go " + q(662) + "ps://d" + q(1362) + ".com/d" + q(1226) + "ers/applications",
    zAhBB: q(624) + q(676) + "igate to the \"Bot\"" + q(1497) + "on",
    tlhRg: "│     " + q(1289) + "ble th" + q(1441) + "ired privile" + q(478) + "teway intents",
    LXBLX: "│     4. Click \"Reset Token\" t" + q(1467) + q(1058) + q(1437) + "ne",
    rwsbR: "│  ⚠️  Import" + q(823) + q(943) + "ur bot" + q(614) + " secure and never share " + q(941),
    QFPHB: "│  ❌ An unex" + q(985) + q(670) + q(671) + q(990) + q(1284) + q(1381) + q(831),
    mJFdR: q(624) + q(625) + q(1431) + q(846) + q(744) + q(1230) + q(868),
    nFGoh: function (e, n) {
      return e(n);
    },
    rwlft: function (e) {
      return e();
    },
    qCiJf: function (e, n) {
      return e * n;
    },
    jOgwU: function (e) {
      return e();
    },
    JsXLU: q(1278) + q(775) + "e",
    HNPZz: q(557) + q(1204) + "reate",
    luHzz: "messageUpdate",
    JYymN: "function",
    vFugl: q(1047),
    URhsv: function (e, n) {
      return e(n);
    },
    RXBrR: q(600),
    pNbVK: function (e, n) {
      return e === n;
    },
    vBKlU: q(569),
    RAobI: function (e, n) {
      return e - n;
    },
    pwNsx: "XBeBX",
    bxdqR: q(661),
    AnwWI: q(1075) + q(755) + "dd",
    goOLy: "client" + q(784),
    STfWc: q(593),
    Hcggr: "warn",
    wqBLA: q(1278) + "eReactionAdd",
    TEPSr: "messageReactionRemove",
    jLQJk: function (e, n) {
      return e(n);
    },
    nrSSB: "./even" + q(1494),
    yEkkw: q(589) + "M"
  };
  try {
    await connectToMongoDB();
  } catch (e) {
    if (P.OZTsl("oWvVJ", P[q(891)])) {
      S.tempBans = G[q(751) + "ns"][q(1328)](e => e !== H);
    } else {
      console[q(593)](q(1466) + " to co" + q(890) + q(1319) + q(1401) + e[q(1278) + "e"]);
      process[q(509)](1);
    }
  }
  const R = require(q(855) + "s/hand" + q(664) + "ustomCommandHandler").handleButtonInteraction;
  client.on("messageCreate", j);
  client.on(q(1278) + q(775) + "e", K);
  client.on("intera" + q(1204) + "reate", async e => {
    var n = q;
    if (e[n(634) + "on"]() && e[n(558) + "Id"].startsWith(P[n(912)])) {
      await P[n(1152)](R, e);
    } else {
      await P.skYvf(V, e);
    }
  });
  client.on(P[q(1006)], Z);
  client.on(P.AnwWI, v);
  client.on(q(1278) + "eReactionAdd", h);
  client.on(q(1278) + "eReact" + q(1142) + q(1474), X);
  client.on(P[q(1246)], C);
  client.on(P[q(1550)], _);
  client.on(P[q(971)], $);
  let N = {};
  function S(e, n) {
    N[e] = n;
  }
  function G(e) {
    if (q(1221) === P.eOwKq) {
      return parseInt(e.replace("#", ""), 16);
    } else {
      return P.OOFgv(N, S.replace("#", ""), 16);
    }
  }
  function j(e) {
    var n = q;
    if (!e.author[n(717)]) {
      P.skYvf(H, e);
    }
  }
  async function H(e) {
    var n = q;
    var o = await Ticket.findOne({
      channelId: e.channel.id,
      status: n(1066)
    });
    if (o && e[n(1112)].id === o[n(1077)]) {
      o["alertT" + n(708)] = null;
      if (o[n(1269) + "essageId"]) {
        if (P.EhVje(P[n(781)], P.gtRkV)) {
          e = await e.channel.messages.fetch(o["alertM" + n(872) + "Id"]).catch(() => null);
          if (e) {
            try {
              await e.delete();
            } catch (e) {
              if (e[n(1054)] !== 10008) {
                console[n(593)](n(1466) + " to de" + n(1139) + "lert message:", e);
              }
            }
          }
          o[n(1269) + "essageId"] = null;
        } else {
          R[n(1054)];
        }
      }
      await o.save();
    }
  }
  function K(e) {
    var n;
    var o = q;
    if (e[o(835)] && e.author && !e[o(1112)].bot) {
      if (!client.snipes[o(821)](e[o(835)].id)) {
        if (P[o(520)]("bOwQY", o(1477))) {
          client.snipes.set(e[o(835)].id, new Collection());
        } else {
          for (n of G.from(j[o(674)]()).slice(0, H[o(494)] - 100)) {
            n[o(1228)](n);
          }
        }
      }
      var t = client.snipes.get(e[o(835)].id);
      t.set(e[o(1473) + "l"].id, {
        content: e.content,
        author: e.author?.tag || o(829) + o(629),
        member: e[o(612)],
        timestamp: new Date()
      });
      if (t.size >= MAX_SNIPES) {
        e = t.firstKey();
        t[o(1228)](e);
      }
    }
  }
  function O(n) {
    let s = q;
    let c = {
      lHolz: function (e, n) {
        return e !== n;
      },
      hUMwb: P[s(1504)],
      Bymrx: function (e, n) {
        return P.sKWPu(e, n);
      },
      wAMyK: "OBDYx"
    };
    return async o => {
      let t = s;
      if (c[t(1193)](t(901), c.hUMwb)) {
        N[t(1241)]("Cleane" + t(944) + S + (t(1376) + t(682) + t(1271)) + " entries");
      } else {
        var e = n[t(1355) + "ons"][t(1280)](e => e[t(1489)] === o.customId);
        if (e) {
          var r;
          var i = findRoleForGuild(e.RoleID, o.guild);
          if (i) {
            let n = o[t(835)].members.cache.get(o.user.id);
            try {
              if (!o[t(587) + "d"] && !o[t(420) + "ed"]) {
                await o[t(669) + "eply"]({
                  flags: MessageFlags[t(545) + "ral"]
                });
              }
              if (n.roles[t(1236)][t(821)](i.id)) {
                if (c[t(806)](c.wAMyK, t(696))) {
                  let n = j().tz(H.Timezone);
                  let o = K.Economy[t(537) + "stInte" + t(860)][t(434)](e => n.tz(e, t(1157), o[t(596) + "ne"]));
                  o[t(1294)]((e, n) => e.diff(n));
                  for (var a of o) {
                    if (n[t(1145) + "re"](a)) {
                      return a;
                    }
                  }
                  return o[0][t(1389)](1, "day");
                }
                await n.roles.remove(i);
                await o.editReply({
                  content: t(1147) + "d the " + e.Name + t(1485) + "from you."
                });
              } else {
                if (e[t(1147) + t(444)] && Array.isArray(e[t(1147) + "Roles"]) && e[t(1147) + "Roles"][t(1491)] > 0 && (r = e.RemoveRoles.filter(e => n[t(1203)][t(1236)][t(821)](e) && o[t(835)][t(1203)].cache[t(821)](e))).length > 0) {
                  await n.roles.remove(r);
                }
                await n[t(1203)][t(1389)](i);
                await o[t(1283) + t(616)]({
                  content: t(667) + t(778) + e[t(1074)] + (" role " + t(627)) + "."
                });
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    };
  }
  async function V(i) {
    let a = q;
    let s = {
      RdLCV: function (e, n) {
        var o = b;
        return P[o(1097)](e, n);
      },
      ccJTy: function (e, n) {
        return e === n;
      },
      rsDNs: P.rwIqP,
      EoImF: function (e, n) {
        return P.EhVje(e, n);
      },
      cxzqC: a(428),
      gLyIS: P.ONLrs
    };
    if (P.WJkVU("ivixE", a(1391))) {
      if (i["isComm" + a(825)]()) {
        if (P.EhVje(a(1425), P[a(506)])) {
          var n = client.slashCommands[a(483)](i[a(473) + a(438)]);
          if (n) {
            try {
              await n[a(808) + "e"](i, client);
            } catch (e) {
              console.error(a(1544) + a(1185) + "ed to execute comm" + a(1032) + (n.id || n.name) + ":", e);
              try {
                if (i[a(587) + "d"] || i[a(420) + "ed"]) {
                  if (i[a(420) + "ed"]) {
                    await i.editReply({
                      content: a(649) + a(466) + " error while execu" + a(1206) + a(1231) + a(1050)
                    });
                  }
                } else {
                  await i[a(938)]({
                    content: a(649) + a(466) + " error" + a(1225) + a(1266) + "ting t" + a(1231) + a(1050),
                    flags: MessageFlags.Ephemeral
                  });
                }
              } catch (e) {
                if (a(414) !== P[a(786)]) {
                  t = G[a(483)](j.emoji)?.count || 0;
                  H.votes = K.max(P[a(919)](t, 1), 0);
                } else if (e.code === 10062) {
                  console[a(593)](a(1544) + "] Inte" + a(1250) + "n expi" + a(1536) + a(1187) + "and " + (n.id || n.name));
                } else {
                  console[a(593)](a(1544) + a(1185) + "ed to send error m" + a(872) + ":", e);
                }
              }
            }
          }
        } else {
          N[a(1228)](S);
        }
      } else if (i[a(1490) + "complete"]()) {
        if (a(1264) !== "QCZVf") {
          j = H.panelName;
          K = O[a(1355) + "onRoles"][V];
        } else {
          try {
            var o = client.slashCommands.get(i.commandName);
            if (o && o["autoco" + a(613)]) {
              try {
                await o[a(1548) + a(613)](i, client);
              } catch (e) {
                console[a(593)](a(1544) + "] Fail" + a(753) + "execut" + a(832) + a(910) + a(797) + a(1052) + a(1240) + (o.id || o[a(652)]) + ":", e);
                try {
                  await i[a(591) + "d"]([]).catch(() => {});
                } catch (e) {}
              }
            } else {
              await i[a(591) + "d"]([]).catch(() => {});
            }
          } catch (e) {
            console.error(P[a(1042)], e);
            try {
              if (P[a(636)]("rHyaO", "rHyaO")) {
                let n = {
                  LQcXB: function (e, n) {
                    return s.RdLCV(e, n);
                  }
                };
                if (G[a(1018)] === j[a(538) + a(1547)]) {
                  O[a(612) + "s"][a(491) + "h"](e => {
                    if (!e[a(439)].bot) {
                      n.LQcXB(Y, e);
                    }
                  });
                }
              } else {
                await i.respond([])[a(967)](() => {});
              }
            } catch (e) {}
          }
        }
      } else if (i.isButton()) {
        let r = i.user.id + "-" + i.customId;
        var t;
        if (P[a(1345)](interactionDebounce[a(494)], MAX_DEBOUNCE_ENTRIES)) {
          t = Array.from(interactionDebounce.keys())[0];
          clearTimeout(interactionDebounce[a(483)](t));
          interactionDebounce[a(1228)](t);
        }
        if (interactionDebounce[a(821)](r)) {
          clearTimeout(interactionDebounce[a(483)](r));
        }
        interactionDebounce[a(1177)](r, P.dHBHN(setTimeout, async () => {
          var e = a;
          try {
            if (!i[e(587) + "d"] && !i[e(420) + "ed"]) {
              if (i[e(558) + "Id"][e(858) + e(1450)](e(496) + "on_role_")) {
                await d(i);
              } else {
                for (var [n, o] of Object.entries(N)) {
                  if (s.ccJTy("MucYG", s.rsDNs)) {
                    N.push(S);
                  } else {
                    await o(i);
                  }
                }
                var t = await Transaction[e(1423) + "e"]({
                  interactionId: i.message[e(557) + "ction"].id
                });
                if (s[e(1344)](i.customId, "get_wallet_a" + e(1531))) {
                  if (t) {
                    if (s[e(726)] === "GiGXA") {
                      await i[e(938)]({
                        content: e(861) + " Addre" + e(1285) + t.address + "`",
                        flags: MessageFlags[e(545) + "ral"]
                      });
                    } else {
                      N[e(415) + "L"] = S[e(1239)].Footer.Icon;
                    }
                  } else {
                    await i[e(938)]({
                      content: "Wallet" + e(1368) + e(620) + " found.",
                      flags: MessageFlags.Ephemeral
                    });
                  }
                } else if (i.customId === e(1451) + e(841)) {
                  if (t) {
                    await i[e(938)]({
                      content: t["qrCode" + e(1211)],
                      flags: MessageFlags.Ephemeral
                    });
                  } else {
                    await i.reply({
                      content: s.gLyIS,
                      flags: MessageFlags["Epheme" + e(576)]
                    });
                  }
                }
              }
            }
          } catch (e) {} finally {
            interactionDebounce.delete(r);
          }
        }, 100));
      } else if (i[a(902) + a(1359) + a(510)]()) {
        if (P[a(441)](P.fQCPx, "ZauZG")) {
          G += j[a(440)] + " " + H.name + " (" + K[a(842)] + a(994) + ")\n";
        } else if (i[a(558) + "Id"].startsWith("reacti" + a(785) + "e_")) {
          await Y(i);
        }
      }
    } else {
      j[a(995) + "ommands"][a(1208)](H.toJSON());
      K.slashCommands.set(O, V);
    }
  }
  async function d(o) {
    let t = q;
    let [,, e, n] = o[t(558) + "Id"].split("_");
    let r = config[t(1355) + "onRoles"][e];
    if (r) {
      var i;
      var a = r[t(1355) + t(1033)][parseInt(n)];
      if (a) {
        let n = o[t(612)];
        let e = P[t(1317)](findRoleForGuild, a[t(1455)], o.guild);
        if (!e) {
          if (!P.lIXWW(P.HLCPI, "iuObB")) {
            return;
          }
          N[t(1208)](S);
        }
        try {
          if (n[t(1203)][t(1236)][t(821)](e.id)) {
            await n[t(1203)].remove(e);
            await o[t(938)]({
              content: t(1147) + "d the " + a.Name + t(1485) + "from you.",
              flags: MessageFlags["Epheme" + t(576)]
            });
          } else {
            if (a[t(1147) + "Roles"] && Array.isArray(a[t(1147) + "Roles"]) && a[t(1147) + "Roles"][t(1491)] > 0 && (i = a[t(1147) + t(444)].filter(e => n[t(1203)][t(1236)].has(e) && o.guild[t(1203)][t(1236)][t(821)](e))).length > 0) {
              await n[t(1203)][t(1085)](i);
            }
            await n[t(1203)][t(1389)](e);
            await o.reply({
              content: "Added " + t(778) + a.Name + " role to you.",
              flags: MessageFlags[t(545) + "ral"]
            });
          }
        } catch (e) {
          console.error(e);
          await o.reply({
            content: "There was an error" + t(1225) + t(1385) + t(720) + "ur roles.",
            flags: MessageFlags["Epheme" + t(576)]
          });
        }
      }
    }
  }
  async function Y(t) {
    let r = q;
    let i = {
      mAdjf: function (e, n, o) {
        var t = b;
        return P[t(1287)](e, n, o);
      }
    };
    let a = t.customId.split("_")[2];
    let s = config.ReactionRoles[a];
    if (s) {
      let n = t[r(612)];
      let e = t[r(1329)];
      let o = s["Reacti" + r(1033)].map((e, n) => {
        var o = r;
        return {
          role: i.mAdjf(findRoleForGuild, e[o(1455)], t[o(835)]),
          value: a + "_" + n
        };
      })[r(1328)](e => e[r(859)]);
      try {
        for (var {
          role: c,
          value: l
        } of o) {
          if (e.includes(l)) {
            var u;
            var d;
            var f;
            if (!n.roles.cache[r(821)](c.id)) {
              u = P.eCFcH(parseInt, l.split("_")[1]);
              if ((d = s.Reactions[u]) && d[r(1147) + r(444)] && Array[r(1405) + "y"](d.RemoveRoles) && d.RemoveRoles.length > 0 && (f = d[r(1147) + "Roles"][r(1328)](e => n[r(1203)].cache.has(e) && t.guild.roles.cache.has(e))).length > 0) {
                await n[r(1203)].remove(f);
              }
              await n[r(1203)][r(1389)](c);
            }
          } else if (n.roles.cache.has(c.id)) {
            await n.roles.remove(c);
          }
        }
        await t.reply({
          content: lang.Reactions[r(1120) + r(1164)],
          flags: MessageFlags[r(545) + r(576)]
        });
      } catch (e) {
        console.error(P.RGpgf, e);
        await t[r(938)]({
          content: r(649) + "was an" + r(670) + r(1225) + r(1385) + r(720) + r(1464) + r(1543),
          flags: MessageFlags[r(545) + r(576)]
        });
      }
    }
  }
  Object[q(674)](config[q(1355) + q(937) + "s"])[q(491) + "h"](e => {
    var n = q;
    var o = config[n(1355) + "onRoles"][e];
    if (o["useBut" + n(1019)]) {
      if (P[n(567)] !== "FchyC") {
        S(e, O(o));
      } else {
        R[n(509)](1);
      }
    }
  });
  const U = new Set();
  const k = new Map();
  const W = 1000;
  const w = 500;
  async function h(r, i) {
    let a = q;
    if (!i.bot) {
      try {
        if (r[a(1292) + "l"]) {
          await r[a(680)]();
        }
      } catch (e) {
        console[a(593)]("Error " + a(1202) + "ng par" + a(686) + a(847) + "n:", e);
        return;
      }
      var s = "" + i.id;
      var c = k[a(483)](s);
      var l = Date.now();
      if (c && l - c < W) {
        if (a(986) !== a(1023)) {
          await r.users.remove(i)[a(967)](console.error);
          return;
        }
        R["musicM" + a(780)][a(683) + "pEvent" + a(874) + a(1136)]();
      }
      let o;
      let t;
      try {
        var u = await ReactionRole[a(1423) + "e"]({
          messageID: r.message.id
        });
        if (u) {
          if (!P[a(1247)]("OmOfF", "VjoSl")) {
            let r = [];
            let i = O[a(468) + a(1102)](V);
            i[a(491) + "h"](e => {
              var n = a;
              var o = r.join(i, e);
              var t = Z[n(1468) + "nc"](o);
              if (t && t["isDire" + n(964)]()) {
                r = r[n(462)](J(o, Q));
              } else if (e[n(742) + "th"](C)) {
                r.push(o);
              }
            });
            return r;
          }
          o = u["panelN" + a(954)];
          t = config[a(1355) + "onRoles"][o];
        }
      } catch (e) {
        if (a(1131) !== a(814)) {
          console[a(593)]("Error " + a(1439) + a(1499) + "l in DB:", e);
          return;
        }
        G.push({
          channel: j,
          newName: H,
          currentName: K[a(652)]
        });
      }
      if (t && !t.useButtons) {
        let n = r.emoji.id ? "<" + (r[a(440)][a(698) + "ed"] ? "a" : "") + ":" + r.emoji[a(652)] + ":" + r.emoji.id + ">" : r[a(440)].name;
        let e = t["Reacti" + a(1033)][a(1280)](e => e.Emoji === n);
        if (e) {
          k[a(1177)](s, l);
          if (k[a(494)] > w) {
            if (P[a(441)]("sqdfS", a(812))) {
              if (!h.guild || !X.author || Z[a(1112)].bot) {
                return;
              }
              if (!v[a(1244)][a(821)](y.guild.id)) {
                D.snipes.set(_[a(835)].id, new $());
              }
              c = F.snipes.get(fe.guild.id);
              c.set(ge[a(1473) + "l"].id, {
                content: L.content,
                author: z[a(1112)]?.tag || "Unknow" + a(629),
                member: m.member,
                timestamp: new B()
              });
              if (c[a(494)] >= M) {
                u = c[a(549) + "ey"]();
                c.delete(u);
              }
            } else {
              Array.from(k.entries())[a(1294)]((e, n) => e[1] - n[1])[a(756)](0, P[a(1335)](k[a(494)], w)).forEach(([e]) => k[a(1228)](e));
            }
          }
          var d;
          var s = findRoleForGuild(e[a(1455)], r.message[a(835)]);
          if (s) {
            let n = r.message.guild.members[a(1236)].get(i.id);
            if (!n) {
              if (a(541) !== "WqEZy") {
                console.error("Member not found: " + i.id + a(873) + "ild: " + r[a(1278) + "e"].guild.id);
                return;
              } else {
                N[a(593)](a(1101) + a(1202) + a(1521) + "tial reaction:", S);
                return;
              }
            }
            try {
              if (n.roles[a(1236)].has(s.id)) {
                await n.roles[a(1085)](s);
              } else {
                if (e["Remove" + a(444)] && Array[a(1405) + "y"](e[a(1147) + a(444)]) && e.RemoveRoles.length > 0 && (d = e.RemoveRoles.filter(e => n.roles.cache[a(821)](e) && r.message[a(835)].roles.cache[a(821)](e))).length > 0) {
                  await n.roles[a(1085)](d);
                }
                await n.roles[a(1389)](s);
              }
              if (t[a(1261) + a(1470)]) {
                let n = r[a(1278) + "e"].id + "-" + i.id;
                U[a(1389)](n);
                try {
                  await r[a(1546)][a(1085)](i);
                } catch (e) {
                  console.error("Error removi" + a(552) + a(961), e);
                } finally {
                  P.dHBHN(setTimeout, () => {
                    var e = a;
                    U[e(1228)](n);
                  }, 2000);
                }
              }
            } catch (e) {
              console[a(593)]("Error " + a(1487) + "ng reaction role:", e);
              l = r.message.id + "-" + i.id;
              if (U.has(l)) {
                if (P.VagyV !== a(450)) {
                  U.delete(l);
                } else {
                  R = "0";
                }
              }
              if (e.code === 50013) {
                if (a(599) === P.PSoUx) {
                  S[a(593)](a(1101) + a(1338) + a(849) + a(732) + G[a(1278) + "eId"] + ":", j);
                } else {
                  try {
                    var f = a(697) + "rmission Error**\n\n" + a(1024) + a(533) + " permi" + a(1343) + "to manage the **" + s.name + (a(957) + a(518) + a(1493) + a(1081)) + " have:" + a(987) + a(461) + a(893) + a(948) + "ission\n• A role hi" + a(470) + a(447) + s.name + (a(1456) + a(700)) + "rver hierarchy";
                    if (r[a(1278) + "e"][a(1473) + "l"]["permis" + a(830) + "or"](r.message.guild[a(612) + "s"].me).has("SendMessages")) {
                      if (a(1195) === "sLfAP") {
                        await r[a(1278) + "e"].channel.send({
                          content: f,
                          allowedMentions: {
                            repliedUser: false
                          }
                        });
                      } else {
                        S.snipes[a(1177)](G.guild.id, new j());
                      }
                    } else if (P[a(441)](P[a(865)], "tdgsG")) {
                      for (var [g] of G.entries()) {
                        H(g);
                      }
                    } else {
                      await i[a(1459)](f).catch(() => {});
                    }
                  } catch (e) {}
                }
              }
            }
          } else {
            console.error("Role n" + a(1513) + "nd for panel: " + o);
          }
        } else {
          console.log("No reaction " + a(437) + a(1277) + " for e" + a(956) + n + " in pa" + a(574) + o);
        }
      }
    }
  }
  async function X(r, i) {
    let a = q;
    if (!i.bot) {
      try {
        if (r.partial) {
          await r[a(680)]();
        }
      } catch (e) {
        console.error("Error fetching partial reaction for " + a(1213) + "l:", e);
        return;
      }
      var s = r[a(1278) + "e"].id + "-" + i.id;
      if (!U.has(s)) {
        let o;
        let t;
        try {
          var c = await ReactionRole[a(1423) + "e"]({
            messageID: r[a(1278) + "e"].id
          });
          if (c) {
            o = c[a(1009) + "ame"];
            t = config[a(1355) + "onRoles"][o];
          }
        } catch (e) {
          console.error("Error finding pane" + a(685) + "B for removal:", e);
          return;
        }
        if (t && !t[a(920) + a(1019)]) {
          let n = r.emoji.id ? "<" + (r.emoji[a(698) + "ed"] ? "a" : "") + ":" + r[a(440)].name + ":" + r[a(440)].id + ">" : r.emoji[a(652)];
          let e = t.Reactions[a(1280)](e => e[a(1489)] === n);
          if (e) {
            s = findRoleForGuild(e[a(1455)], r.message[a(835)]);
            if (s) {
              c = r[a(1278) + "e"][a(835)][a(612) + "s"][a(1236)].get(i.id);
              if (c) {
                try {
                  if (c[a(1203)].cache[a(821)](s.id)) {
                    await c[a(1203)].remove(s);
                  }
                } catch (e) {
                  console.error(a(1101) + "handli" + a(552) + a(1210) + "role r" + a(515) + ":", e);
                }
              } else {
                console[a(593)]("Member not f" + a(642) + a(1309) + "e removal: " + i.id + a(873) + "ild: " + r[a(1278) + "e"][a(835)].id);
              }
            } else {
              console.error(a(1553) + "ot fou" + a(534) + a(1109) + a(824) + a(663) + " " + o);
            }
          }
        }
      }
    }
  }
  function Z(e, n) {
    var o = q;
    if (e?.[o(835)] && e?.author && !e?.[o(1112)]?.[o(717)] && e.content !== n.content) {
      if (!client[o(1244)].has(e[o(835)].id)) {
        client[o(1244)][o(1177)](e[o(835)].id, new Collection());
      }
      client[o(1244)].get(e.guild.id).set(e[o(1473) + "l"].id, {
        oldContent: e[o(1514) + "t"],
        newContent: n.content,
        author: e.author[o(982)],
        member: e[o(612)],
        timestamp: new Date(),
        edited: true
      });
    }
  }
  function v(t) {
    let r = q;
    let i = config[r(637) + "ck"];
    if (i.Enabled && !t[r(439)][r(717)]) {
      let o = i.Role;
      let e = Ae(i[r(1094)]);
      setTimeout(async () => {
        let n = r;
        try {
          var e;
          if (!!(t = await t.guild.members.fetch(t.id)) && !o.some(e => t.roles[n(1236)].has(e))) {
            if (i.DM.Enabled) {
              e = new EmbedBuilder().setTitle(i.DM.Embed[n(1415)]).setDescription(i.DM[n(1239)][n(879) + n(666)].join("\n")).setColor(i.DM[n(1239)].Color)[n(1272) + "ter"]({
                text: i.DM.Embed[n(565)]
              });
              await t.send({
                embeds: [e]
              }).catch(e => {
                e[n(1054)];
              });
            }
            await t[n(1297)](n(1162) + n(1217) + "ailed " + n(1327) + n(794) + "he required role i" + n(1045) + ".");
          }
        } catch (e) {
          console.error(n(1466) + n(826) + n(745) + n(423) + "ick for " + t[n(1000) + n(1384)] + ": " + e);
        }
      }, e);
    }
  }
  async function y(e) {
    let o = q;
    e[o(925)][o(1236)][o(491) + "h"](e => {
      let n = o;
      e.channels.cache[n(491) + "h"](e => {
        let o = n;
        if (e.type === ChannelType["GuildV" + o(1547)]) {
          e.members[o(491) + "h"](e => {
            var n = o;
            if (!e.user[n(717)]) {
              handleVoiceXP(e);
            }
          });
        }
      });
    });
  }
  async function C() {
    var n = q;
    if (P.oJtoP !== "zJdjw") {
      try {
        await J();
        P.JOBZI(Q);
        await ge();
        P.IXiYw(L);
      } catch (e) {
        console[n(593)](n(1101) + n(727) + " bot initialization:", e);
      }
    } else {
      j(H);
      K[n(1228)](O);
      V++;
    }
  }
  async function J() {
    let a = q;
    let s = {
      ECHvL: P[a(675)],
      noJhw: P[a(827)],
      buqzi: function (e, n) {
        return P.skYvf(e, n);
      },
      jzDct: function (e, n) {
        var o = a;
        return P[o(1275)](e, n);
      }
    };
    await P[a(952)](B);
    if (config["Reacti" + a(937) + "s"].Enabled) {
      await P.dMnOA(we);
    }
    await P.skYvf(pe, client);
    var e = P.cvPUy(require, a(855) + "s/core" + a(1453) + "Loader");
    global["addonL" + a(748)] = new e();
    global.addonLoader["setCon" + a(500)](client, config, lang);
    var e = require("./util" + a(656) + "omy/storeAPI");
    global[a(1173) + "PI"] = new e();
    global.storeAPI["setCon" + a(500)](client, config, lang);
    P.jpMbJ(setupDiscordEventBridge, client, global[a(690) + a(748)][a(543) + a(465) + a(723)]());
    await global["addonL" + a(748)][a(619) + a(606) + a(643) + "ctory"](a(582) + "ns");
    re(P[a(1268)]).forEach(e => {
      var n;
      var o;
      var t = a;
      var r = path.resolve(e);
      var i = e[t(419)](/\/addons\/([^/]+)/) ? e[t(419)](/\/addons\/([^/]+)/)[1] : s.ECHvL;
      try {
        if (e.includes(s[t(1220)])) {
          if ((n = s.buqzi(require, r)) && n[t(1073)] && n.data.toJSON && typeof n.data.toJSON == t(579) + "on") {
            global[t(995) + "ommands"][t(1208)](n[t(1073)][t(412)]());
            client["slashC" + t(672) + "s"].set(n[t(1073)][t(652)], n);
          }
        } else if (e.includes("app_") && (o = require(r)) && s[t(551)](o.data, ContextMenuCommandBuilder)) {
          if (t(429) !== "kqZJt") {
            R();
          } else {
            global[t(995) + "ommands"].push(o.data.toJSON());
            client.slashCommands[t(1177)](o.data[t(652)], o);
          }
        }
      } catch (e) {
        console[t(593)]("[ERROR] " + i + ": " + e[t(1278) + "e"]);
        console[t(593)](e.stack);
      }
    });
  }
  function Q() {
    let i = q;
    let a = {
      sCYvf: function (e, n) {
        return e === n;
      },
      ZsqYB: function (e, n) {
        return P.NjGAr(e, n);
      }
    };
    let s = [{
      condition: true,
      fn: Ce,
      name: "Tempban"
    }, {
      condition: commandConfig.giveaway,
      fn: startGiveawayScheduler,
      name: "Giveaway"
    }, {
      condition: commandConfig.reminder,
      fn: () => startReminderScheduler(client),
      name: i(1031) + "er"
    }, {
      condition: config[i(430) + i(1371) + "gs"][i(477) + "d"],
      fn: () => registerTimer(i(430) + i(575) + "ler", setInterval(() => Le(client), 300000)),
      name: i(430)
    }, {
      condition: commandConfig[i(525) + "y"],
      fn: Ie,
      name: "Interest"
    }, {
      condition: config[i(1108)]?.Enabled,
      fn: () => startAlertScheduler(client),
      name: i(1108)
    }, {
      condition: true,
      fn: () => {
        let e = i;
        let t = {
          qTInS: e(566) + e(566) + e(566) + e(566) + "━━━━━━" + e(566) + e(566) + e(566) + e(566) + e(566) + "━━━━━━━━━━━━",
          Xtoej: e(566) + e(566) + "━━━━━━" + e(566) + "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" + e(566) + e(566) + e(566) + "\n",
          BspIr: P[e(540)],
          JsMEy: e(624) + e(1478) + e(1357) + e(942) + " invite link" + e(484)
        };
        P.XCfll(oe, client);
        let r = P[e(1317)](registerTimer, P.bmQfR, P[e(1317)](setInterval, () => {
          var n = e;
          if (a.sCYvf(n(584), "tNLcJ")) {
            a.ZsqYB(oe, client);
          } else {
            var o = (n(1060) + n(425) + n(729) + "13|8|14|3|1|" + n(1551) + "9")[n(1386)]("|");
            let e = 0;
            while (true) {
              switch (o[e++]) {
                case "0":
                  c.log(aj[n(1063)]("│  📚 S" + n(1374) + "uide:"));
                  continue;
                case "1":
                  if (Ae[n(439)]) {
                    o.log(e.red(n(592) + "orrect invit" + n(504) + ":"));
                    as.log(at.red(n(624) + n(978) + "//discord.com/api/oauth2" + n(1515) + n(684) + n(1016) + n(871) + au[n(439)].id + (n(1235) + n(1044)) + "=8&scope=bot" + n(1057) + n(1380) + n(445) + n(1049)));
                    av.log(aw.red("│"));
                  }
                  continue;
                case "2":
                  ak.log(a.red(n(624) + n(422) + "s://do" + n(511) + n(705) + n(1412) + n(489)));
                  continue;
                case "3":
                  ue.log(de[n(1063)]("│"));
                  continue;
                case "4":
                  oe[n(1241)]("\n" + te.bold[n(1063)](t.qTInS));
                  continue;
                case "5":
                  we[n(1241)](he[n(1262)][n(1063)]("━━━━━━━━━━━━" + n(566) + "━━━━━━━━━━━━" + n(566) + "━━━━━━━━━━━━" + n(566) + "━━━━━━" + n(566) + n(566)));
                  continue;
                case "6":
                  ae[n(1241)](Be.red("│  🔧 H" + n(1200) + "fix this:"));
                  continue;
                case "7":
                  s[n(1241)](t.red("│"));
                  continue;
                case "8":
                  pe.log(se[n(1063)]("│     " + n(819) + "authorize th" + n(548) + "with proper " + n(926)));
                  continue;
                case "9":
                  r[n(1241)](ap[n(1262)].red(t.Xtoej));
                  continue;
                case "10":
                  Le[n(1241)](ze.red("│  ❌ Error: Bot wa" + n(1150) + "ted wi" + n(962) + "\"appli" + n(928) + "s.commands\" " + n(904)));
                  continue;
                case "11":
                  re[n(1241)](me.bold.red(t.BspIr));
                  continue;
                case "12":
                  ye.log(Ce.red("│"));
                  continue;
                case "13":
                  Me.log(De.red(t[n(1291)]));
                  continue;
                case "14":
                  ce.log(le.red("│     " + n(809) + n(1065) + n(677) + n(1461) + "and \"applica" + n(1480) + "comman" + n(788) + n(1252) + "cted"));
                  continue;
                case "15":
                  be[n(1241)](ie[n(1063)]("│"));
                  continue;
              }
              break;
            }
          }
        }, 60000));
        global["channelStats" + e(1410) + "al"] = r;
      },
      name: "Channe" + i(1149)
    }, {
      condition: config[i(885)]?.Enabled,
      fn: () => {
        var e = i;
        async function n() {
          var e;
          var n = b;
          for (e of client[n(925)].cache[n(1329)]()) {
            await createAutoBackup(e, client);
          }
        }
        P[e(850)](n);
        var o = ee(config.Backup[e(575) + "le"]);
        ve(e(1184) + e(1360), n, o);
      },
      name: i(1184) + "ckup"
    }, {
      condition: config[i(905) + i(1017)]?.Enabled,
      fn: () => {
        var e = P.OqSIg(1440, 60) * 1000;
        registerTimer("DataPurge", setInterval(async () => {
          await DataPurgeService.runFullPurge();
        }, e));
      },
      name: P.Ezivl
    }];
    s.forEach(({
      condition: e,
      fn: n,
      name: o
    }) => {
      var t = i;
      if (e) {
        try {
          n();
        } catch (e) {
          console[t(593)](colors.red("🆘") + (t(787) + t(1180) + "ing ") + o + " scheduler:", e);
        }
      }
    });
    ze().then(() => ie());
    registerTimer("Expire" + i(454) + "ngs", setInterval(he, 600000));
    registerTimer("InteractionD" + i(734) + "e", setInterval(o, DEBOUNCE_CLEANUP_INTERVAL));
    P.ZCqdy(registerTimer, "BotReactions", setInterval(t, REACTION_CLEANUP_INTERVAL));
  }
  let {
    observeAsync: F,
    record: fe
  } = require("./util" + q(1125) + q(1141) + q(898));
  async function ge() {
    let o = q;
    let t = {
      hrgus: "PNmAS"
    };
    let n = new REST({
      version: "10"
    }).setToken(config.BotToken);
    try {
      (await P.ZCqdy(F, P[o(695)], async () => {
        var e = o;
        if (P[e(741)] === "zxjiq") {
          return undefined;
        } else {
          return n[e(1418)](Routes[e(1134) + e(963) + e(672) + "s"](client.user.id), {
            body: global[e(995) + e(672) + "s"]
          });
        }
      })).forEach(e => {
        var n = o;
        if (t[n(601)] !== t.hrgus) {
          S.log(n(1460) + "ction config found" + n(750) + n(956) + G + (n(999) + n(574)) + j);
        } else if (n = client[n(995) + n(672) + "s"][n(483)](e[n(652)])) {
          n.id = e.id;
        }
      });
      client[o(473) + o(773) + "y"] = true;
    } catch (e) {
      z(e);
    }
  }
  function L() {
    var e = q;
    var n = process.version;
    var o = packageJson.version;
    moment()[e(1324)](e(1248) + e(712) + "-YYYY)");
    e(1180);
    e(1452);
    e(1070);
    e(1059);
  }
  function z(e) {
    let n = q;
    let o = {
      dcxWi: "│     " + n(1289) + "ble th" + n(1441) + n(1443) + "rivile" + n(478) + n(1035) + "intents",
      dtpqt: P.ROgRF
    };
    if (n(635) !== n(635)) {
      M.log("\n" + D[n(1262)][n(1063)]("━━━━━━" + n(566) + n(566) + "━━━━━━━━━━━━━━━━━━━━━━━━" + n(566) + n(566) + n(566) + "━━━━━━" + n(566)));
      _[n(1241)]($.bold[n(1063)](n(621) + n(988) + n(1192) + n(475) + n(1107) + n(1041) + "PERMISSIONS"));
      ee.log(ve[n(1262)].red("━━━━━━" + n(566) + n(566) + n(566) + n(566) + n(566) + "━━━━━━" + n(566) + n(566) + "━━━━━━" + n(566) + n(566)));
      ne.log(oe[n(1063)]("│"));
      te[n(1241)](re.red(n(1014) + n(485) + n(1198) + n(1113) + "using " + n(417) + n(1080) + "ntents"));
      me.log(we[n(1063)]("│"));
      he[n(1241)](ye.red("│  🔧 H" + n(1200) + n(770) + "is:"));
      Ce[n(1241)](Le[n(1063)](n(624) + "1. Go to htt" + n(1245) + "iscord.com/develop" + n(1433) + n(1179) + n(467)));
      ze[n(1241)](be.red("│     " + n(1554) + "ect your bot" + n(1079) + "cation"));
      ie[n(1241)](ae[n(1063)]("│     3. Navigate to the" + n(486) + " section"));
      Be[n(1241)](Me[n(1063)](o[n(820)]));
      De.log(pe.red("│"));
      se.log(ce.red(o.dtpqt));
      le[n(1241)](ue[n(1063)]("│"));
      de.log(Ae.bold[n(1063)](n(566) + n(566) + n(566) + n(566) + "━━━━━━━━━━━━━━━━━━" + n(566) + "━━━━━━" + n(566) + "━━━━━━" + n(566) + "\n"));
      xe.exit();
    } else if (e.code === 50001 || e.message.includes(n(626) + "g Access")) {
      console.log("\n" + colors[n(1262)][n(1063)]("━━━━━━━━━━━━━━━━━━━━━━━━" + n(566) + "━━━━━━" + n(566) + n(566) + n(566) + "━━━━━━" + n(566) + n(566)));
      console.log(colors.bold.red("⚡ SLASH COMM" + n(1040) + "AILED " + n(1476) + n(1010) + "RMISSIONS"));
      console[n(1241)](colors[n(1262)].red(P.lNCsW));
      console[n(1241)](colors.red("│"));
      console[n(1241)](colors[n(1063)](n(1014) + n(485) + n(1400) + n(1286) + n(638) + n(765) + " regis" + n(715) + n(615) + n(1049)));
      console[n(1241)](colors[n(1063)]("│"));
      console.log(colors[n(1063)](n(482) + "equired fixes:"));
      console.log(colors[n(1063)](n(624) + "1. ✅ B" + n(648) + n(1358) + n(1526) + n(1427) + n(1039) + "ver"));
      console.log(colors[n(1063)](n(624) + n(1068) + n(1174) + "st have ADMI" + n(955) + n(1030) + "rmissi" + n(1033)));
      console.log(colors[n(1063)](n(624) + n(689) + n(1320) + "e must" + n(1130) + "e HIGHEST ro" + n(1122) + n(700) + "rver"));
      console.log(colors[n(1063)](P.hpzBc));
      console[n(1241)](colors.red("│"));
      console[n(1241)](colors[n(1063)]("│  📋 S" + n(1409) + n(789) + "solution:"));
      console.log(colors[n(1063)](P.vLFXL));
      console[n(1241)](colors[n(1063)](P.urSvb));
      console[n(1241)](colors.red(n(624) + n(1398) + n(578) + "ole to the T" + n(605) + "the ro" + n(1146) + "t"));
      console.log(colors[n(1063)](P.ZKYlc));
      console.log(colors[n(1063)](P[n(1432)]));
      console[n(1241)](colors[n(1063)]("│"));
      console.log(colors[n(1063)]("│  📚 D" + n(1411) + "d Setup Guide:"));
      console[n(1241)](colors.red("│     " + n(422) + n(1434) + n(511) + n(705) + "lopment.net/"));
      console[n(1241)](colors.red("│"));
      if (client[n(439)]) {
        console[n(1241)](colors[n(1063)]("│  🔄 R" + n(560) + n(1363) + n(1061) + n(528) + n(1458) + "issions:"));
        console.log(colors[n(1063)]("│     " + n(978) + "//disc" + n(915) + n(973) + "oauth2/authorize?client_" + n(871) + client[n(439)].id + (n(1235) + n(1044) + n(1029) + n(1517) + n(1057)) + "lications.commands"));
        console.log(colors.red("│"));
      }
      console.log(colors.bold.red(P.OOucN));
    } else if (e.message.includes(P[n(1218)])) {
      console[n(1241)]("\n" + colors[n(1262)][n(1063)](n(566) + n(566) + "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" + n(566) + n(566) + "━━━━━━" + n(566)));
      console.log(colors[n(1262)][n(1063)]("🔗 SLASH COMM" + n(1040) + "AILED - MISSING SC" + n(694)));
      console.log(colors.bold.red("━━━━━━" + n(566) + n(566) + n(566) + n(566) + n(566) + "━━━━━━" + n(566) + n(566) + n(566) + "━━━━━━━━━━━━"));
      console.log(colors[n(1063)]("│"));
      console[n(1241)](colors.red(n(1014) + "rror: Bot was invi" + n(1301) + n(962) + n(1143) + n(928) + "s.comm" + n(1435) + "scope"));
      console[n(1241)](colors[n(1063)]("│"));
      console[n(1241)](colors.red(n(908) + "ow to fix th" + n(749)));
      console.log(colors.red(P[n(1321)]));
      console[n(1241)](colors[n(1063)](n(624) + n(819) + "author" + n(481) + "e bot with p" + n(958) + n(926)));
      console[n(1241)](colors.red(P[n(710)]));
      console.log(colors[n(1063)]("│"));
      if (client.user) {
        console[n(1241)](colors.red("│  🔄 Correct invite link:"));
        console.log(colors.red("│     https:" + n(1508) + n(915) + n(973) + "oauth2" + n(1515) + "rize?client_" + n(871) + client[n(439)].id + "&permissions=8&sco" + n(1517) + "%20applicati" + n(445) + n(1049)));
        console.log(colors.red("│"));
      }
      console[n(1241)](colors.red(P.JfDmv));
      console[n(1241)](colors[n(1063)](n(624) + "🔗 http" + n(1434) + "cs.drakodevelopment.net/"));
      console[n(1241)](colors[n(1063)]("│"));
      console[n(1241)](colors.bold[n(1063)](n(566) + n(566) + n(566) + n(566) + n(566) + "━━━━━━" + n(566) + n(566) + "━━━━━━" + n(566) + n(566) + n(566) + "\n"));
    } else {
      console[n(1241)]("\n" + colors.bold.red("━━━━━━" + n(566) + "━━━━━━━━━━━━━━━━━━" + n(566) + n(566) + n(566) + "━━━━━━━━━━━━" + n(566) + n(566)));
      console.log(colors.bold.red(n(783) + "H COMMANDS FAILED " + n(1165) + "OWN ER" + n(1067)));
      console.log(colors.bold.red(n(566) + "━━━━━━" + n(566) + "━━━━━━" + n(566) + "━━━━━━" + n(566) + n(566) + n(566) + "━━━━━━━━━━━━━━━━━━"));
      console.log(colors[n(1063)]("│"));
      console.log(colors[n(1063)](P.lzkev));
      console[n(1241)](colors.red("│"));
      console.log(colors.red(n(828) + "et help:"));
      console.log(colors[n(1063)](P.yYIJn));
      console[n(1241)](colors.red("│     " + n(625) + "k setup guide: docs.drakodevel" + n(1230) + ".net"));
      console.log(colors[n(1063)](P.eoqQb));
      console.log(colors.red("│"));
      console[n(1241)](colors.red(n(1404) + n(1233) + n(431) + ":"));
      console.log(colors.red("│     " + (e.message || P[n(1314)])));
      if (e[n(1054)]) {
        console[n(1241)](colors[n(1063)]("│     Error Code: " + e[n(1054)]));
      }
      console.log(colors.red("│"));
      console.log(colors.bold[n(1063)](P.OOucN));
    }
  }
  let m = false;
  async function B() {
    var n = q;
    if (!m) {
      m = true;
      try {
        for (var o of client[n(925)][n(1236)].values()) {
          try {
            let e = await GuildData.findOne({
              guildID: o.id
            });
            e = e || new GuildData({
              guildID: o.id,
              members: []
            });
            var t = new Set(e.members);
            if (!P.WJkVU(t[n(494)], 0)) {
              var r = o[n(612) + n(1393)];
              if (!(Math[n(799)](r - t[n(494)]) < 10)) {
                var i;
                var a = Math.min(50, t[n(494)]);
                var s = Array.from(t).slice(0, a);
                var c = new Set();
                for (i of s) {
                  try {
                    if (await o[n(612) + "s"][n(680)](i)) {
                      c.add(i);
                    }
                  } catch (e) {
                    if (P.QXMLx("HcUTA", "HcUTA")) {
                      if (P[n(1133)](e.code, 10007)) {
                        if (n(517) === P[n(997)]) {
                          await P.tapLe(M, o, i);
                        } else {
                          S.error(n(1544) + "] Inte" + n(1250) + n(782) + "red fo" + n(1187) + n(1032) + (G.id || j[n(652)]));
                        }
                      }
                    } else {
                      S(G[n(483)](j));
                    }
                  }
                  await new Promise(e => setTimeout(e, 200));
                }
                if (c.size < a * 0.8) {
                  e.members = Array.from(c);
                  await e.save();
                }
              }
            }
          } catch (e) {
            console[n(593)]("Error " + n(1323) + n(884) + "bers f" + n(681) + n(792) + o.id + ":", e.message);
          }
        }
      } catch (e) {
        console.error(n(1101) + "in opt" + n(563) + n(1015) + n(1012) + "k:", e[n(1278) + "e"]);
      } finally {
        m = false;
      }
    }
  }
  async function M(e, n) {
    var o = q;
    var t = {
      fYxFG: "Error in upd" + o(1462) + "nnelStats:"
    };
    if (P[o(989)] !== "ARWvy") {
      if (e = await e.members[o(680)](n).catch(() => null)) {
        if (P.ZxNQE === "yhDTq") {
          N.error(t.fYxFG, S.message);
        } else {
          await sendLeaveMessage(e);
          await updateInviteUsage(e);
        }
      }
    } else {
      G = j[o(1378)](H, K.Economy[o(1310) + "erestEarning"]);
    }
  }
  async function D(e, n) {
    var o = q;
    e[o(612) + "s"] = [...n];
    await e[o(980)]();
  }
  function _(e) {}
  function $(e) {}
  function ee(o) {
    var t = q;
    if (t(1377) !== P[t(490)]) {
      var r = /(\d+)([smhd])/g;
      let e;
      let n = 0;
      while ((e = r[t(459)](o)) !== null) {
        var i = parseInt(e[1], 10);
        switch (e[2]) {
          case "s":
            n += P[t(1001)](i, 1000);
            break;
          case "m":
            n += i * 60 * 1000;
            break;
          case "h":
            n += P[t(760)](i * 60, 60) * 1000;
            break;
          case "d":
            n += P[t(760)](P.WFlWK(i, 24) * 60 * 60, 1000);
        }
      }
      return n;
    }
    if (S.isBefore(G)) {
      return H;
    }
  }
  function ve(n, i, a) {
    let e = q;
    let s = {
      dznuI: function (e) {
        return e();
      }
    };
    let c = 2147483647;
    if (P[e(977)](a, c)) {
      registerTimer(n, setInterval(i, a));
    } else {
      let t = a;
      let r = Date.now();
      (function o() {
        var e = Math.min(t, c);
        var e = setTimeout(() => {
          var e = b;
          var n = Date.now() - r;
          if ((t -= n) <= 0) {
            i();
            t = a;
            r = Date.now();
          }
          s[e(516)](o);
        }, e);
        registerTimer(n, e);
      })();
    }
  }
  let ne = false;
  async function oe(o) {
    let r = q;
    let i = {
      eJlpj: P.JCUao,
      AxKuT: "🔑 BOT STARTU" + r(1192) + r(475) + r(1532) + " TOKEN",
      rIuOa: r(908) + "ow to fix th" + r(749),
      bmLPQ: P[r(1091)],
      DLvwF: "│     5. Cop" + r(949) + r(1524) + "ken an" + r(435) + "te you" + r(499) + ".yml f" + r(1465),
      IWwVd: r(783) + "H COMM" + r(1040) + r(918) + "- UNKNOWN ER" + r(1067),
      dALDg: "No add" + r(602) + "l details available",
      EVfJM: function (e, n) {
        return P.AvzLP(e, n);
      },
      aLfjo: function (e, n) {
        return e === n;
      }
    };
    var e;
    if (ne) {
      if (P.CsJYn === "jdzaS") {
        return undefined;
      } else {
        return (e = G[r(424)](j.guilds.cache.keys()))[H[r(536)](K[r(610)]() * e[r(1491)])];
      }
    }
    ne = true;
    try {
      if (r(1525) === P.ISLWr) {
        if (H - K.timestamp > O) {
          U.delete(k[r(815)]);
          W++;
        }
      } else {
        let e = await ChannelStat.find({}).limit(5)[r(562)]();
        let t = [];
        var a;
        for (a of e) {
          var s = o[r(925)].cache.get(a.guildId);
          if (s) {
            var c;
            var l;
            var u;
            var d;
            var f = s.channels.cache.get(a[r(1473) + r(916)]);
            if (f && f.type === 2) {
              let n;
              try {
                switch (a[r(1018)]) {
                  case "MemberCount":
                    n = s["member" + r(1393)][r(427) + "ng"]();
                    break;
                  case r(1135) + "ooster" + r(1393):
                    n = s[r(691) + "mSubscriptionCount"][r(427) + "ng"]();
                    break;
                  case "Server" + r(1342) + "onDate":
                    n = s[r(921) + r(474)].toDateString();
                    break;
                  case r(501) + "olesCount":
                    n = s[r(1203)].cache[r(494)].toString();
                    break;
                  case P.kGOeX:
                    n = s[r(702)].cache.size[r(427) + "ng"]();
                    break;
                  case "TotalC" + r(851) + r(529):
                    n = s[r(1473) + "ls"].cache[r(494)].toString();
                    break;
                  case P[r(950)]:
                    var g = Math.min(s[r(612) + "s"].cache[r(1328)](e => ["online", "dnd", r(611)].includes(e[r(1429) + "ce"]?.status) && !e[r(439)][r(717)])[r(494)], s.memberCount);
                    n = g.toString();
                    break;
                  case "Server" + r(1339):
                    n = s[r(1004) + "redLocale"];
                    break;
                  case r(654) + r(883) + "WithRole":
                    if (a.roleId) {
                      c = s[r(1203)][r(1236)][r(483)](a[r(886)]);
                      n = c ? c[r(612) + "s"][r(494)].toString() : "0";
                    } else if (P[r(1212)] !== r(1151)) {
                      N.add(S);
                    } else {
                      n = "0";
                    }
                    break;
                  case r(1516) + r(539) + r(523) + "ole":
                    if (a[r(886)]) {
                      var v = s[r(1203)][r(1236)][r(483)](a[r(886)]);
                      n = v ? v.members[r(1328)](e => ["online", r(1352), r(611)].includes(e.presence?.[r(1055)]) && !e.user[r(717)])[r(494)][r(427) + "ng"]() : "0";
                    } else if (P.QVmtt !== "wnfsv") {
                      let e = Y;
                      if (!["Server" + r(1342) + "onDate", r(530) + "Region"].includes(U.type) && !k(W)) {
                        e = new J["Number" + r(1148)]("en-US")[r(1324)](Q);
                      }
                      var m = X[r(1473) + "lName"].split(i.eJlpj);
                      var w = m[0] || "";
                      var h = m[1] || "";
                      var y = ("" + w + e + h).replace(/\s+/g, " ").trim()[r(442) + r(1105)](0, 100);
                      if (Z[r(652)] !== y) {
                        F.push({
                          channel: fe,
                          newName: y,
                          currentName: ge.name
                        });
                      }
                    } else {
                      n = "0";
                    }
                    break;
                  case "TotalMessages":
                    try {
                      if (P.ePBOc !== "bLOYj") {
                        l = await UserData.aggregate([{
                          $match: {
                            guildId: s.id
                          }
                        }, {
                          $group: {
                            _id: null,
                            total: {
                              $sum: P[r(1076)]
                            }
                          }
                        }]);
                        n = l[r(1491)] > 0 ? l[0][r(1103)].toString() : "0";
                      } else {
                        N[r(593)]("Failed" + r(761) + r(984) + "oll message:", S);
                      }
                    } catch {
                      n = "0";
                    }
                    break;
                  case r(722) + "ime":
                    var C = o.uptime;
                    var L = Math[r(536)](P[r(878)](C, 86400000));
                    var z = Math[r(536)](C % 86400000 / 3600000);
                    var b = Math.floor(P.EJneb(C % 3600000, 60000));
                    if (L > 0) {
                      n = L + "d " + z + "h";
                    } else if (z > 0) {
                      if (P.CJtyn("mHIcf", P.meQuN)) {
                        R = "0";
                      } else {
                        n = z + "h " + b + "m";
                      }
                    } else if (P[r(993)] === "YJiSD") {
                      n = b + "m";
                    } else {
                      _[r(1241)]("\n" + $[r(1262)].red("━━━━━━━━━━━━━━━━━━" + r(566) + r(566) + "━━━━━━" + r(566) + "━━━━━━" + r(566) + r(566) + "━━━━━━" + r(566)));
                      ee[r(1241)](ve[r(1262)][r(1063)](i[r(1209)]));
                      ne.log(oe.bold[r(1063)]("━━━━━━━━━━━━" + r(566) + "━━━━━━━━━━━━━━━━━━" + r(566) + "━━━━━━" + r(566) + "━━━━━━━━━━━━" + r(566)));
                      te[r(1241)](re.red("│"));
                      me[r(1241)](we.red(r(1014) + "rror: " + r(476) + r(804) + "n prov" + r(1191) + "s inva" + r(934) + r(811) + "ed"));
                      he.log(ye.red("│"));
                      Ce.log(Le.red(i.rIuOa));
                      ze.log(be.red(r(624) + r(852) + "to htt" + r(1245) + r(1362) + ".com/d" + r(1226) + "ers/applications"));
                      ie.log(ae[r(1063)](i[r(1282)]));
                      Be.log(Me[r(1063)](r(624) + "3. Nav" + r(731) + r(816) + r(486) + " section"));
                      De[r(1241)](pe.red(r(624) + "4. Cli" + r(1104) + "set To" + r(628) + "o gene" + r(1058) + " new one"));
                      se[r(1241)](ce.red(i[r(728)]));
                      le.log(ue[r(1063)]("│"));
                      de.log(Ae[r(1063)]("│  ⚠️  " + r(1129) + r(823) + "eep yo" + r(432) + " token secure and never " + r(992) + "it!"));
                      xe.log(Ie.red("│"));
                      Ee[r(1241)](Te.bold[r(1063)](r(566) + r(566) + r(566) + "━━━━━━" + r(566) + "━━━━━━━━━━━━" + r(566) + r(566) + "━━━━━━" + r(566) + "━━━━━━\n"));
                      qe.exit();
                    }
                    break;
                  case r(813) + r(1365):
                    try {
                      if (r(1539) !== P.FAbRW) {
                        u = await UserData[r(1509) + r(714)]([{
                          $match: {
                            guildId: s.id
                          }
                        }, {
                          $project: {
                            caseCount: {
                              $add: [{
                                $size: {
                                  $ifNull: [P[r(503)], []]
                                }
                              }, {
                                $size: {
                                  $ifNull: ["$kicks", []]
                                }
                              }, {
                                $size: {
                                  $ifNull: [P[r(805)], []]
                                }
                              }, {
                                $size: {
                                  $ifNull: [P.cNdAF, []]
                                }
                              }]
                            }
                          }
                        }, {
                          $group: {
                            _id: null,
                            total: {
                              $sum: "$caseCount"
                            }
                          }
                        }]);
                        n = u.length > 0 ? u[0][r(1103)][r(427) + "ng"]() : "0";
                      } else {
                        j[r(995) + "ommands"].push(H[r(1073)][r(412)]());
                        K[r(995) + "ommands"].set(O[r(1073)].name, V);
                      }
                    } catch {
                      n = "0";
                    }
                    break;
                  case r(1500) + "uggestions":
                    try {
                      var B = await P[r(1097)](require, "./models/Sug" + r(1021) + "n").countDocuments({
                        guildId: s.id
                      });
                      n = B.toString();
                    } catch {
                      if (!P.AvzLP(r(622), r(703))) {
                        N[r(593)]("[ERROR" + r(767) + r(1255) + " '" + S + r(739) + " not export a func" + r(1392) + r(966) + r(580));
                        return;
                      }
                      n = "0";
                    }
                    break;
                  case "TotalTickets":
                    try {
                      if (P.EhVje("Ihkzo", P[r(1182)])) {
                        d = await Ticket.countDocuments({
                          guildId: s.id
                        });
                        n = d[r(427) + "ng"]();
                      } else {
                        R = false;
                      }
                    } catch {
                      n = "0";
                    }
                    break;
                  case r(947) + r(1259):
                    try {
                      var M = await Ticket[r(740) + "ocuments"]({
                        guildId: s.id,
                        status: r(1066)
                      });
                      n = M.toString();
                    } catch {
                      n = "0";
                    }
                    break;
                  case "ClosedTickets":
                    try {
                      var D = await Ticket["countD" + r(1083) + "ts"]({
                        guildId: s.id,
                        status: r(1281)
                      });
                      n = D[r(427) + "ng"]();
                    } catch {
                      n = "0";
                    }
                    break;
                  case "DeletedTickets":
                    try {
                      var p = await Ticket[r(740) + r(1083) + "ts"]({
                        guildId: s.id,
                        status: P.yIaVn
                      });
                      n = p[r(427) + "ng"]();
                    } catch {
                      n = "0";
                    }
                    break;
                  case P.wMyZN:
                    try {
                      var A = await s.bans[r(680)]();
                      n = A[r(494)][r(427) + "ng"]();
                    } catch {
                      n = "0";
                    }
                    break;
                  default:
                    continue;
                }
                if (n != null) {
                  let e = n;
                  if (![P[r(903)], "ServerRegion"].includes(a[r(1018)]) && !isNaN(n)) {
                    e = new Intl[r(856) + "Format"](r(1501)).format(n);
                  }
                  var x = a["channe" + r(1154)][r(1386)](r(1488) + "}");
                  var I = x[0] || "";
                  var E = x[1] || "";
                  var T = ("" + I + e + E).replace(/\s+/g, " ")[r(922)]()[r(442) + r(1105)](0, 100);
                  if (P.LzxTC(f.name, T)) {
                    if (P[r(668)]("dXZrA", r(1347))) {
                      R = "0";
                    } else {
                      t[r(1208)]({
                        channel: f,
                        newName: T,
                        currentName: f.name
                      });
                    }
                  }
                }
              } catch (e) {
                console[r(593)](r(1101) + r(1338) + "sing s" + r(1334) + a[r(1018)] + ":", e[r(1278) + "e"]);
              }
            }
          }
        }
        if (t[r(1491)] > 0) {
          (async () => {
            var n;
            var o = r;
            for (n of t[o(756)](0, 3)) {
              try {
                if (i.EVfJM(n[o(1473) + "l"].name, n.newName)) {
                  await n[o(1473) + "l"].setName(n.newName);
                  await new Promise(e => setTimeout(e, 10000));
                }
              } catch (e) {
                if (e[o(1054)] !== 429) {
                  if (i[o(1026)]("DOaBi", o(1520))) {
                    console.error(o(1466) + o(761) + o(876) + "hannel " + n.channel.id + ":", e[o(1278) + "e"]);
                  } else if (N.gc) {
                    G.gc();
                  }
                }
              }
            }
          })().catch(console.error);
        }
      }
    } catch (e) {
      console.error("Error in updateCha" + r(1123) + r(759), e[r(1278) + "e"]);
    } finally {
      ne = false;
    }
  }
  function te(e) {
    let r = q;
    let n = fs[r(468) + r(1102)](e, {
      withFileTypes: true
    });
    let i = new Set();
    let a = [];
    for (var o of n) {
      var s = path[r(791)](e, o[r(652)]);
      if (o[r(699) + "ctory"]()) {
        te(s);
      } else if (o.isFile() && o.name[r(742) + "th"](".js")) {
        try {
          let t = P.skYvf(require, s);
          if (t.data instanceof SlashCommandBuilder || P[r(1316)](t.data, ContextMenuCommandBuilder) || Array[r(1405) + "y"](t.data)) {
            (Array[r(1405) + "y"](t[r(1073)]) ? t[r(1073)] : [t[r(1073)]]).forEach(e => {
              var n = r;
              var o = e[n(652)];
              if (i.has(o)) {
                a[n(1208)](o);
              } else {
                i.add(o);
                if (commandConfig[o]) {
                  global[n(995) + n(672) + "s"][n(1208)](e[n(412)]());
                  client["slashC" + n(672) + "s"].set(o, t);
                }
              }
            });
          }
        } catch (e) {
          console.error(colors.red(P.EHLAb) + (r(787) + r(532) + "ng ") + o[r(652)] + ":", e);
        }
      }
    }
    if (a.length > 0) {
      console[r(593)](colors[r(1063)](r(1544) + "]") + (" Duplicate command names" + r(436)) + "ted:", a.join(", "));
    }
  }
  function re(r, i = ".js") {
    let a = q;
    let s = {
      HMsTN: function (e, n) {
        return e !== n;
      },
      ebmSA: function (e, n) {
        return e !== n;
      }
    };
    let c = [];
    fs.readdirSync(r)[a(491) + "h"](e => {
      var n = a;
      if (s.HMsTN(n(556), n(1084))) {
        var o = path[n(791)](r, e);
        var t = fs[n(1468) + "nc"](o);
        if (t && t[n(699) + "ctory"]()) {
          c = c.concat(re(o, i));
        } else if (e.endsWith(i)) {
          if (s[n(502)]("iEcQD", n(650))) {
            if (V.has(d)) {
              Z(v.get(y));
            }
            W.set(w, h);
            return X;
          }
          c.push(o);
        }
      } else {
        R = "0";
      }
    });
    return c;
  }
  P[q(1238)](te, path.join(__dirname, "commands"));
  let me = {
    PRIMARY: ButtonStyle.Primary,
    SECONDARY: ButtonStyle["Second" + q(1178)],
    SUCCESS: ButtonStyle.Success,
    DANGER: ButtonStyle.Danger,
    LINK: ButtonStyle[q(1096)]
  };
  async function we() {
    let c = q;
    let o = {
      AimZX: "Error during bot initialization:"
    };
    if (config.ReactionRoles[c(477) + "d"]) {
      for (let s in config["Reacti" + c(937) + "s"]) {
        if (!P.ROkwe(s, c(477) + "d")) {
          var t;
          var l = config.ReactionRoles[s];
          if (!l) {
            if (P[c(458)] !== c(413)) {
              continue;
            }
            for (var [e, n] of H.entries()) {
              O(n);
            }
            j[c(1545)]();
          }
          if (!l[c(974) + c(1382)]) {
            if (!P[c(520)](P[c(644)], "xMLNG")) {
              continue;
            }
            N[c(1445)] = new S();
          }
          for (t of Array.isArray(l["Channe" + c(1382)]) ? l[c(974) + c(1382)] : [l[c(974) + "lID"]]) {
            if (t && t !== "" && !P[c(764)](t, "CHANNE" + c(768))) {
              var u = "ReactionRoles." + s + ".Chann" + c(519);
              if (validateChannelId(t, c(1355) + c(559) + c(1100) + c(1036) + s + "\"", u)) {
                let e;
                try {
                  e = await client.channels.fetch(t);
                } catch (e) {
                  if (e.code === 50035) {
                    P.UWkDB(displayChannelIdError, t, c(1355) + "on Role Pane" + c(1036) + s + "\"", u);
                  } else if (e.code !== 10003) {
                    console[c(593)](c(1101) + "fetching cha" + c(651) + c(595) + c(936) + s + ":", e);
                  }
                  continue;
                }
                if (!e) {
                  if (c(645) !== "PPGYt") {
                    continue;
                  }
                  j();
                  H = K;
                  O = V.now();
                }
                u = await ReactionRole.findOne({
                  panelName: s
                });
                if (u) {
                  try {
                    await e[c(1278) + "es"][c(680)](u.messageID);
                    continue;
                  } catch (e) {
                    if (!P.WJkVU(e.code, 10008)) {
                      console.error("Error " + c(1202) + "ng existing " + c(496) + "on rol" + c(1176) + c(1495) + "r " + s + ":", e);
                      continue;
                    }
                    await ReactionRole[c(1228) + "One"]({
                      panelName: s
                    });
                  }
                }
                var r;
                var u = l.Embed.Description[c(434)](e => e[c(922)]())[c(791)]("\n");
                var u = new EmbedBuilder()[c(1511) + c(923) + "on"](u);
                if (l[c(1239)].Title) {
                  u[c(1442) + "le"](l.Embed[c(1415)]);
                }
                if (l[c(1239)][c(565)] && l.Embed.Footer[c(1366)]) {
                  if (P.OtKzA === "pCvNN") {
                    r = {
                      text: l[c(1239)].Footer[c(1366)]
                    };
                    if (l.Embed[c(565)][c(1088)] && l[c(1239)].Footer[c(1088)].trim() !== "") {
                      r.iconURL = l[c(1239)].Footer[c(1088)];
                    }
                    u["setFoo" + c(1168)](r);
                  } else {
                    S.error("Failed" + c(1137) + "nnect to MongoDB: " + G.message);
                    j.exit(1);
                  }
                }
                if (l.Embed[c(492)] && l.Embed[c(492)].Text) {
                  r = {
                    name: l[c(1239)][c(492)][c(1366)]
                  };
                  if (l.Embed[c(492)][c(1088)] && P[c(779)](l.Embed[c(492)][c(1088)][c(922)](), "")) {
                    r.iconURL = l.Embed[c(492)].Icon;
                  }
                  u.setAuthor(r);
                }
                if (l.Embed[c(1171)]) {
                  u[c(1416) + "or"](l[c(1239)].Color);
                }
                if (l.Embed.Image) {
                  u.setImage(l[c(1239)].Image);
                }
                if (l[c(1239)]["Thumbn" + c(848)]) {
                  u[c(838) + "mbnail"](l[c(1239)].Thumbnail);
                }
                let n;
                if (l.type === P.waTfF) {
                  if (c(594) === "AywtK") {
                    N.error(o[c(1028)], S);
                  } else {
                    let r = [];
                    let i = new ActionRowBuilder();
                    let a = 0;
                    l.Reactions.forEach((e, n) => {
                      var o = c;
                      if (P[o(709)](P[o(895)], P[o(1496)])) {
                        N.iconURL = S[o(1239)].Author.Icon;
                      } else {
                        if (a >= 25) {
                          if (o(953) !== P.WmrsV) {
                            console[o(593)]("Exceeded the" + o(1124) + o(561) + "t for " + o(663) + " " + s + o(421) + "mum 25 butto" + o(449) + " allowed.");
                            return;
                          }
                          S[o(593)](o(1466) + o(826) + "ocess " + o(423) + o(1535) + "r " + G[o(1000) + o(1384)] + ": " + j);
                        }
                        var t = me[e[o(426)][o(1396) + "rCase"]()] || ButtonStyle["Second" + o(1178)];
                        var n = new ButtonBuilder()["setCus" + o(716)]("reacti" + o(785) + "e_" + s + "_" + n).setLabel(e[o(879) + o(666)]).setStyle(t)[o(547) + "ji"](e.Emoji);
                        i[o(790) + "ponents"](n);
                        a++;
                        if (i[o(647) + o(946)].length === 5) {
                          r[o(1208)](i);
                          i = new ActionRowBuilder();
                        }
                      }
                    });
                    if (i["compon" + c(946)][c(1491)] > 0) {
                      r.push(i);
                    }
                    n = await e[c(1459)]({
                      embeds: [u],
                      components: r
                    });
                  }
                } else if (l.type === c(497)) {
                  n = await e.send({
                    embeds: [u]
                  });
                  for (var i of l.Reactions) {
                    await n[c(1397)](i.Emoji);
                  }
                } else if (l.type === P.gRPQj) {
                  let t = new StringSelectMenuBuilder()[c(833) + c(716)](c(496) + "on_role_" + s)[c(1251) + "ceholder"]("Select your " + c(1203)).setMinValues(0).setMaxValues(l[c(1355) + "ons"][c(1491)]);
                  l["Reacti" + c(1033)][c(491) + "h"]((e, n) => {
                    var o = c;
                    var n = {
                      label: e.Name,
                      value: s + "_" + n,
                      emoji: e.Emoji
                    };
                    if (e.Description) {
                      n[o(983) + o(666)] = e["Descri" + o(666)];
                    }
                    t.addOptions(n);
                  });
                  var a = new ActionRowBuilder()["addCom" + c(1069) + "s"](t);
                  n = await e[c(1459)]({
                    embeds: [u],
                    components: [a]
                  });
                }
                if (n) {
                  if (P[c(888)] !== c(1003)) {
                    await ReactionRole["findOn" + c(1403) + c(840)]({
                      panelName: s,
                      channelID: t
                    }, {
                      panelName: s,
                      channelID: t,
                      messageID: n.id
                    }, {
                      upsert: true,
                      new: true
                    });
                  } else {
                    u = Y[c(791)](U, k);
                    if ((a = W[c(1468) + "nc"](u)) && a[c(699) + c(964)]()) {
                      J = Q[c(462)](F(u, fe));
                    } else if (v[c(742) + "th"](y)) {
                      ge[c(1208)](u);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  async function he() {
    let r = q;
    if (r(810) === "jagCV") {
      if (config.Warnings && config.Warnings.Expiry) {
        let e = P[r(1438)](ee, config.Warnings.Expiry);
        let n = new Date();
        let o = new Date(P.TxMAE(n[r(762) + "e"](), e));
        try {
          var t;
          for (t of await UserData.find({
            "warnings.date": {
              $lte: o
            }
          })) {
            if (r(877) !== P[r(913)]) {
              N(S[r(1256) + "alId"]);
            } else {
              t[r(564) + "gs"] = t.warnings[r(1328)](e => e.date > o);
              await t.save();
            }
          }
        } catch (e) {
          if (r(758) !== "FmixX") {
            if (K) {
              return O.error;
            }
            V.forEach(e => {
              var n;
              var o;
              var t = r;
              if (e.endsWith(t(796))) {
                n = W(t(640) + t(1494) + e);
                o = e.split(".")[0];
                if (typeof n != "function") {
                  Z[t(593)]("[ERROR" + t(767) + t(1255) + " '" + e + "' does not export " + t(553) + "tion. " + t(966) + t(580));
                } else {
                  h.on(o, n.bind(null, X));
                }
              }
            });
          } else {
            console.error(r(1101) + r(1419) + r(1224) + r(1099) + r(1169) + "s:", e);
          }
        }
      } else {
        console.error(r(960) + "g configuration is" + r(527) + "ng or " + r(724) + r(1436));
      }
    }
  }
  async function ye() {
    let i = q;
    let o = {
      WZYPg: "Error checking exp" + i(843) + i(655) + "s:"
    };
    let a = new Date();
    UserData.find({
      "tempBans.endTime": {
        $lte: a
      },
      "tempBans.lifted": false
    })[i(1542)](async e => {
      var o;
      var t = i;
      for (o of e) {
        for (let n of o.tempBans) {
          if (n.endTime <= a && !n[t(495)]) {
            var r = client.guilds[t(1236)].get(o[t(570) + "d"]);
            if (r) {
              try {
                await r.members.unban(o[t(1077)]);
                n.lifted = true;
              } catch (e) {
                if (e.code === 10026) {
                  if (t(817) !== P.DGfME) {
                    R = "0";
                  } else {
                    o.tempBans = o[t(751) + "ns"].filter(e => e !== n);
                  }
                } else {
                  console[t(593)]("Failed to unban user " + o[t(1077)] + ":", e);
                }
              }
            }
          }
        }
        await o.save();
      }
    }).catch(e => {
      var n = i;
      console.error(o[n(1227)], e);
    });
  }
  function Ce() {
    setInterval(ye, 60000);
  }
  async function Le(e) {
    var n;
    var o = q;
    try {
      for (n of await Ticket[o(1280)]({
        status: {
          $in: ["open", P[o(544)]]
        }
      })) {
        if (!(await e.channels[o(1236)].get(n[o(1473) + o(916)])) && !(await e[o(1473) + "ls"].fetch(n.channelId).catch(() => null))) {
          n[o(1055)] = "deleted";
          n.deletedAt = new Date();
          await n[o(980)]();
        }
      }
    } catch (e) {}
  }
  async function ze() {
    var n;
    var o = q;
    let t = 0;
    for (n of await TempRole.find({})) {
      var e = client[o(925)][o(1236)][o(483)](n[o(570) + "d"]);
      if (e) {
        if (e.roles.cache[o(483)](n[o(886)])) {
          try {
            await e[o(612) + "s"].fetch(n.userId);
          } catch (e) {
            if (e[o(1054)] === 10007) {
              await TempRole.deleteOne({
                _id: n._id
              });
              t++;
            }
          }
        } else {
          await TempRole[o(1228) + o(798)]({
            _id: n[o(991)]
          });
          t++;
        }
      } else {
        await TempRole[o(1228) + "One"]({
          _id: n._id
        });
        t++;
      }
    }
    if (P.mBMga(t, 0)) {
      if (o(1302) !== o(1302)) {
        N.error(o(1101) + "in optimized member check:", S.message);
      } else {
        console.log(o(1156) + o(944) + t + (" inval" + o(682) + o(1271) + o(1048)) + "es");
      }
    }
  }
  async function be() {
    var n;
    var o = q;
    var e = new Date();
    for (n of await TempRole.find({
      expiration: {
        $lte: e
      }
    })) {
      var t = client[o(925)].cache.get(n[o(570) + "d"]);
      if (!t) {
        if (P.ROkwe("hZYIO", "hZYIO")) {
          await TempRole.deleteOne({
            _id: n._id
          });
          continue;
        }
        S[o(593)](o(1101) + o(1338) + o(959) + o(1334) + G.type + ":", j.message);
      }
      try {
        var r = await t[o(612) + "s"][o(680)](n[o(1077)]);
        if (r) {
          await r[o(1203)][o(1085)](n.roleId);
        }
      } catch (e) {
        if (e[o(1054)] === 10007) {
          await TempRole[o(1228) + o(798)]({
            _id: n[o(991)]
          });
          continue;
        }
      }
      await TempRole["delete" + o(798)]({
        _id: n[o(991)]
      });
    }
  }
  async function ie() {
    var e = q;
    var n = await TempRole[e(1423) + "e"]({
      expiration: {
        $gt: new Date()
      }
    }).sort({
      expiration: 1
    })[e(562)]();
    var n = n ? Math[e(1378)](Math[e(1486)](10000, new Date(n.expiration)[e(762) + "e"]() - Date.now()), 86400000) : 60000;
    registerTimer(P[e(1056)], setTimeout(async () => {
      await be();
      ie();
    }, n));
  }
  async function ae(e, n, o) {
    let t = q;
    if (e[t(1292) + "l"]) {
      try {
        await e.fetch();
      } catch (e) {
        console.error(t(1466) + " to fe" + t(834) + "action:", e);
        return;
      }
    }
    var r;
    var i = client.polls.get(e[t(1278) + "e"].id);
    if (i) {
      if (o && !i.multiVote) {
        for ([, r] of e.message[t(496) + "ons"].cache.filter(e => e[t(1546)].cache.has(n.id))) {
          if (P[t(668)](P.nonoG, P.nonoG)) {
            N[t(593)]("Role n" + t(1513) + t(534) + t(1109) + "al in " + t(663) + " " + S);
            return;
          }
          if (r.emoji[t(652)] !== e[t(440)].name) {
            await r[t(1546)][t(1085)](n.id);
          }
        }
      }
      await Be(e[t(1278) + "e"], i);
    }
  }
  async function Be(e, n) {
    let r = q;
    let i = {
      Rmljj: function (e, n) {
        return e - n;
      }
    };
    if (P[r(452)](r(818), "MAmdB")) {
      pe.log("\n" + se[r(1262)][r(1063)](r(566) + r(566) + r(566) + r(566) + r(566) + r(566) + r(566) + r(566) + r(566) + "━━━━━━━━━━━━━━━━━━"));
      ce.log(le.bold.red(r(783) + r(1351) + r(1040) + "AILED - MISSING PERMISSI" + r(1315)));
      ue.log(de.bold.red(r(566) + "━━━━━━" + r(566) + r(566) + r(566) + r(566) + r(566) + r(566) + r(566) + r(566) + "━━━━━━" + r(566)));
      Ae[r(1241)](xe.red("│"));
      Ie.log(Ee[r(1063)](P[r(1430)]));
      Te[r(1241)](qe.red("│"));
      o.log(t.red("│  🔧 R" + r(1399) + "d fixes:"));
      c.log(aj[r(1063)](r(624) + r(646) + "ot must be i" + r(1526) + " Discord server"));
      ak.log(e.red(r(624) + "2. 🛡️  " + r(1174) + "st hav" + r(1529) + r(955) + r(1030) + "rmissions"));
      n.log(i.red(r(624) + r(689) + "ot rol" + r(1388) + r(1130) + "e HIGH" + r(857) + "le in the server"));
      ao.log(ap.red("│     4. ⚙️  Bot mu" + r(1064) + r(854) + r(1380) + r(445) + "mmands\" scope"));
      aq[r(1241)](ar[r(1063)]("│"));
      as[r(1241)](at[r(1063)]("│  📋 S" + r(1409) + r(789) + r(1215) + "on:"));
      au.log(av[r(1063)]("│     " + r(625) + "k if bot is in your server"));
      aw[r(1241)](ax[r(1063)]("│     " + r(1082) + r(1232) + "er Settings " + r(598) + "s"));
      ay.log(az[r(1063)]("│     " + r(1398) + r(578) + r(1190) + " the TOP of " + r(1305) + "le list"));
      aA.log(aB[r(1063)]("│     • Give bot r" + r(1507) + r(632) + r(1311) + "permis" + r(1098)));
      aC[r(1241)](aD[r(1063)](P[r(1432)]));
      aE.log(aF.red("│"));
      aG[r(1241)](aH[r(1063)](r(1087) + "etailed Setup Guide:"));
      aI.log(aJ[r(1063)](r(624) + "🔗 http" + r(1434) + "cs.dra" + r(705) + "lopmen" + r(489)));
      aK[r(1241)](aL.red("│"));
      if (aM.user) {
        aW[r(1241)](aX.red(P[r(1115)]));
        aY.log(aZ[r(1063)](r(624) + r(978) + r(1508) + r(915) + r(973) + "oauth2/authorize?c" + r(1016) + r(871) + b0[r(439)].id + (r(1235) + r(1044) + r(1029) + r(1517) + r(1057) + r(1380)) + "ons.commands"));
        b1[r(1241)](b2.red("│"));
      }
      aU.log(aV.bold[r(1063)](r(566) + r(566) + "━━━━━━" + r(566) + "━━━━━━━━━━━━" + r(566) + r(566) + "━━━━━━━━━━━━━━━━━━" + r(566) + "\n"));
    } else {
      let t = e[r(496) + "ons"].cache;
      n[r(617) + "s"].forEach(e => {
        var n = r;
        var o = t[n(483)](e[n(440)])?.[n(1448)] || 0;
        e.votes = Math.max(i[n(844)](o, 1), 0);
      });
      await Me(e.id, n);
      await De(e, n);
    }
  }
  async function Me(e, n) {
    var o = q;
    try {
      var t = {
        choices: n[o(617) + "s"]
      };
      await Poll[o(1423) + o(1403) + "date"]({
        messageId: e
      }, t);
    } catch (e) {
      console.error(P.prhOH, e);
    }
  }
  async function De(e, n) {
    let o = q;
    let t = {
      UoRlk: function (e, n, o, t) {
        var r = b;
        return P[r(1216)](e, n, o, t);
      }
    };
    let r = e.embeds[0];
    let i = new EmbedBuilder().setAuthor(r[o(1112)]).setTitle(r[o(738)])[o(1416) + "or"](r[o(965)]).setFooter(r.footer)[o(774) + o(577)](r[o(1538) + "amp"]);
    let a = "";
    n[o(617) + "s"][o(491) + "h"](e => {
      var n = o;
      if (P[n(897)]("RSgFd", "wrJEs")) {
        t[n(1454)](G, j, "Reaction Rol" + n(1100) + "l \"" + H + "\"", K);
      } else {
        a += e.emoji + " " + e.name + " (" + e.votes + n(994) + ")\n";
      }
    });
    i[o(1511) + o(923) + "on"](a);
    try {
      await e.edit({
        embeds: [i]
      });
    } catch (e) {
      console.error(o(1466) + o(761) + o(984) + o(754) + "ssage:", e);
    }
  }
  async function pe(n) {
    let o = q;
    let t = {
      pEdRR: "polls.load",
      gQxAm: function (e, n) {
        var o = b;
        return P[o(1438)](e, n);
      },
      aUkbz: P[o(935)],
      xhAEv: function (e, n) {
        return e === n;
      }
    };
    if (!n[o(1445)]) {
      n.polls = new Map();
    }
    try {
      var r;
      e = o;
      for (r of await (0, require(e(855) + "s/core/perfMonitor").observeAsync)(t[e(1484)], async () => Poll.find({}).lean())) {
        try {
          if (P[o(1444)]("SvYzM", "oKdVt")) {
            if (r[o(1278) + o(597)] && r[o(617) + "s"] && Array[o(1405) + "y"](r[o(617) + "s"])) {
              let e;
              try {
                e = await n[o(1473) + "ls"][o(680)](r.channelId);
              } catch (e) {
                continue;
              }
              if (e) {
                try {
                  if (o(1279) === P[o(743)]) {
                    if (await e.messages[o(680)](r.messageId)) {
                      n.polls[o(1177)](r[o(1278) + o(597)], r);
                    } else {
                      await Poll.deleteOne({
                        messageId: r.messageId
                      });
                    }
                  } else {
                    t[o(746)](N, S);
                  }
                } catch (e) {
                  if (P[o(448)] !== o(889)) {
                    if (P[o(472)](e[o(1278) + "e"], P[o(1199)])) {
                      await Poll.deleteOne({
                        messageId: r[o(1278) + "eId"]
                      });
                    }
                  } else {
                    N[o(593)](t[o(1119)], S);
                  }
                }
              } else {
                await Poll.deleteOne({
                  messageId: r[o(1278) + o(597)]
                });
              }
            }
          } else {
            if (!Z[o(835)] || !v[o(1112)] || y[o(1112)]?.bot) {
              return;
            }
            if (t.xhAEv(C.content, J[o(1514) + "t"])) {
              return;
            }
            if (!Q[o(1244)][o(821)](F[o(835)].id)) {
              ve[o(1244)].set(ne[o(835)].id, new oe());
            }
            z.snipes.get(m[o(835)].id)[o(1177)](B[o(1473) + "l"].id, {
              oldContent: M[o(1514) + "t"],
              newContent: D.content,
              author: _.author.tag,
              member: $[o(612)],
              timestamp: new ee(),
              edited: true
            });
          }
        } catch (e) {
          console[o(593)]("Error processing p" + o(732) + r[o(1278) + o(597)] + ":", e);
        }
      }
    } catch (e) {
      console[o(593)](P[o(822)], e);
    }
    var e;
  }
  client.polls = new Map();
  client.on(P[q(924)], async (e, n) => {
    if (!n.bot) {
      await ae(e, n, true);
    }
  });
  client.on(P[q(446)], async (e, n) => {
    var o = q;
    if (!n[o(717)]) {
      await P[o(706)](ae, e, n, false);
    }
  });
  let {
    handleInvalidLicense: se,
    handleRateLimitExceeded: ce,
    handleInvalidLicenseStatus: le,
    handleInvalidLicenseKey: ue
  } = P.jLQJk(require, "./util" + q(1222) + q(1426) + q(1034) + "js");
  let de = e => {
    var n = q;
    if (e && e.guilds && e[n(925)][n(1236)][n(494)] > 0) {
      return (e = Array.from(e[n(925)].cache.keys()))[Math.floor(Math.random() * e.length)];
    } else {
      return "no-guild";
    }
  };
  function Ae(e) {
    var n = q;
    if (!P.ZBesp(P.fyWEP, "GFdfl")) {
      n = /(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/[n(459)](e);
      return ((P.XCfll(parseInt, n[1]) || 0) * 3600 + (parseInt(n[2]) || 0) * 60 + (parseInt(n[3]) || 0)) * 1000;
    }
    S(() => {
      H.delete(K);
    }, 2000);
  }
  function xe() {
    let n = q;
    if (n(1118) === n(1118)) {
      var e;
      var o = P[n(1207)](moment).tz(config.Timezone);
      var t = config.Economy["interestInte" + n(860)].map(e => moment.tz(e, "HH:mm", config[n(596) + "ne"]));
      t[n(1294)]((e, n) => e.diff(n));
      for (e of t) {
        if (o[n(1145) + "re"](e)) {
          return e;
        }
      }
      return t[0].add(1, n(1424));
    }
    if (S.intervalId) {
      P.nFGoh(H, K["interv" + n(1163)]);
    }
  }
  function Ie() {
    let e = q;
    var n;
    if (e(929) === "SstDU") {
      if (!process.env["TEST_M" + e(1043)]) {
        P.WFlWK(P[e(1407)](1440, 60), 1000);
      }
      n = P[e(535)](xe);
      P[e(1287)](setTimeout, async () => {
        var n;
        var o = e;
        for (n of await UserData[o(1280)]({})) {
          var t = n["intere" + o(498)] !== null ? n[o(537) + "stRate"] : config.Economy[o(979) + "tInterestRate"];
          let e = n.bank * t;
          if (config[o(542) + "y"][o(1310) + o(1364) + "arning"] && config[o(542) + "y"][o(1310) + "erestE" + o(1169)] > 0) {
            e = Math[o(1378)](e, config.Economy[o(1310) + "erestE" + o(1169)]);
          }
          await UserData["findOn" + o(1403) + o(840)]({
            _id: n._id
          }, {
            $inc: {
              bank: e
            },
            $push: {
              transactionLogs: {
                type: o(537) + "st",
                amount: e,
                timestamp: new Date()
              }
            }
          });
        }
        Ie();
      }, n[e(1506)](P[e(850)](moment).tz(config.Timezone)));
    }
  }
  async function Ee() {
    var n = q;
    client.removeAllListeners(n(1278) + "eCreate");
    client["remove" + n(505) + n(1121)](P.JsXLU);
    client.removeAllListeners(P[n(1482)]);
    client["remove" + n(505) + n(1121)](P[n(1006)]);
    client["removeAllLis" + n(1121)]("guildM" + n(755) + "dd");
    client[n(1085) + "AllListeners"](n(1278) + n(1013) + "ionAdd");
    client["removeAllLis" + n(1121)](n(1278) + n(1013) + "ionRem" + n(1474));
    client["remove" + n(505) + n(1121)]("clientReady");
    client[n(1085) + n(505) + "teners"]("error");
    client[n(1085) + "AllListeners"](n(1549));
    try {
      clearAllTimers();
      leaderboardCache[n(939) + "ckgroundUpda" + n(1257)]();
      if (global.musicManager && P.kiWid(typeof global["musicM" + n(780)][n(683) + "pEventListeners"], n(579) + "on")) {
        global["musicM" + n(780)][n(683) + n(1417) + "Listeners"]();
      }
      if (typeof cleanupVoiceTimer === P[n(867)]) {
        if (P[n(653)](n(688), P[n(487)])) {
          N[n(593)]("Failed" + n(1372) + "tch re" + n(1537) + ":", S);
          return;
        }
        var e = require(n(640) + n(1020) + n(1322) + n(550) + n(608))[n(1196) + "pTimers"];
        if (e) {
          for (var [o] of e.entries()) {
            P.URhsv(cleanupVoiceTimer, o);
          }
        }
      }
      if (global[n(659) + "lers"]) {
        for (var t of global["schedu" + n(657)]) {
          if (n(630) === P.RXBrR) {
            N.error(n(1553) + "ot fou" + n(534) + " panel: " + S);
            return;
          }
          if (t[n(1256) + "alId"]) {
            clearInterval(t.intervalId);
          }
        }
      }
      if (P.CJtyn(mongoose[n(1234) + n(1260)][n(866) + n(433)], 0)) {
        await mongoose["connec" + n(1260)][n(1007)]();
      }
      if (client) {
        await client[n(1483) + "y"]();
      }
      process[n(509)](0);
    } catch (e) {
      process[n(509)](1);
    }
  }
  global.xYs123 = async function (r) {
    return true;
  };
  fs.readdir(P[q(1090)], async (e, n) => {
    let r = q;
    if (e) {
      return console.error;
    }
    n[r(491) + "h"](e => {
      var n;
      var o;
      var t = r;
      if (t(1528) === "SlTAB") {
        if (e[t(742) + "th"](".js")) {
          n = require(t(640) + t(1494) + e);
          o = e[t(1386)](".")[0];
          if (typeof n != "function") {
            console.error("[ERROR" + t(767) + "t file '" + e + "' does" + t(1428) + t(1421) + "a function. " + t(966) + t(580));
          } else {
            client.on(o, n.bind(null, client));
          }
        }
      } else {
        e = N[t(549) + "ey"]();
        S[t(1228)](e);
      }
    });
  });
  fs[q(468) + "r"](q(640) + "ts/Mus" + q(892), async (e, n) => {
    if (e) {
      return console.error;
    }
    n.forEach(e => {
      var n = b;
      if (e[n(742) + "th"](n(796))) {
        var o = require(n(640) + n(1126) + n(892) + e);
        var t = e[n(1386)](".")[0];
        if (P[n(633)](typeof o, n(579) + "on")) {
          if (n(1249) === n(1249)) {
            console.error(n(1544) + n(767) + n(1255) + " '" + e + "' does not export " + n(553) + n(1392) + "Skippi" + n(580));
            return;
          }
          e = {
            text: j.Embed.Footer.Text
          };
          if (H[n(1239)][n(565)][n(1088)] && K[n(1239)][n(565)][n(1088)].trim() !== "") {
            e.iconURL = d.Embed[n(565)].Icon;
          }
          V[n(1272) + n(1168)](e);
        }
        client.on(t, o.bind(null, client));
      }
    });
  });
  client.login(config[q(1523) + "en"])[q(967)](e => {
    var n = q;
    if (e.message[n(713) + "es"](n(1332) + n(1361) + n(1475) + n(931))) {
      if (n(736) !== "UuBmm") {
        console[n(1241)](P[n(679)]("\n", colors[n(1262)].red(P.lNCsW)));
        console.log(colors[n(1262)][n(1063)](P[n(1503)]));
        console.log(colors[n(1262)].red(P.lNCsW));
        console[n(1241)](colors.red("│"));
        console[n(1241)](colors.red(P[n(1306)]));
        console[n(1241)](colors[n(1063)]("│"));
        console.log(colors.red(n(908) + "ow to " + n(770) + n(749)));
        console.log(colors[n(1063)](P.Xcrja));
        console.log(colors.red(n(624) + "2. Select your bot appli" + n(928)));
        console[n(1241)](colors.red(P.zAhBB));
        console[n(1241)](colors.red(P[n(1071)]));
        console.log(colors.red("│"));
        console.log(colors[n(1063)](n(1087) + "etaile" + n(1110) + n(1387) + "ps://docs.drakodev" + n(1263) + n(1022) + n(1318) + n(457) + n(1181) + n(1481) + n(1299)));
        console[n(1241)](colors[n(1063)]("│"));
        console[n(1241)](colors.bold[n(1063)]("━━━━━━━━━━━━━━━━━━" + n(566) + n(566) + n(566) + n(566) + "━━━━━━" + n(566) + "━━━━━━━━━━━━━━━━━━\n"));
        process[n(509)]();
      } else {
        S[G] = j;
      }
    } else if (e[n(1278) + "e"].includes("An inv" + n(554) + n(836) + "as pro" + n(1353))) {
      var o = (n(1373) + n(1254) + n(1128) + "|7|2|4" + n(972) + "|14|5|" + n(521))[n(1386)]("|");
      let e = 0;
      while (true) {
        switch (o[e++]) {
          case "0":
            console.log(colors[n(1262)].red(n(566) + n(566) + n(566) + n(566) + n(566) + "━━━━━━━━━━━━━━━━━━━━━━━━" + n(566) + n(566) + n(566) + "\n"));
            continue;
          case "1":
            console.log(colors[n(1262)][n(1063)](n(566) + "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" + n(566) + "━━━━━━━━━━━━" + n(566) + n(566) + n(566)));
            continue;
          case "2":
            console[n(1241)](colors[n(1063)]("│     3. Nav" + n(731) + n(816) + n(486) + n(1497) + "on"));
            continue;
          case "3":
            console.log(colors[n(1063)]("│"));
            continue;
          case "4":
            console.log(colors.red(P[n(1046)]));
            continue;
          case "5":
            console[n(1241)](colors[n(1063)]("│"));
            continue;
          case "6":
            console.log(colors.red("│"));
            continue;
          case "7":
            console[n(1241)](colors[n(1063)](P.twzkj));
            continue;
          case "8":
            console.log(colors[n(1063)](n(1014) + "rror: " + n(476) + n(804) + "n provided is invalid or" + n(811) + "ed"));
            continue;
          case "9":
            console.log(colors.red("│     1. Go " + n(662) + n(1245) + n(1362) + n(1336) + "evelopers/ap" + n(1179) + "ions"));
            continue;
          case "10":
            console.log(colors[n(1063)]("│"));
            continue;
          case "11":
            console.log(colors[n(1262)].red("🔑 BOT " + n(988) + "P FAILED - INVALID TOKEN"));
            continue;
          case "12":
            console.log(colors[n(1063)]("│  🔧 H" + n(1200) + n(770) + "is:"));
            continue;
          case "13":
            process[n(509)]();
            continue;
          case "14":
            console.log(colors[n(1063)](P[n(1471)]));
            continue;
          case "15":
            console.log("\n" + colors[n(1262)].red(P[n(1408)]));
            continue;
          case "16":
            console[n(1241)](colors.red("│     " + n(1138) + "y the " + n(1524) + n(945) + "d upda" + n(718) + n(499) + n(1354) + "ile"));
            continue;
        }
        break;
      }
    } else {
      console[n(1241)]("\n" + colors.bold[n(1063)](P[n(1408)]));
      console[n(1241)](colors.bold[n(1063)](n(1298) + "STARTU" + n(1192) + n(1369) + "NKNOWN" + n(1242)));
      console[n(1241)](colors.bold.red(P.lNCsW));
      console[n(1241)](colors.red("│"));
      console[n(1241)](colors[n(1063)](P.QFPHB));
      console.log(colors.red("│"));
      console[n(1241)](colors[n(1063)](n(1072) + n(585) + "lp?"));
      console[n(1241)](colors[n(1063)]("│     " + n(1290) + "t: dis" + n(1303) + n(1370) + "velopment.net"));
      console[n(1241)](colors[n(1063)](P.mJFdR));
      console.log(colors[n(1063)]("│"));
      console[n(1241)](colors.red("│  📋 Error d" + n(431) + ":"));
      console.log(colors[n(1063)](n(624) + (e.message || P[n(1314)])));
      console.log(colors[n(1063)]("│"));
      console[n(1241)](colors.bold[n(1063)](n(566) + "━━━━━━━━━━━━" + n(566) + "━━━━━━━━━━━━" + n(566) + "━━━━━━" + n(566) + "━━━━━━" + n(566) + "━━━━━━\n"));
      process[n(509)]();
    }
  });
  process.on(q(795), Ee);
  process.on(P.yEkkw, Ee);
  let Te = P.WFlWK(24, 60) * 60 * 1000;
  async function qe() {
    var e;
    var n = q;
    for (e of await Poll.find({
      createdAt: {
        $lt: new Date(Date[n(469)]() - Te)
      }
    })) {
      if (P.FPlqG(n(1008), "jPndp")) {
        H(K, G(j));
      } else {
        client[n(1445)][n(1228)](e["messag" + n(597)]);
        await Poll[n(1228) + "One"]({
          _id: e[n(991)]
        });
      }
    }
  }
  function o() {
    var e = q;
    Date[e(469)]();
    let o = 0;
    interactionDebounce.forEach((e, n) => {
      clearTimeout(e);
      interactionDebounce.delete(n);
      o++;
    });
    o;
  }
  function t() {
    let t = q;
    let o = {
      PDFBo: function (e, n) {
        var o = b;
        return P[o(1335)](e, n);
      }
    };
    let r = Date.now();
    let e = Array[t(424)](U)[t(434)](e => {
      var n;
      var o = t;
      if (P[o(471)](P[o(526)], "ORDSF")) {
        [o, n] = e.split("-");
        return {
          key: e,
          messageId: o,
          userId: n,
          timestamp: P.skYvf(parseInt, o.split("_")[1] || r)
        };
      }
      N.members.forEach(e => {
        if (!e.user.bot) {
          j(e);
        }
      });
    });
    let i = 0;
    e[t(491) + "h"](e => {
      var n = t;
      if (o.PDFBo(r, e[n(1538) + "amp"]) > 30000) {
        if (n(607) !== n(607)) {
          R = false;
        } else {
          U[n(1228)](e.key);
          i++;
        }
      }
    });
    if (U[t(494)] > MAX_BOT_REACTIONS) {
      e.sort((e, n) => e[t(1538) + "amp"] - n["timest" + t(1265)]).slice(0, P.RAobI(U[t(494)], MAX_BOT_REACTIONS)).forEach(e => {
        var n = t;
        U[n(1228)](e.key);
        i++;
      });
    }
    i;
  }
  setInterval(qe, Te);
  let c = async () => {
    var e = q;
    if (P[e(1229)] !== P[e(1229)]) {
      S.error("Error " + e(1323) + e(884) + "bers for gui" + e(792) + G.id + ":", j[e(1278) + "e"]);
    } else {
      try {
        await global[e(1116)](client);
      } catch (e) {
        process.exit(1);
      }
    }
  };
  setInterval(c, 600000);
})();