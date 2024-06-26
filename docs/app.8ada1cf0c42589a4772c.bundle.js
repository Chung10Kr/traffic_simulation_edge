
let i =0;
function wsServer(){
    let svrList = [
        //'43.203.124.142:8001',
        //'43.203.124.142:8002',
        //'43.203.124.142:8003',
        //'43.203.124.142:8004',

        '13.124.210.177:8001',
        '13.124.210.177:8002',
        '13.124.210.177:8003',
        '13.124.210.177:8004',

        '3.36.87.59:8001',
        '3.36.87.59:8002',
        '3.36.87.59:8003',
        '3.36.87.59:8004',
    ];
    let size = svrList.length;
    svr = svrList[i]
    i++;
    if( size == i) i=0;
    return svr;
}

let carNumber=1;
let sockets = {};
let cars = {};
let avgTime = [

]

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

function allInit(){
    maxDiff = 0;
    avgTime = [];
    ws_init();
    //http_init();
}
function createCar(id){
    Ws_createCar(id);
    //Http_createCar(id);
}
function deleteCar(id){
    Ws_deleteCar(id);
    //Http_deleteCar(id);
    cars[id] = null;
}
function activeAccident(id){
    Ws_activeAccident(id)
    //Http_activeAccident(id);
}
function stop(id){
    (cars[id]).broken = !0;
}
async function http_init(){
    await fetch(`http://${wsServer()}/http/init`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
        })
}
function Http_createCar(id){

    var intervalID = setInterval(function(){
        fetch(`http://${wsServer()}/http/isAccident`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
            return response.json()
        })
        .then(receivedData => {
            if(receivedData.target ==null){
                return false;
            }
            //stop(id);
            var now = new Date();
            var currentTimeInSeconds = getCurrentTimeWithMilliseconds();
            var timeDifference = currentTimeInSeconds - receivedData.OCCR_TIME;
            
            // 시간 차이를 소수점 넷째자리까지 반올림합니다.
            var roundedTimeDifference = timeDifference.toFixed(7);

            avgTime.push(roundedTimeDifference/1);

            console.log(`My Car = ${id} 
            Accident Car = ${receivedData.target} 
            Now - Accident Time diff = ${roundedTimeDifference}
            Avg Diff = ${(avgTime.reduce((x,y)=>x+y) / avgTime.length).toFixed(7)}
            sum Avg = ${avgTime.reduce(x,y=>x+y)}
            `); 
            
            clearInterval(intervalID);
        })
    }, 1000);
}
function Http_deleteCar(id){
    
}
function Http_activeAccident(id){
    // 메시지를 JSON 객체로 파싱합니다.
    
    var now = new Date();
    var currentTimeInSeconds = now.getTime() / 1000;
    fetch(`http://${wsServer()}/http/accident?id=${id}&time=${currentTimeInSeconds}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
    })  
}
function ws_init(){
    Object.keys(sockets).forEach(x=>{
        if( !x ) Ws_deleteCar(x['ws']);
    })
}

let maxDiff = 0;
// 카 생성
function Ws_createCar(id){
    
    sockets[id] = {
        'ws' : new WebSocket(`ws://${wsServer()}/ws/message`),
        
    };
    sockets[id]['ws'].onmessage = function(event) {
        
        // 메시지를 JSON 객체로 파싱합니다.
        var now = new Date();
        var currentTimeInSeconds = now.getTime() / 1000;
        
        var frame = JSON.parse(event.data);
        var timeDifference = currentTimeInSeconds - frame.time;
        // 시간 차이를 소수점 넷째자리까지 반올림합니다.
        var roundedTimeDifference = timeDifference.toFixed(7);

        avgTime.push(roundedTimeDifference/1);

        maxDiff = ( maxDiff < roundedTimeDifference ) ? roundedTimeDifference : maxDiff

        console.log(`My Car = ${id} 
From Server = ${sockets[id]['ws'].url}        
Accident Car = ${frame.target} 
Now - Accident Time diff = ${roundedTimeDifference}
Max Diff = ${maxDiff}
Avg Diff = ${(avgTime.reduce((x,y)=>x+y) / avgTime.length).toFixed(7)}
sum Avg = ${avgTime.reduce((x,y)=>x+y)}
`); 
        //stop(id);
    };

    
}
// 카 종료
function Ws_deleteCar(id){
    // 연결을 종료합니다.
    sockets[id]['ws'].close();
};

function Ws_activeAccident(id){
    // 현재 시간을 초 단위로 소수점까지 구합니다.
    var now = new Date();
    var currentTimeInSeconds = now.getTime() / 1000;
    var data = {
        target: id,
        time: currentTimeInSeconds
    };

    (sockets[id]['ws']).send(JSON.stringify(data));
};

function getCurrentTimeWithMilliseconds() {
    var now = new Date();
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');
    var seconds = String(now.getSeconds()).padStart(2, '0');
    var milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
    return hours + minutes + seconds + '.' + milliseconds;
}

  


function getFormattedDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더합니다.
    var day = String(today.getDate()).padStart(2, '0');
  
    return year + month + day;
}





(window.webpackJsonp = window.webpackJsonp || []).push([
    [0], {
        4: function(t, e, n) {},
        5: function(t, e, n) {
            "use strict";
            n.r(e);
            var i = n(0),
                a = n(1);

            function o(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var r = 8,
                s = 13,
                h = 1,
                l = [{
                    wall: "#7ca1bf",
                    window: "#648199"
                }, {
                    wall: "#cb7a4d",
                    window: "#845032"
                }],
                c = function() {
                    function t(e) {
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this.color = l[Math.floor(Math.random() * l.length)], this.mesh = new i.k(new i.a(e.width, e.depth, e.height), [new i.l({
                            map: this.createTexture(e.depth, e.height, 270)
                        }), new i.l({
                            map: this.createTexture(e.depth, e.height, 90)
                        }), new i.l({
                            map: this.createTexture(e.width, e.height, 0)
                        }), new i.l({
                            map: this.createTexture(e.width, e.height, 0)
                        }), new i.l({
                            color: 4473924
                        }), new i.l({
                            color: 4473924
                        })]), this.mesh.position.x = e.x, this.mesh.position.z = e.y, this.mesh.position.y = e.height / 2, this.mesh.rotation.x = -Math.PI / 2
                    }
                    var e, n, a;
                    return e = t, (n = [{
                        key: "createTexture",
                        value: function(t, e, n) {
                            var a = document.createElement("canvas"),
                                o = a.getContext("2d"),
                                l = n * Math.PI / 180;
                            a.width = t * Math.abs(Math.cos(l)) + e * Math.abs(Math.sin(l)), a.height = t * Math.abs(Math.sin(l)) + e * Math.abs(Math.cos(l)), o.translate(a.width / 2, a.height / 2), o.rotate(l), o.translate(-t / 2, -e / 2), o.fillStyle = this.color.wall, o.fillRect(0, 0, t, e), o.fillStyle = this.color.window;
                            var c = r + 2 * h,
                                u = s + 2 * h,
                                d = Math.floor(t / c),
                                f = Math.floor(e / u);
                            if (d >= 1 && f >= 1)
                                for (var g = d * f, y = (t - d * c) / 2, v = (e - f * u) / 2, x = 0; x < g; x++) {
                                    var p = c * (x % d) + h + y,
                                        w = u * Math.floor(x / d) + h + v;
                                    o.fillRect(p, w, r, s)
                                }
                            return new i.c(a)
                        }
                    }]) && o(e.prototype, n), a && o(e, a), t
                }(),
                u = n(2),
                d = 20;

            function f(t, e, n) {
                var a = document.createElement("canvas");
                a.width = t, a.height = e;
                var o = a.getContext("2d");
                return o.fillStyle = "#fff", o.fillRect(0, 0, t, e), o.fillStyle = "#3d3d3d", n.forEach((function(t) {
                    o.fillRect(t.x, t.y, t.w, t.h)
                })), new i.c(a)
            }

            function g() {
                var t = new i.k(new i.a(12, 4, 4), new i.l({
                    color: 0
                }));
                return t.position.z = 2.5, t
            }
            var y = f(80, 40, [{
                    x: 10,
                    y: 0,
                    w: 60,
                    h: 30
                }]),
                v = f(80, 40, [{
                    x: 10,
                    y: 10,
                    w: 60,
                    h: 30
                }]),
                x = f(40, 110, [{
                    x: 10,
                    y: 10,
                    w: 30,
                    h: 50
                }, {
                    x: 10,
                    y: 70,
                    w: 30,
                    h: 30
                }]),
                p = f(40, 110, [{
                    x: 0,
                    y: 10,
                    w: 30,
                    h: 50
                }, {
                    x: 0,
                    y: 70,
                    w: 30,
                    h: 30
                }]);
            var w = {
                    create3dModel: function(t) {
                        var e = new i.g,
                            n = new i.k(new i.a(10, d, 7), new i.l({
                                color: t,
                                flatShading: !0
                            }));
                        n.position.z = 6, e.add(n);
                        var a = new i.k(new i.a(10, 12, 6), [new i.l({
                            color: 13421772,
                            map: x
                        }), new i.l({
                            color: 13421772,
                            map: p
                        }), new i.l({
                            color: 13421772,
                            map: y
                        }), new i.l({
                            color: 13421772,
                            map: v
                        }), new i.l({
                            color: 13421772
                        }), new i.l({
                            color: 13421772
                        })]);
                        a.position.y = -2.5, a.position.z = 12.5, e.add(a);
                        var o = g();
                        o.position.y = -7, e.add(o);
                        var r = g();
                        r.position.y = 7, e.add(r);
                        var s = new i.k(new i.b(10, d, 20), new i.l({
                            color: t,
                            opacity: .5,
                            transparent: !0
                        }));
                        return s.material.visible = !1, s.position.z = 6, s.name = "hitbox", e.add(s), e
                    },
                    carSize: d
                },
                P = {
                    getPointOnLine: function(t, e, n, i, a, o) {
                        var r = t,
                            s = e,
                            h = n,
                            l = i,
                            c = a,
                            u = o,
                            d = c - h,
                            f = u - l,
                            g = d * d + f * f,
                            y = (r - h) * d + (s - l) * f,
                            v = Math.min(1, Math.max(0, y / g));
                        return {
                            point: {
                                x: h + d * v,
                                y: l + f * v
                            },
                            left: (y = (c - h) * (s - l) - (u - l) * (r - h)) < 1,
                            dot: y,
                            t: v
                        }
                    },
                    getTriangleArea: function(t, e, n, i, a, o) {
                        return Math.abs(.5 * (t * (i - o) + n * (o - e) + a * (e - i)))
                    },
                    getLinesIntersection: function(t, e, n, i, a, o, r, s) {
                        var h = arguments.length > 8 && void 0 !== arguments[8] && arguments[8],
                            l = (s - o) * (n - t) - (r - a) * (i - e);
                        if (0 === l) return null;
                        var c = {
                                x: null,
                                y: null,
                                onLine1: !1,
                                onLine2: !1
                            },
                            u = e - o,
                            d = t - a,
                            f = (r - a) * u - (s - o) * d,
                            g = (n - t) * u - (i - e) * d;
                        return u = f / l, d = g / l, c.x = t + u * (n - t), c.y = e + u * (i - e), h ? (u >= 0 && u <= 1 && (c.onLine1 = !0), d >= 0 && d <= 1 && (c.onLine2 = !0)) : (u > 0 && u < 1 && (c.onLine1 = !0), d > 0 && d < 1 && (c.onLine2 = !0)), c
                    },
                    roundNumber: function(t, e) {
                        var n = Number("".concat(t)).toFixed(parseInt(e, 10));
                        return parseFloat(n)
                    },
                    radiansToAngle: function(t) {
                        return t * (180 / Math.PI)
                    },
                    getAnglesDiff: function(t, e) {
                        var n = t - e;
                        return n += n > 180 ? -360 : n < -180 ? 360 : 0
                    },
                    angleToRadians: function(t) {
                        return t * Math.PI / 180
                    },
                    calcAngleDegrees: function(t, e) {
                        return this.roundNumber(this.radiansToAngle(Math.atan2(e, t)), 2)
                    },
                    getRandomInt: function(t, e) {
                        var n = Math.ceil(t),
                            i = Math.floor(e);
                        return Math.floor(Math.random() * (i - n)) + n
                    },
                    getRandomColor: function() {
                        for (var t = "#", e = 0; e < 6; e++) t += "0123456789ABCDEF" [Math.floor(16 * Math.random())];
                        return t
                    },
                    pullPointReferenceToLineWithAngle: function(t, e, n, i, a) {
                        var o = i - n,
                            r = e - t,
                            s = Math.atan2(o, r),
                            h = Math.hypot(r, o);
                        return [e + h * Math.cos(s + a), i + h * Math.sin(s + a)]
                    },
                    loadImage: function(t, e) {
                        var n = new Image;
                        n.onload = function() {
                            e(n)
                        }, n.src = t
                    },
                    checkCollision: function(t, e) {
                        var n, a, o, r = t.geometry.vertices;
                        for (o = 0; o < r.length; o++)
                            if (n = r[o].clone().applyMatrix4(t.parent.matrix).sub(t.parent.position), (a = new i.p(t.parent.position.clone(), n.clone().normalize(), 0, 30).intersectObjects(e)).length > 0 && a[0].distance < n.length()) return a;
                        return []
                    },
                    getPointsDistance: function(t, e, n, i) {
                        return Math.sqrt(Math.pow(n - t, 2) + Math.pow(i - e, 2))
                    }
                },
                m = {
                    tileSize: 50,
                    halfTileSize: 25,
                    quarterTileSize: 12.5,
                    worldWidth: 1250,
                    worldHeight: 1250,
                    colors: {
                        road: "#989899"
                    }
                };

            function b(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var T = new i.l({
                    color: "#222",
                    flatShading: !0
                }),
                k = {
                    deactivate: new i.l({
                        color: "#333",
                        flatShading: !0
                    }),
                    green: new i.l({
                        color: "#01a134",
                        flatShading: !0
                    }),
                    yellow: new i.l({
                        color: "#f8be40",
                        flatShading: !0
                    }),
                    red: new i.l({
                        color: "#b91c1d",
                        flatShading: !0
                    })
                },
                R = function() {
                    function t(e) {
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this.junction = e.junction, this.roadPaths = e.roadPaths, this.x = e.x, this.y = e.y, this.active = !1, this.state = "deactivate", this.lightsMesh = {}, this.hitboxMesh = null, this.mesh = this.createMesh(), this.mesh.position.set(this.x, 0, this.y), this.mesh.rotation.y = P.angleToRadians(-1 * this.roadPaths[0].getAngle() - 90), this.availableRoadPaths = e.availableRoadPaths || []
                    }
                    var e, n, a;
                    return e = t, (n = [{
                        key: "updateMeshs",
                        value: function() {
                            var t = this;
                            Object.keys(this.lightsMesh).forEach((function(e) {
                                t.lightsMesh[e].material = k.deactivate
                            })), "deactivate" !== this.state && (this.lightsMesh[this.state].material = k[this.state])
                        }
                    }, {
                        key: "deactivate",
                        value: function() {
                            this.active = !1, this.state = "deactivate", this.updateMeshs()
                        }
                    }, {
                        key: "activate",
                        value: function(t) {
                            this.active = !0, this.state = t, this.updateMeshs()
                        }
                    }, {
                        key: "createMesh",
                        value: function() {
                            var t = this,
                                e = new i.g,
                                n = m.tileSize / 2,
                                a = new i.k(new i.n(n * this.roadPaths.length, n), new i.l({
                                    opacity: 0,
                                    transparent: !0
                                }));
                            a.position.x = -n * this.roadPaths.length / 2, a.position.y = n / 2, a.name = "traffic_light_hitbox", this.hitboxMesh = a, e.add(a);
                            var o = new i.k(new i.a(16, 1, 1), T);
                            o.position.x = -4.5, o.position.y = 26, e.add(o);
                            var r = new i.k(new i.a(1, 26, 1), T);
                            r.position.x = 3, r.position.y = 13, e.add(r);
                            var s = new i.k(new i.a(14, 4, 3), T);
                            return s.position.x = -11, s.position.y = 26, e.add(s), ["red", "yellow", "green"].forEach((function(n, a) {
                                var o = new i.k(new i.a(2, 2, 2), k[n]);
                                o.position.y = 26, o.position.z = 1, o.position.x = 4 * a - 15, t.lightsMesh[n] = o, e.add(o)
                            })), e
                        }
                    }]) && b(e.prototype, n), a && b(e, a), t
                }();

            function S(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var M = {
                    green: new i.i({
                        color: 4193792
                    }),
                    yellow: new i.i({
                        color: 16632832
                    })
                },
                C = function() {
                    function t(e) {
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this.name = e.name, this.car = e.car, this.angle = e.angle, this.near = e.near, this.far = e.far, this.distance = null, this.collisions = null, this.collisionObj = null, this.raycaster = new i.p, this.raycaster.near = e.near, this.raycaster.far = e.far, this.line = this.createLine()
                    }
                    var e, n, a;
                    return e = t, (n = [{
                        key: "createLine",
                        value: function() {
                            var t = new i.f,
                                e = Math.cos(P.angleToRadians(this.angle + 90)) * this.near,
                                n = Math.sin(P.angleToRadians(this.angle + 90)) * this.near,
                                a = Math.cos(P.angleToRadians(this.angle + 90)) * this.far,
                                o = Math.sin(P.angleToRadians(this.angle + 90)) * this.far;
                            t.vertices.push(new i.u(e, n, 6), new i.u(a, o, 6));
                            var r = new i.h(t, M.green);
                            return r.name = "sensor", r
                        }
                    }, {
                        key: "setLineMaterial",
                        value: function(t) {
                            this.line.material !== t && (this.line.material = t)
                        }
                    }, {
                        key: "isCollidingTrafficLight",
                        value: function() {
                            if (!this.collisions) return !1;
                            for (var t = 0; t < this.collisions.length; t++)
                                if (this.collisions[t] instanceof R) return !0;
                            return !1
                        }
                    }, {
                        key: "reset",
                        value: function() {
                            this.setLineMaterial(M.green), this.distance = null, this.collisions = null, this.collisionObj = null
                        }
                    }, {
                        key: "update",
                        value: function(t) {
                            var e = t.map((function(t) {
                                    return t.hitboxMesh
                                })),
                                n = this.line.geometry.vertices[1].clone().applyMatrix4(this.car.mesh.matrix).sub(this.car.mesh.position);
                            this.raycaster.set(this.car.mesh.position.clone(), n.clone().normalize());
                            var i = this.raycaster.intersectObjects(e);
                            if (i.length) {
                                var a = i.reduce((function(t, e) {
                                    return !t || e.distance < t.distance ? e : t
                                }));
                                this.collisions = i.map((function(n) {
                                    return t[e.indexOf(n.object)]
                                })), this.collisionObj = t[e.indexOf(a.object)], this.distance = a.distance, this.setLineMaterial(M.yellow)
                            } else this.reset()
                        }
                    }]) && S(e.prototype, n), a && S(e, a), t
                }();

            function A(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var N = new(function() {
                function t() {
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.routes = []
                }
                var e, n, i;
                return e = t, i = [{
                    key: "findLowestCostNode",
                    value: function(t, e) {
                        return Object.keys(t).reduce((function(n, i) {
                            var a = n;
                            return null !== a || e.includes(i) || (a = i), t[i] < t[a] && !e.includes(i) && (a = i), a
                        }), null)
                    }
                }, {
                    key: "dijkstra",
                    value: function(e) {
                        var n = Object.assign({
                                finish: 1 / 0
                            }, e.start),
                            i = {
                                finish: null
                            };
                        Object.keys(e.start).forEach((function(t) {
                            i[t] = "start"
                        }));
                        for (var a = [], o = t.findLowestCostNode(n, a), r = function() {
                                var r = n[o],
                                    s = e[o];
                                Object.keys(s).forEach((function(t) {
                                    var e = s[t],
                                        a = r + e;
                                    (!n[t] || n[t] > a) && (n[t] = a, i[t] = o)
                                })), a.push(o), o = t.findLowestCostNode(n, a)
                            }; o;) r();
                        for (var s = ["finish"], h = i.finish; h;) s.push(h), h = i[h];
                        return s.reverse(), {
                            distance: n.finish,
                            path: s
                        }
                    }
                }, {
                    key: "createDijkstraGraph",
                    value: function(t, e) {
                        var n = t.roadPath.way.nodes[0],
                            i = e.roadPath.way.nodes[e.roadPath.way.nodes.length - 1],
                            a = {};
                        return {
                            graph: function t(e, n, o) {
                                var r = e.name;
                                return o && (r = o), e === i && (r = "finish"), !a[r] && (a[r] = e, n[r] = {}, e.nextNodes.forEach((function(a) {
                                    n[r][a !== i ? a.name : "finish"] = P.getPointsDistance(e.x, e.y, a.x, a.y), t(a, n)
                                })), n)
                            }(n, {}, "start"),
                            ref: a
                        }
                    }
                }], (n = [{
                    key: "getCachedRoute",
                    value: function(t, e) {
                        return this.routes.find((function(n) {
                            return n.startPoint === t && n.endPoint === e
                        }))
                    }
                }, {
                    key: "findBestRoute",
                    value: function(e, n) {
                        var i = this.getCachedRoute(e, n);
                        if (i) return i.route;
                        var a = t.createDijkstraGraph(e, n),
                            o = t.dijkstra(a.graph).path.map((function(t) {
                                return a.ref[t]
                            })),
                            r = o.map((function(t, i) {
                                if (0 === i) return e;
                                if (i === o.length - 1) return n;
                                var a = o[i + 1];
                                return t.way !== a.way ? t.roadPathNode : null
                            })).filter((function(t) {
                                return null !== t
                            }));
                        return this.routes.push({
                            startPoint: e,
                            endPoint: n,
                            route: r
                        }), r
                    }
                }]) && A(e.prototype, n), i && A(e, i), t
            }());

            function E(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var L = function() {
                function t(e) {
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.x = parseInt(e.x, 10), this.y = parseInt(e.y, 10), this.vector3 = new i.u(this.x, 0, this.y), this.nextPoints = [], this.roadPath = e.roadPath || null, this.maxSpeed = e.maxSpeed || null, this.direction = e.direction || null, this.laneChange = e.laneChange || !1, this.beforeLaneChange = e.beforeLaneChange || !1, this.transferTo = e.transferTo || null
                }
                var e, n, a;
                return e = t, (n = [{
                    key: "getBefore",
                    value: function() {
                        var t = this;
                        return this.roadPath.find((function(e) {
                            return -1 !== e.nextPoints.indexOf(t)
                        }))
                    }
                }, {
                    key: "addBefore",
                    value: function(t) {
                        if (this.roadPath) {
                            var e = this.getBefore();
                            t.addNextPoint(this), e.replaceNextPoint(this, t)
                        }
                    }
                }, {
                    key: "replaceNextPoint",
                    value: function(t, e) {
                        var n = this.nextPoints.indexOf(t); - 1 !== n && this.nextPoints.splice(n, 1, e)
                    }
                }, {
                    key: "removeNextPoint",
                    value: function(t) {
                        var e = this.nextPoints.indexOf(t); - 1 !== e && this.nextPoints.splice(e, 1)
                    }
                }, {
                    key: "addNextPoint",
                    value: function(t) {
                        -1 === this.nextPoints.indexOf(t) && this.nextPoints.push(t)
                    }
                }]) && E(e.prototype, n), a && E(e, a), t
            }();

            function z(t) {
                return function(t) {
                    if (Array.isArray(t)) {
                        for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
                        return n
                    }
                }(t) || function(t) {
                    if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
                }(t) || function() {
                    throw new TypeError("Invalid attempt to spread non-iterable instance")
                }()
            }

            function I(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var O = {
                    ways: {
                        even: "#ff0000",
                        odd: "#ff00ff"
                    }
                },
                j = function() {
                    function t(e) {
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this.name = e.name, this.way = e.way, this.order = e.order, this.road = e.road, this.initPoint = null
                    }
                    var e, n, i;
                    return e = t, i = [{
                        key: "getPathUntilNode",
                        value: function(t, e) {
                            var n = function t(n) {
                                var i, a, o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
                                if (n === e) return o.push(n), o;
                                if (!n.nextPoints.length) return null;
                                for (var r = 0; r < n.nextPoints.length; r++) {
                                    if ((i = n.nextPoints[r]).roadPath !== n.roadPath) return null;
                                    if (a = t(i, [].concat(z(o), [n]))) return a
                                }
                                return null
                            }(t);
                            return 0 === n.length ? null : n
                        }
                    }], (n = [{
                        key: "addPoint",
                        value: function(t) {
                            t.roadPath = this, this.initPoint ? this.getDeepestPoint().addNextPoint(t) : this.initPoint = t
                        }
                    }, {
                        key: "getAngle",
                        value: function() {
                            var t = this.initPoint.nextPoints[0].x - this.initPoint.x,
                                e = this.initPoint.nextPoints[0].y - this.initPoint.y;
                            return P.calcAngleDegrees(t, -1 * e)
                        }
                    }, {
                        key: "find",
                        value: function(t) {
                            return function e(n) {
                                if (t(n)) return n;
                                for (var i, a = n.nextPoints.length, o = 0; o < a; o++)
                                    if ((i = n.nextPoints[o]).roadPath.name === n.roadPath.name) {
                                        var r = e(i);
                                        if (r) return r
                                    } return null
                            }(this.initPoint)
                        }
                    }, {
                        key: "createNodeOnLineIntersection",
                        value: function(t) {
                            var e = this.initPoint,
                                n = this.getDeepestPoint(),
                                i = P.getLinesIntersection(e.x, e.y, n.x, n.y, t[0].x, t[0].y, t[1].x, t[1].y, !0);
                            if (!i) return null;
                            var a = new L({
                                x: i.x,
                                y: i.y,
                                roadPath: this
                            });
                            return this.getNextNodeFrom(i.x, i.y).addBefore(a), a
                        }
                    }, {
                        key: "getDeepestPoint",
                        value: function() {
                            return this.find((function(t) {
                                return 0 === t.nextPoints.length
                            }))
                        }
                    }, {
                        key: "getClosestPoint",
                        value: function(t, e) {
                            var n, i = null,
                                a = null;
                            return this.find((function(o) {
                                return n = Math.sqrt(Math.pow(t - o.x, 2) + Math.pow(e - o.y, 2)), (!i || n < a) && (a = n, i = o), !1
                            })), i
                        }
                    }, {
                        key: "getPathToAnyEndPoint",
                        value: function() {
                            return function t(e, n) {
                                return n.push(e), e.nextPoints.length ? t(e.nextPoints[P.getRandomInt(0, e.nextPoints.length)], n) : n
                            }(this.initPoint, [])
                        }
                    }, {
                        key: "getPointPreviousPoint",
                        value: function(t) {
                            return this.find((function(e) {
                                return -1 !== e.nextPoints.indexOf(t)
                            }))
                        }
                    }, {
                        key: "addPointAt",
                        value: function(t, e) {
                            t.roadPath = this, this.points.splice(e, 0, t)
                        }
                    }, {
                        key: "drawDetailsOnCanvas",
                        value: function(t) {
                            var e = this.way;
                            t.translate(m.worldWidth / 2 * 2, m.worldHeight / 2 * 2), t.beginPath(), t.strokeStyle = O.ways[e.type],
                                function e(n) {
                                    n.nextPoints.forEach((function(i) {
                                        n.roadPath.name === i.roadPath.name && (t.moveTo(2 * n.x, 2 * n.y), t.lineTo(2 * i.x, 2 * i.y), e(i))
                                    }))
                                }(this.initPoint), t.stroke(), t.closePath();
                            var n, i, a = this.initPoint.nextPoints[0].x - this.initPoint.x,
                                o = this.initPoint.nextPoints[0].y - this.initPoint.y,
                                r = P.calcAngleDegrees(a, o);
                            ! function a(o) {
                                o.nextPoints.length && (t.beginPath(), t.fillStyle = O.ways[e.type], n = o.x + Math.sin(P.angleToRadians(r)) * (m.tileSize / 12), i = o.y + Math.cos(P.angleToRadians(r)) * (m.tileSize / 12), t.moveTo(2 * n, 2 * i), n = o.x - Math.sin(P.angleToRadians(r)) * (m.tileSize / 12), i = o.y - Math.cos(P.angleToRadians(r)) * (m.tileSize / 12), t.lineTo(2 * n, 2 * i), n = o.x + Math.cos(P.angleToRadians(r)) * (m.tileSize / 8), i = o.y + Math.sin(P.angleToRadians(r)) * (m.tileSize / 8), t.lineTo(2 * n, 2 * i), t.fill(), t.closePath(), o.nextPoints.forEach((function(t) {
                                    o.roadPath.name === t.roadPath.name && a(t)
                                })))
                            }(this.initPoint), t.textAlign = "center", t.font = "11px Verdana", t.fillStyle = "#000", t.fillText(this.name, this.initPoint.x, this.initPoint.y + 10), t.resetTransform()
                        }
                    }, {
                        key: "getNextNodeFrom",
                        value: function(t, e) {
                            var n, i, a, o, r = null;
                            return function s(h) {
                                return !!h.nextPoints.length && (n = P.calcAngleDegrees(t - h.x, e - h.y), i = P.calcAngleDegrees(t - h.nextPoints[0].x, e - h.nextPoints[0].y), a = Math.abs(P.getAnglesDiff(n, i)), (!o || a > o) && (o = a, r = h.nextPoints[0]), s(h.nextPoints[0]))
                            }(this.initPoint), r
                        }
                    }, {
                        key: "drawOnCanvas",
                        value: function(t) {
                            if (0 !== this.order) {
                                var e = this.getAngle(),
                                    n = Math.sin(P.angleToRadians(e)) * m.quarterTileSize,
                                    i = Math.cos(P.angleToRadians(e)) * m.quarterTileSize;
                                t.translate(m.worldWidth / 2 * 2, m.worldHeight / 2 * 2), t.beginPath();
                                var a = this.initPoint.x - n - Math.sin(P.angleToRadians(e + 90)) * m.halfTileSize,
                                    o = this.initPoint.y - i - Math.cos(P.angleToRadians(e + 90)) * m.halfTileSize;
                                t.moveTo(2 * a, 2 * o),
                                    function a(o) {
                                        if (!o.nextPoints.length) {
                                            var r = {
                                                x: o.x - n - Math.sin(P.angleToRadians(e - 90)) * m.halfTileSize,
                                                y: o.y - i - Math.cos(P.angleToRadians(e - 90)) * m.halfTileSize
                                            };
                                            return t.lineTo(2 * r.x, 2 * r.y), !1
                                        }
                                        return t.lineTo(2 * (o.x - n), 2 * (o.y - i)), a(o.nextPoints[0])
                                    }(this.initPoint.nextPoints[0]), t.lineWidth = 1, t.setLineDash([10, 15]), t.strokeStyle = "#fff", t.stroke(), t.closePath(), t.setLineDash([]), t.resetTransform()
                            }
                        }
                    }]) && I(e.prototype, n), i && I(e, i), t
                }();

            function D(t) {
                return function(t) {
                    if (Array.isArray(t)) {
                        for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
                        return n
                    }
                }(t) || function(t) {
                    if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
                }(t) || function() {
                    throw new TypeError("Invalid attempt to spread non-iterable instance")
                }()
            }

            function W(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var q = 2 * w.carSize + 5,
                B = function() {
                    function t(e) {
                        var n = this;
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t);
                        var i = e.position,
                            a = e.angle;
                        this.carId = e.carId;
                        this.broken = !1, this.position = {
                            x: 0,
                            y: 0
                        }, this.state = null, this.handleAngle = 0, this.color = P.getRandomColor(), this.mesh = w.create3dModel(this.color), this.hitboxMesh = this.mesh.children.find((function(t) {
                            return "hitbox" === t.name
                        })), this.mesh.rotation.x = -Math.PI / 2, this.setPosition(i.x, i.y), this.setAngle(a), this.route = [], this.routeIdx = null, this.detailedRoute = [], this.detailedRouteIdx = null, this.navigation = N, this.currentRouteTargetNode = null, this.currentRoadPath = null, this.leftVelocity = 0, this.changingLane = !1, this.transferingToPath = null, this.velocity = 0, this.brakePower = .07, this.accelerationPower = .01, this.maxVelocity = P.getRandomInt(11, 14) / 10, this.callbacks = {
                            onBrake: function() {},
                            onArrival: function() {}
                        }, this.sensors = {};
                        var o = 7,
                            r = w.carSize / 2,
                            s = this.getStoppingDistance(this.maxVelocity) + w.carSize / 2 + 5;
                        [
                            ["front", 0, r, this.getStoppingDistance(this.maxVelocity) + w.carSize / 2 + 20],
                            ["fleft", 30, o + 5, s + 5],
                            ["fright", -30, o + 5, s + 5],
                            ["left", 75, o, s],
                            ["right", -75, o, s]
                        ].forEach((function(t) {
                            n.sensors[t[0]] = new C({
                                name: t[0],
                                car: n,
                                angle: t[1],
                                near: t[2],
                                far: t[3]
                            })
                        }))
                    }
                    var e, n, a;
                    return e = t, (n = [{
                        key: "showSensorsLights",
                        value: function() {
                            this.mesh.add(this.sensors.front.line), this.mesh.add(this.sensors.left.line), this.mesh.add(this.sensors.right.line), this.mesh.add(this.sensors.fleft.line), this.mesh.add(this.sensors.fright.line)
                        }
                    }, {
                        key: "getLeftDistanceToEnd",
                        value: function() {
                            for (var t = this.mesh.position.distanceTo(this.route[this.routeIdx].vector3), e = this.routeIdx + 1; e < this.route.length; e++) t += this.route[e - 1].vector3.distanceTo(this.route[e].vector3);
                            return t
                        }
                    }, {
                        key: "getStoppingDistance",
                        value: function(t) {
                            for (var e = t, n = 0; e > 0;) n += e -= this.brakePower;
                            return n
                        }
                    }, {
                        key: "setPosition",
                        value: function(t, e) {
                            this.position.x = t, this.position.y = e, this.mesh.position.set(t, 0, e)
                        }
                    }, {
                        key: "setAngle",
                        value: function(t) {
                            this.angle = t, this.mesh.rotation.z = P.angleToRadians(this.angle - 90)
                        }
                    }, {
                        key: "calculateNextPosition",
                        value: function() {
                            var t = this.detailedRoute[this.detailedRouteIdx],
                                e = this.position,
                                n = e.x,
                                i = e.y,
                                a = P.getPointsDistance(n, i, t.x, t.y),
                                o = P.angleToRadians(this.angle),
                                r = this.leftVelocity ? this.leftVelocity : this.velocity;
                            if (a < r) return r = a, this.leftVelocity = r - a, this.setPosition(t.x, t.y), void this.update();
                            var s = P.roundNumber(n + Math.cos(o) * r, 1),
                                h = P.roundNumber(i - Math.sin(o) * r, 1);
                            this.setPosition(s, h), this.leftVelocity && (this.leftVelocity = 0)
                        }
                    }, {
                        key: "setRoute",
                        value: function(t, e) {
                            this.route = t, this.routeIdx = 0, this.currentRoadPath = this.route[this.routeIdx].roadPath, this.updateDetailedRoute(), this.callbacks.onArrival = e.onArrival, this.callbacks.onBrake = e.onBrake
                        }
                    }, {
                        key: "accelerate",
                        value: function(t) {
                            var e = this.detailedRoute[this.detailedRouteIdx].maxSpeed,
                                n = this.velocity + this.accelerationPower;
                            e && this.velocity > e ? this.brake(e) : (e && n > e && (n = e), t && n > t && (n = t), n > this.maxVelocity && (n = this.maxVelocity), this.velocity = n)
                        }
                    }, {
                        key: "adjustVelocity",
                        value: function(t) {
                            t < this.velocity ? this.brake(t) : this.accelerate(t)
                        }
                    }, {
                        key: "brake",
                        value: function(t) {
                            var e = this.velocity - this.brakePower;
                            this.velocity = t && e < t ? t : e < 0 ? 0 : e
                        }
                    }, {
                        key: "onArriveDetailedRoute",
                        value: function() {
                            var t = this.detailedRoute[this.detailedRouteIdx],
                                e = this.detailedRoute[this.detailedRouteIdx + 1];
                            if (!e) return this.changingLane = !1, void this.onArriveRoute();
                            this.detailedRouteIdx++, this.changingLane = e.laneChange || e.beforeLaneChange;
                            var n = e.nextPoints[0] && e.roadPath.way !== e.nextPoints[0].roadPath.way;
                            this.changingWay = n ? e.nextPoints[0].roadPath.way : null, t.laneChange && (this.currentRoadPath = t.roadPath), e.transferTo && (this.transferingToPath = e.transferTo), this.transferingToPath === this.currentRoadPath && (this.transferingToPath = null)
                        }
                    }, {
                        key: "onArriveRoute",
                        value: function() {
                            var t = this,
                                e = this.route[this.routeIdx],
                                n = this.route[this.routeIdx + 1];
                            if (!n) return this.route = [], this.routeIdx = null, this.detailedRoute = [], this.detailedRouteIdx = null, void setTimeout((function() {
                                t.callbacks.onArrival(t)
                            }));
                            if (this.routeIdx++, e.roadPath.way !== n.roadPath.way) {
                                var i = e.nextPoints[0];
                                return this.currentRoadPath = i.roadPath, void this.updateDetailedRoute(i)
                            }
                            this.updateDetailedRoute(e)
                        }
                    }, {
                        key: "break",
                        value: function() {
                            if (!this.broken) {
                                var t = this,
                                    e = {
                                        gray: new i.l({
                                            color: 11447982
                                        }),
                                        black: new i.l({
                                            color: 2236962
                                        })
                                    },
                                    n = new i.d(e.gray.color.getHex()),
                                    a = new i.d(e.black.color.getHex());
                                u.a.to(n, 1, {
                                    r: a.r,
                                    g: a.g,
                                    b: a.b,
                                    onUpdate: function() {
                                        t.mesh.children.forEach((function(t) {
                                            "sensor" !== t.name && (t.material.color = n)
                                        }))
                                    },
                                    onComplete: function() {
                                        t.callbacks.onBrake(t)
                                    }
                                }), this.broken = !0
                            }
                        }
                    }, {
                        key: "resetSensors",
                        value: function() {
                            var t = this;
                            Object.keys(this.sensors).forEach((function(e) {
                                return t.sensors[e].reset()
                            }))
                        }
                    }, {
                        key: "checkCollision",
                        value: function(e) {
                            if (!this.broken && null !== this.routeIdx) {
                                this.resetSensors();
                                var n = e.filter((function(t) {
                                        return !(t instanceof R && "red" !== t.state)
                                    })).map((function(t) {
                                        return t.hitboxMesh
                                    })),
                                    i = P.checkCollision(this.hitboxMesh, n);
                                i.length && (this.break(), i.forEach((function(t) {
                                    "traffic_light_hitbox" !== t.object.name && e[n.indexOf(t.object)].break()
                                })));
                                var a = this.detailedRoute[this.detailedRouteIdx],
                                    o = [this.currentRoadPath.way];
                                this.changingWay && o.push(this.changingWay);
                                var r = e.filter((function(e) {
                                    return !(e instanceof t) || e instanceof t && -1 !== o.indexOf(e.currentRoadPath.way) || e instanceof t && e.changingWay
                                }));
                                if (this.sensors.front.update(r), this.sensors.fleft.update(r), this.sensors.fright.update(r), a.beforeLaneChange && (a = this.detailedRoute[this.detailedRouteIdx + 1]), a.laneChange) {
                                    var s = e.filter((function(e) {
                                        return e instanceof t && e.currentRoadPath === a.roadPath
                                    }));
                                    this.sensors[a.direction].update(s)
                                }
                            }
                        }
                    }, {
                        key: "setAngleTo",
                        value: function(t, e) {
                            var n = this.position,
                                i = n.x,
                                a = n.y,
                                o = P.roundNumber(t - i, 1),
                                r = P.roundNumber(-1 * (e - a), 1),
                                s = P.calcAngleDegrees(o, r);
                            s !== this.angle && this.setAngle(s)
                        }
                    }, {
                        key: "updateDetailedRoute",
                        value: function(t) {
                            var e = this.route[this.routeIdx];
                            return t ? e.roadPath !== this.currentRoadPath ? (this.detailedRoute = this.getChangeLaneRoute(e.roadPath.order > this.currentRoadPath.order ? "right" : "left"), void(this.detailedRouteIdx = 0)) : (this.detailedRoute = j.getPathUntilNode(t, this.route[this.routeIdx]), void(this.detailedRouteIdx = 0)) : (this.detailedRoute = [this.route[this.routeIdx]], void(this.detailedRouteIdx = 0))
                        }
                    }, {
                        key: "isInFrontOfMe",
                        value: function(t) {
                            var e = P.getPointsDistance(this.position.x, this.position.y, this.currentRoadPath.initPoint.x, this.currentRoadPath.initPoint.y);
                            return P.getPointsDistance(t.position.x, t.position.y, t.currentRoadPath.initPoint.x, t.currentRoadPath.initPoint.y) > e
                        }
                    }, {
                        key: "hasFrontSensorActivate",
                        value: function() {
                            return null !== this.sensors.front.distance
                        }
                    }, {
                        key: "hasFrontDiagSensorActivate",
                        value: function() {
                            for (var e = [this.sensors.fleft, this.sensors.fright], n = 0; n < e.length; n++)
                                if (null !== e[n].distance && e[n].collisionObj instanceof t && (0 !== e[n].collisionObj.velocity && e[n].distance > q || this.currentRoadPath === e[n].collisionObj.currentRoadPath || this.isInFrontOfMe(e[n].collisionObj))) return !0;
                            return !1
                        }
                    }, {
                        key: "hasSideSensorActivate",
                        value: function() {
                            var e = [this.sensors.left, this.sensors.right],
                                n = null,
                                i = null;
                            return e.forEach((function(t) {
                                null !== t.distance && (!n || t.distance < n) && (n = (i = t).distance)
                            })), !!(i && i.collisionObj instanceof t && (0 !== i.collisionObj.velocity || i.collisionObj.changingLane && this.isInFrontOfMe(i.collisionObj)))
                        }
                    }, {
                        key: "calculateCarReaction",
                        value: function() {
                            var t = this.getLeftDistanceToEnd(),
                                e = this.getStoppingDistance(this.velocity),
                                n = this.detailedRoute[this.detailedRouteIdx];
                            if (this.setAngleTo(n.x, n.y), this.hasFrontSensorActivate() || this.hasFrontDiagSensorActivate() || this.hasSideSensorActivate() || t <= e) return this.brake(), void(this.velocity && this.setAngleTo(n.x, n.y));
                            this.setAngleTo(n.x, n.y), this.accelerate()
                        }
                    }, {
                        key: "getChangeLaneRoute",
                        value: function(t) {
                            var e = this.route[this.routeIdx].roadPath,
                                n = "right" === t ? -1 : 1,
                                i = this.currentRoadPath.getAngle(),
                                a = i + 45 * n;
                            a > 180 && (a = -360 + a), a < -180 && (a = 360 + a);
                            var o, r, s, h = this.position,
                                l = h.x,
                                c = h.y,
                                u = Math.abs(this.currentRoadPath.order - e.order),
                                d = [];
                            d.push(new L({
                                x: l + Math.cos(P.angleToRadians(i)) * (2 * w.carSize),
                                y: c + Math.sin(P.angleToRadians(-1 * i)) * (2 * w.carSize),
                                roadPath: this.currentRoadPath,
                                beforeLaneChange: !0
                            }));
                            for (var f = {
                                    x: d[0].x + 10 * Math.cos(P.angleToRadians(a)),
                                    y: d[0].y + 10 * Math.sin(P.angleToRadians(-1 * a))
                                }, g = 1; g <= u; g++) r = (o = this.currentRoadPath.way.lanes[this.currentRoadPath.order + n * g * -1]).getDeepestPoint(), s = P.getLinesIntersection(d[0].x, d[0].y, f.x, f.y, o.initPoint.x, o.initPoint.y, r.x, r.y), d.push(new L({
                                x: s.x,
                                y: s.y,
                                roadPath: o,
                                direction: t,
                                laneChange: !0,
                                maxSpeed: .8
                            }));
                            var y = d[d.length - 1],
                                v = e.getNextNodeFrom(y.x, y.y);
                            return [].concat(d, D(j.getPathUntilNode(v, this.route[this.routeIdx])))
                        }
                    }, {
                        key: "update",
                        value: function() {
                            if (!this.broken && null !== this.routeIdx) {
                                var t = this.detailedRoute[this.detailedRouteIdx];
                                P.getPointsDistance(t.x, t.y, this.position.x, this.position.y) <= this.maxVelocity && this.onArriveDetailedRoute(), null !== this.routeIdx && (this.calculateCarReaction(), this.calculateNextPosition())
                            }
                        }
                    }]) && W(e.prototype, n), a && W(e, a), t
                }();

            function F(t, e) {
                return function(t) {
                    if (Array.isArray(t)) return t
                }(t) || function(t, e) {
                    if (!(Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t))) return;
                    var n = [],
                        i = !0,
                        a = !1,
                        o = void 0;
                    try {
                        for (var r, s = t[Symbol.iterator](); !(i = (r = s.next()).done) && (n.push(r.value), !e || n.length !== e); i = !0);
                    } catch (t) {
                        a = !0, o = t
                    } finally {
                        try {
                            i || null == s.return || s.return()
                        } finally {
                            if (a) throw o
                        }
                    }
                    return n
                }(t, e) || function() {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }()
            }

            function _(t) {
                return function(t) {
                    if (Array.isArray(t)) {
                        for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
                        return n
                    }
                }(t) || function(t) {
                    if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
                }(t) || function() {
                    throw new TypeError("Invalid attempt to spread non-iterable instance")
                }()
            }

            function V(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }

            function H(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }
            var G = function t(e) {
                    H(this, t), this.x = e.x, this.y = e.y, this.way = e.way, this.name = "".concat(e.way.road.name, "_").concat(e.way.type, "_").concat(this.x, "_").concat(this.y), this.roadPathNode = e.roadPathNode || null, this.isTransfer = e.isTransfer || !1, this.nextNodes = []
                },
                J = function() {
                    function t(e) {
                        H(this, t), this.type = e.type, this.road = e.road, this.lanes = [], this.nodes = [], this.transferNodes = []
                    }
                    var e, n, i;
                    return e = t, i = [{
                        key: "getClosestNodeOnList",
                        value: function(t, e, n) {
                            var i, a, o = null;
                            return t.forEach((function(t) {
                                i = P.getPointsDistance(e, n, t.x, t.y), (!a || i < a) && (a = i, o = t)
                            })), o
                        }
                    }], (n = [{
                        key: "getAllNodes",
                        value: function() {
                            return [].concat(_(this.nodes), _(this.transferNodes))
                        }
                    }, {
                        key: "getNextNodeFrom",
                        value: function(t, e, n) {
                            var i, a, o = this.nodes[0],
                                r = P.getPointsDistance(t, e, o.x, o.y) + n,
                                s = null;
                            return this.getAllNodes().forEach((function(t) {
                                (i = P.getPointsDistance(t.x, t.y, o.x, o.y)) <= r || (!a || i < a) && (a = i, s = t)
                            })), s
                        }
                    }, {
                        key: "getAngle",
                        value: function() {
                            var t = this.nodes[1].x - this.nodes[0].x,
                                e = this.nodes[1].y - this.nodes[0].y;
                            return P.calcAngleDegrees(t, e)
                        }
                    }, {
                        key: "addNode",
                        value: function(t, e) {
                            var n = new G({
                                way: this,
                                x: t,
                                y: e
                            });
                            return this.nodes.push(n), n
                        }
                    }, {
                        key: "addTransferNode",
                        value: function(t, e, n) {
                            var i = new G({
                                way: this,
                                x: t,
                                y: e,
                                roadPathNode: n,
                                isTransfer: !0
                            });
                            return this.transferNodes.push(i), i
                        }
                    }, {
                        key: "updateNextNodes",
                        value: function() {
                            if (this.transferNodes.length) {
                                for (var e, n = _(this.transferNodes), i = this.nodes[0]; n.length > 0;) e = t.getClosestNodeOnList(n, i.x, i.y), i.nextNodes.push(e), i = F(n.splice(n.indexOf(e), 1), 1)[0];
                                i.nextNodes.push(this.nodes[1])
                            } else this.nodes[0].nextNodes.push(this.nodes[1])
                        }
                    }, {
                        key: "getClosestTransferNode",
                        value: function(e, n) {
                            return t.getClosestNodeOnList(this.transferNodes, e, n)
                        }
                    }, {
                        key: "getTransferNodes",
                        value: function() {
                            return this.transferNodes
                        }
                    }, {
                        key: "getExitNode",
                        value: function() {
                            return this.nodes[this.nodes.length - 1]
                        }
                    }, {
                        key: "getClosestNode",
                        value: function(e, n) {
                            return t.getClosestNodeOnList(this.nodes, e, n)
                        }
                    }, {
                        key: "drawOnCanvas",
                        value: function(t) {
                            t.translate(m.worldWidth / 2 * 2, m.worldHeight / 2 * 2), this.getAllNodes().forEach((function(e) {
                                    t.beginPath(), t.fillStyle = "#bb00f5", t.arc(2 * e.x, 2 * e.y, 3, 0, 2 * Math.PI), t.lineWidth = 1, t.fill(), t.closePath()
                                })), t.beginPath(), t.lineWidth = 1, t.strokeStyle = "#bb00f5",
                                function e(n) {
                                    n.nextNodes.forEach((function(i) {
                                        n.way === i.way && (t.moveTo(2 * n.x, 2 * n.y), t.lineTo(2 * i.x, 2 * i.y), e(i))
                                    }))
                                }(this.nodes[0]), t.stroke(), t.closePath(), t.resetTransform()
                        }
                    }]) && V(e.prototype, n), i && V(e, i), t
                }();

            function U(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var X = function() {
                function t(e, n, i) {
                    var a = this;
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.roads = e, this.x = n, this.y = i, this.trafficLights = [], this.transferNodes = [], this.roads.forEach((function(t, n) {
                        t.ways.forEach((function(i) {
                            var o = e[0 === n ? 1 : 0];
                            a.createLeftCurve(t, o, i.lanes[0]), a.createRightCurve(t, o, i.lanes[i.lanes.length - 1]), a.createTrafficLight(t, o, i)
                        }))
                    })), this.transferNodes.forEach((function(t) {
                        var e = t.roadPath.way,
                            n = P.getPointOnLine(t.x, t.y, e.nodes[0].x, e.nodes[0].y, e.nodes[1].x, e.nodes[1].y);
                        e.addTransferNode(n.point.x, n.point.y, t)
                    }))
                }
                var e, n, i;
                return e = t, (n = [{
                    key: "connectWayTransfers",
                    value: function() {
                        this.roads.forEach((function(t) {
                            t.ways.forEach((function(t) {
                                t.transferNodes.forEach((function(t) {
                                    if (!t.nextNodes.length) {
                                        var e = t.roadPathNode.nextPoints[0],
                                            n = e.roadPath.way.getNextNodeFrom(e.x, e.y, t.way.lanes.length * m.halfTileSize);
                                        t.nextNodes.push(n)
                                    }
                                }))
                            }))
                        }))
                    }
                }, {
                    key: "createTrafficLight",
                    value: function(t, e, n) {
                        var i = t.getWay("even").lanes.length * m.halfTileSize,
                            a = e.getWay("even").lanes.length * m.halfTileSize,
                            o = n.lanes[0].getAngle(),
                            r = this.x - Math.cos(P.angleToRadians(o)) * a,
                            s = this.y - Math.sin(P.angleToRadians(o)) * a,
                            h = {
                                x: r - Math.cos(P.angleToRadians(o - 90)) * i,
                                y: s - Math.sin(P.angleToRadians(o - 90)) * i
                            },
                            l = [];
                        if (n.lanes.length) {
                            var c = n.lanes[n.lanes.length - 1],
                                u = this.transferNodes.find((function(t) {
                                    return t.roadPath === c
                                }));
                            l.push(u.nextPoints[0].roadPath)
                        }
                        var d = new R({
                            junction: this,
                            x: h.x,
                            y: h.y,
                            roadPaths: n.lanes,
                            availableRoadPaths: l
                        });
                        this.trafficLights.push(d)
                    }
                }, {
                    key: "createLeftCurve",
                    value: function(t, e, n) {
                        var i = t.getWay("even").lanes.length * m.halfTileSize,
                            a = e.getWay("even").lanes.length * m.halfTileSize,
                            o = n.getAngle(),
                            r = [{
                                x: e.nodes[0].x - Math.cos(P.angleToRadians(o)) * a,
                                y: e.nodes[0].y - Math.sin(P.angleToRadians(-1 * o)) * a
                            }, {
                                x: e.nodes[1].x - Math.cos(P.angleToRadians(o)) * a,
                                y: e.nodes[1].y - Math.sin(P.angleToRadians(-1 * o)) * a
                            }],
                            s = n.createNodeOnLineIntersection(r),
                            h = s.x + Math.cos(P.angleToRadians(-1 * o)) * (a + m.quarterTileSize),
                            l = s.y + Math.sin(P.angleToRadians(-1 * o)) * (a + m.quarterTileSize),
                            c = {
                                x: h - Math.cos(P.angleToRadians(o - 90)) * (i + m.quarterTileSize),
                                y: l - Math.sin(P.angleToRadians(o + 90)) * (i + m.quarterTileSize)
                            },
                            u = new L({
                                x: c.x,
                                y: c.y,
                                roadPath: n
                            }),
                            d = e.findClosestRoadPath(u.x, u.y);
                        u.transferTo = d;
                        var f = new L({
                            x: u.x,
                            y: u.y,
                            roadPath: d
                        });
                        d.getNextNodeFrom(f.x, f.y).addBefore(f), s.addNextPoint(u), u.addNextPoint(f), this.transferNodes.push(u)
                    }
                }, {
                    key: "createRightCurve",
                    value: function(t, e, n) {
                        var i = e.getWay("even").lanes.length * m.halfTileSize,
                            a = n.getAngle(),
                            o = [{
                                x: e.nodes[0].x - Math.cos(P.angleToRadians(a)) * (i + 50),
                                y: e.nodes[0].y - Math.sin(P.angleToRadians(-1 * a)) * (i + 50)
                            }, {
                                x: e.nodes[1].x - Math.cos(P.angleToRadians(a)) * (i + 50),
                                y: e.nodes[1].y - Math.sin(P.angleToRadians(-1 * a)) * (i + 50)
                            }],
                            r = n.createNodeOnLineIntersection(o),
                            s = new L({
                                x: r.x + Math.cos(P.angleToRadians(-1 * a)) * (m.quarterTileSize + 50 - m.quarterTileSize),
                                y: r.y + Math.sin(P.angleToRadians(-1 * a)) * (m.quarterTileSize + 50 - m.quarterTileSize),
                                roadPath: n
                            });
                        s.maxSpeed = .8;
                        var h = s.x + Math.cos(P.angleToRadians(-1 * a)) * m.quarterTileSize,
                            l = s.y + Math.sin(P.angleToRadians(-1 * a)) * m.quarterTileSize,
                            c = {
                                x: h + Math.cos(P.angleToRadians(a - 90)) * m.quarterTileSize,
                                y: l + Math.sin(P.angleToRadians(a + 90)) * m.quarterTileSize
                            },
                            u = new L({
                                x: c.x,
                                y: c.y,
                                roadPath: n,
                                maxSpeed: .8
                            }),
                            d = e.findClosestRoadPath(u.x, u.y),
                            f = new L({
                                x: u.x,
                                y: u.y,
                                roadPath: d
                            });
                        d.getNextNodeFrom(f.x, f.y).addBefore(f), r.addNextPoint(s), s.addNextPoint(u), s.transferTo = d, u.addNextPoint(f), this.transferNodes.push(u)
                    }
                }, {
                    key: "drawOnCanvas",
                    value: function(t) {
                        var e = m.tileSize / 2;
                        t.translate(m.worldWidth / 2 * 2, m.worldHeight / 2 * 2);
                        var n = this.x - this.roads[1].getWay("even").lanes.length * e,
                            i = this.y - this.roads[0].getWay("even").lanes.length * e;
                        t.fillStyle = m.colors.road, t.fillRect(2 * n, 2 * i, this.roads[1].getWay("even").lanes.length * m.tileSize * 2, this.roads[0].getWay("even").lanes.length * m.tileSize * 2), t.translate(2 * n, 2 * i);
                        for (var a = 0; a < 4; a++) {
                            0 !== a && (t.translate(this.roads[a % 2].getWay("even").lanes.length * m.tileSize * 2, 0), t.rotate(P.angleToRadians(90))), t.fillStyle = m.colors.road, t.fillRect(0, -30, this.roads[a % 2].getWay("even").lanes.length * m.tileSize * 2, 30), t.fillStyle = "#fff";
                            for (var o = 12 * this.roads[a % 2].getWay("even").lanes.length + 1, r = m.tileSize * this.roads[a % 2].getWay("even").lanes.length / o, s = 1; s < o; s += 2) t.fillRect(s * r * 2, -20, 2 * r, 20)
                        }
                        t.resetTransform()
                    }
                }]) && U(e.prototype, n), i && U(e, i), t
            }();

            function Y(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var K = function t(e) {
                    ! function(t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.x = e.x, this.y = e.y
                },
                Q = function() {
                    function t(e) {
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this.name = e.name, this.nodes = e.nodes, this.roadLanes = e.roadLanes || 1, this.ways = [new J({
                            type: "even",
                            road: this
                        }), new J({
                            type: "odd",
                            road: this
                        })], this.ways.forEach(this.createWayRoadPaths.bind(this))
                    }
                    var e, n, i;
                    return e = t, i = [{
                        key: "createRoadsJunctions",
                        value: function(t, e) {
                            var n = P.getLinesIntersection(t.nodes[0].x, t.nodes[0].y, t.nodes[1].x, t.nodes[1].y, e.nodes[0].x, e.nodes[0].y, e.nodes[1].x, e.nodes[1].y);
                            if (n) return new X([t, e], n.x, n.y)
                        }
                    }], (n = [{
                        key: "getRoadPaths",
                        value: function() {
                            var t = [];
                            return this.ways.forEach((function(e) {
                                e.lanes.forEach((function(e) {
                                    t.push(e)
                                }))
                            })), t
                        }
                    }, {
                        key: "createWayRoadPaths",
                        value: function(t) {
                            "odd" === t.type && this.nodes.reverse();
                            var e = m.tileSize / 2,
                                n = this.nodes[1].x - this.nodes[0].x,
                                i = this.nodes[1].y - this.nodes[0].y,
                                a = P.calcAngleDegrees(n, -1 * i),
                                o = Math.sin(P.angleToRadians(a)),
                                r = Math.cos(P.angleToRadians(a));
                            t.addNode(this.nodes[0].x + o * (this.roadLanes / 2) * e, this.nodes[0].y + r * (this.roadLanes / 2) * e), t.addNode(this.nodes[1].x + o * (this.roadLanes / 2) * e, this.nodes[1].y + r * (this.roadLanes / 2) * e);
                            for (var s = 0; s < this.roadLanes; s++) {
                                var h = new j({
                                        name: "".concat(this.name, "-").concat(t.type, "-").concat(s),
                                        order: s,
                                        way: t,
                                        road: this
                                    }),
                                    l = new L({
                                        x: this.nodes[0].x + o * (m.tileSize / 4) + o * s * e,
                                        y: this.nodes[0].y + r * (m.tileSize / 4) + r * s * e
                                    });
                                h.addPoint(l);
                                var c = new L({
                                    x: this.nodes[0].x + n + o * (m.tileSize / 4) + o * s * e,
                                    y: this.nodes[0].y + i + r * (m.tileSize / 4) + r * s * e
                                });
                                h.addPoint(c), t.lanes.push(h)
                            }
                            "odd" === t.type && this.nodes.reverse()
                        }
                    }, {
                        key: "getWay",
                        value: function(t) {
                            return this.ways.find((function(e) {
                                return e.type === t
                            }))
                        }
                    }, {
                        key: "getAngle",
                        value: function() {
                            var t = this.nodes[1].x - this.nodes[0].x,
                                e = this.nodes[1].y - this.nodes[0].y;
                            return P.calcAngleDegrees(t, e)
                        }
                    }, {
                        key: "getTotalLanes",
                        value: function() {
                            var t = 0;
                            return this.getRoadPaths().forEach((function() {
                                t++
                            })), t
                        }
                    }, {
                        key: "getInitPoints",
                        value: function() {
                            return this.getRoadPaths().map((function(t) {
                                return t.initPoint
                            }))
                        }
                    }, {
                        key: "drawOnCanvas",
                        value: function(t) {
                            var e = this,
                                n = m.tileSize / 2,
                                i = this.nodes[0],
                                a = this.nodes[this.nodes.length - 1];
                            t.translate(m.worldWidth / 2 * 2, m.worldHeight / 2 * 2);
                            var o = a.x - i.x,
                                r = a.y - i.y,
                                s = P.calcAngleDegrees(o, r),
                                h = this.nodes.map((function(t, n) {
                                    var i = t.x,
                                        a = t.y;
                                    return 0 === n ? {
                                        x: i - Math.cos(P.angleToRadians(s)) * (m.tileSize / 2),
                                        y: a - Math.sin(P.angleToRadians(s)) * (m.tileSize / 2)
                                    } : n === e.nodes.length - 1 ? {
                                        x: i + Math.cos(P.angleToRadians(s)) * (m.tileSize / 2),
                                        y: a + Math.sin(P.angleToRadians(s)) * (m.tileSize / 2)
                                    } : {
                                        x: i,
                                        y: a
                                    }
                                }));
                            t.beginPath(), h.forEach((function(e, n) {
                                0 !== n ? t.lineTo(2 * e.x, 2 * e.y) : t.moveTo(2 * e.x, 2 * e.y)
                            })), t.lineWidth = n * this.getTotalLanes() * 2, t.strokeStyle = m.colors.road, t.stroke(), t.closePath(), t.beginPath(), h.forEach((function(e, n) {
                                0 !== n ? t.lineTo(2 * e.x, 2 * e.y) : t.moveTo(2 * e.x, 2 * e.y)
                            })), t.lineWidth = 2, t.strokeStyle = "#d9cd19", t.stroke(), t.closePath(), t.resetTransform(), this.getRoadPaths().forEach((function(e) {
                                e.drawOnCanvas(t)
                            }))
                        }
                    }, {
                        key: "findClosestRoadPath",
                        value: function(t, e) {
                            var n, i, a, o = null,
                                r = null;
                            return this.getRoadPaths().forEach((function(s) {
                                return i = s.initPoint, a = s.getDeepestPoint(), n = P.getPointOnLine(t, e, i.x, i.y, a.x, a.y), (!o || Math.abs(n.dot) < r) && (r = Math.abs(n.dot), o = s), !1
                            })), o
                        }
                    }, {
                        key: "findClosestPoint",
                        value: function(t, e) {
                            var n, i = null,
                                a = null;
                            return this.getRoadPaths().forEach((function(o) {
                                var r = o.getClosestPoint(t, e);
                                return n = Math.sqrt(Math.pow(t - r.x, 2) + Math.pow(e - r.y, 2)), (!i || n < a) && (a = n, i = r), !1
                            })), i
                        }
                    }]) && Y(e.prototype, n), i && Y(e, i), t
                }();

            function Z(t, e) {
                if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
            }

            function $(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }

            function tt(t, e, n) {
                return e && $(t.prototype, e), n && $(t, n), t
            }
            var et = 25,
                nt = m.worldWidth,
                it = m.worldHeight,
                at = m.tileSize,
                ot = function() {
                    function t(e, n) {
                        Z(this, t), this.x = e, this.y = n, this.contents = [], this.sceneX = nt / 2 * -1 + e * at + at / 2, this.sceneY = it / 2 * -1 + n * at + at / 2
                    }
                    return tt(t, [{
                        key: "getRoadContents",
                        value: function() {
                            return this.contents.filter((function(t) {
                                return t instanceof Q
                            }))
                        }
                    }, {
                        key: "getJunctionContents",
                        value: function() {
                            return this.contents.filter((function(t) {
                                return t instanceof X
                            }))
                        }
                    }]), t
                }(),
                rt = new(function() {
                    function t() {
                        Z(this, t), this.size = et, this.matrix = [];
                        for (var e = 0; e < this.size; e++) {
                            this.matrix[e] = [];
                            for (var n = 0; n < this.size; n++) this.matrix[e][n] = new ot(e, n)
                        }
                    }
                    return tt(t, [{
                        key: "getTiles",
                        value: function() {
                            for (var t = [], e = 0; e < this.matrix.length; e++)
                                for (var n = 0; n < this.matrix[e].length; n++) t.push(this.matrix[e][n]);
                            return t
                        }
                    }, {
                        key: "getTile",
                        value: function(t, e) {
                            return this.matrix[t][e]
                        }
                    }, {
                        key: "setTileContent",
                        value: function(t, e, n) {
                            this.matrix[t][e].contents.some((function(t) {
                                return t === n
                            })) || this.matrix[t][e].contents.push(n)
                        }
                    }, {
                        key: "getRoadMatrix",
                        value: function() {
                            for (var t = [], e = 0; e < this.matrix.length; e++) {
                                t[e] = [];
                                for (var n = 0; n < this.matrix[e].length; n++) {
                                    var i = this.matrix[e][n].getRoadContents();
                                    t[e][n] = {
                                        roads: i
                                    }
                                }
                            }
                            return t
                        }
                    }]), t
                }());

            function st(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var ht = 8e3,
                lt = 2e3,
                ct = function() {
                    function t(e) {
                        var n = this;
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this.trafficLights = e, this.currentGroupIndex = 0, this.groups = {}, this.warningTimer = null, this.cycleTimer = null, this.trafficLights.length && (this.trafficLights.forEach((function(t) {
                            var e = t.roadPaths[0].name.replace(/[0-9]/g, "");
                            n.groups[e] || (n.groups[e] = []), n.groups[e].push(t)
                        })), this.change())
                    }
                    var e, n, i;
                    return e = t, (n = [{
                        key: "warning",
                        value: function() {
                            var t = Object.keys(this.groups);
                            this.groups[t[this.currentGroupIndex]].forEach((function(t) {
                                return t.activate("yellow")
                            }))
                        }
                    }, {
                        key: "change",
                        value: function() {
                            var t = this,
                                e = Object.keys(this.groups);
                            this.currentGroupIndex = (this.currentGroupIndex + 1) % e.length, e.forEach((function(e) {
                                t.groups[e].forEach((function(t) {
                                    return t.activate("red")
                                }))
                            })), this.groups[e[this.currentGroupIndex]].forEach((function(t) {
                                return t.activate("green")
                            })), this.warningTimer = setTimeout(this.warning.bind(this), ht - lt), this.cycleTimer = setTimeout(this.change.bind(this), ht)
                        }
                    }, {
                        key: "destroy",
                        value: function() {
                            clearTimeout(this.warningTimer), clearTimeout(this.cycleTimer), this.trafficLights.forEach((function(t) {
                                return t.deactivate()
                            }))
                        }
                    }]) && st(e.prototype, n), i && st(e, i), t
                }();

            function ut(t) {
                return function(t) {
                    if (Array.isArray(t)) {
                        for (var e = 0, n = new Array(t.length); e < t.length; e++) n[e] = t[e];
                        return n
                    }
                }(t) || function(t) {
                    if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
                }(t) || function() {
                    throw new TypeError("Invalid attempt to spread non-iterable instance")
                }()
            }

            function dt(t, e) {
                return function(t) {
                    if (Array.isArray(t)) return t
                }(t) || function(t, e) {
                    if (!(Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t))) return;
                    var n = [],
                        i = !0,
                        a = !1,
                        o = void 0;
                    try {
                        for (var r, s = t[Symbol.iterator](); !(i = (r = s.next()).done) && (n.push(r.value), !e || n.length !== e); i = !0);
                    } catch (t) {
                        a = !0, o = t
                    } finally {
                        try {
                            i || null == s.return || s.return()
                        } finally {
                            if (a) throw o
                        }
                    }
                    return n
                }(t, e) || function() {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }()
            }

            function ft(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var i = e[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                }
            }
            var gt, yt, vt, xt = function() {
                    function t(e) {
                        ! function(t, e) {
                            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                        }(this, t), this.scene = new i.q, this.scene.background = new i.d(16441547), this.carsTotal = e.carsTotal, this.roadsTotal = e.roadsTotal, this.roadLanes = e.roadLanes, this.tileSize = m.tileSize, this.width = m.worldWidth, this.height = m.worldHeight, this.matrix = rt, this.groundCanvas = document.createElement("canvas"), this.groundCanvas.width = 2 * this.width, this.groundCanvas.height = 2 * this.height, this.roads = [], this.junctions = [], this.trafficLightController = null, this.houses = [new c({
                            width: 30,
                            height: 101,
                            depth: 20,
                            x: 150,
                            y: -200
                        })], this.cars = [], this.trafficLights = [], this.callbacks = {}, this.initilize(), this.toggleTrafficSignals = this.toggleTrafficSignals.bind(this)
                    }
                    var e, n, a;
                    return e = t, (n = [{
                        key: "drawTilesGrid",
                        value: function() {
                            var t = this,
                                e = this.groundCanvas.getContext("2d");
                            e.fillStyle = "#cac4ae", e.fillRect(0, 0, 2 * this.width, 2 * this.height), this.matrix.getTiles().forEach((function(n) {
                                e.strokeStyle = "#aea998", e.strokeRect(t.tileSize * n.x * 2, t.tileSize * n.y * 2, 2 * t.tileSize, 2 * t.tileSize)
                            }))
                        }
                    }, {
                        key: "populateRoads",
                        value: function() {
                            for (var t = this.groundCanvas.getContext("2d"), e = ["Row", "Col"], n = 0; n < this.roadsTotal; n++) {
                                var i = e[n % 2],
                                    a = Math.floor(n / 2),
                                    o = n % 2 == 0 ? 0 : this.roadsTotal % 2,
                                    r = Math.floor(this.matrix.size / (Math.ceil(this.roadsTotal / 2) + 1 - o)),
                                    s = r + r * a,
                                    h = "Col" === i ? this.matrix.getTile(s, 0) : this.matrix.getTile(0, s),
                                    l = "Col" === i ? this.matrix.getTile(s, this.matrix.size - 1) : this.matrix.getTile(this.matrix.size - 1, s),
                                    c = new Q({
                                        name: "".concat(i, "-").concat(a),
                                        nodes: [new K({
                                            x: h.sceneX,
                                            y: h.sceneY
                                        }), new K({
                                            x: l.sceneX,
                                            y: l.sceneY
                                        })],
                                        roadLanes: this.roadLanes
                                    });
                                this.roads.push(c)
                            }
                            for (var u = 0; u < this.roads.length; u++)
                                for (var d = this.roads[u], f = u + 1; f < this.roads.length; f++) {
                                    var g = this.roads[f],
                                        y = Q.createRoadsJunctions(d, g);
                                    y && this.junctions.push(y)
                                }
                            this.junctions.forEach((function(t) {
                                return t.connectWayTransfers()
                            })), this.roads.forEach((function(t) {
                                t.ways.forEach((function(t) {
                                    t.updateNextNodes()
                                }))
                            })), this.roads.forEach((function(e) {
                                return e.drawOnCanvas(t)
                            })), this.junctions.forEach((function(e) {
                                return e.drawOnCanvas(t)
                            }))
                        }
                    }, {
                        key: "createCarRouteTrace",
                        value: function(t) {
                            var e = new i.f,
                                n = new i.i({
                                    color: t.color
                                });
                            t.route.forEach((function(t) {
                                e.vertices.push(new i.u(t.x, t.y, -5))
                            })), t.routeTrace = new i.h(e, n), t.routeTrace.rotation.x = 90 * Math.PI / 180, this.scene.add(t.routeTrace)
                        }
                    }, {
                        key: "onCarBrake",
                        value: function(t) {
                            let myId = t.carId;
                            activeAccident(myId);
                            this.callbacks.carAccident && this.callbacks.carAccident()
                        }
                    }, {
                        key: "onCarArrival",
                        value: function(t) {
                            deleteCar(t.carId);
                            var e = this.cars.findIndex((function(e) {
                                return e === t
                            }));
                            
                            this.cars.splice(e, 1), this.scene.remove(t.mesh), this.scene.remove(t.routeTrace), this.callbacks.carArrival && this.callbacks.carArrival()
                        }
                    }, {
                        key: "createRandomCar",
                        value: function(t, e, n) {
                            //var id = crypto.randomUUID();
                            var id = carNumber;
                            createCar(id);
                            carNumber++;
                            var i = N.findBestRoute(t, e),
                                a = new B({
                                    position: {
                                        x: i[0].x,
                                        y: i[0].y
                                    },
                                    angle: i[0].roadPath.getAngle(),
                                    carId:id
                                });
                            cars[id] = a; 
                            a.setRoute(i, {
                                onArrival: this.onCarArrival.bind(this),
                                onBrake: this.onCarBrake.bind(this),
                            }), this.scene.add(a.mesh), this.cars.push(a), a.index = n
                        }
                    }, {
                        key: "getFreePointsToEnterCar",
                        value: function() {
                            var t, e, n = this,
                                a = [];
                            return this.roads.forEach((function(o) {
                                for (var r = o.getInitPoints(), s = 0; s < r.length; s++) {
                                    t = null, e = new i.u(r[s].x, -5, r[s].y);
                                    for (var h = 0; h < n.cars.length; h++) {
                                        var l = n.cars[h];
                                        if (l.currentRoadPath === r[s].roadPath) {
                                            var c = l.mesh.position.distanceTo(e);
                                            t ? c < t && (t = c) : t = c
                                        }
                                    }(null === t || t > 2 * w.carSize) && a.push(r[s])
                                }
                            })), a
                        }
                    }, {
                        key: "populateCars",
                        value: function() {
                            var t = this.carsTotal - this.cars.length;
                            if (0 !== t)
                                for (var e, n, i, a, o, r = this.getFreePointsToEnterCar(), s = Math.min(r.length, t), h = 0; h < s; h++) e = P.getRandomInt(0, r.length), n = dt(r.splice(e, 1), 1)[0], a = (i = this.roads[P.getRandomInt(0, this.roads.length)]).ways[P.getRandomInt(0, i.ways.length)], i === n.roadPath.way.road && (a = n.roadPath.way), o = a.lanes[P.getRandomInt(0, a.lanes.length)].getDeepestPoint(), this.createRandomCar(n, o, this.cars.length)
                        }
                    }, {
                        key: "getDifferentRoad",
                        value: function(t) {
                            var e = this.roads.filter((function(e) {
                                return e !== t
                            }));
                            return e[P.getRandomInt(0, e.length)]
                        }
                    }, {
                        key: "populateBuildings",
                        value: function() {
                            var t = this;
                            this.houses.forEach((function(e) {
                                t.scene.add(e.mesh)
                            }))
                        }
                    }, {
                        key: "createGround",
                        value: function() {
                            var t = new i.k(new i.a(this.width, 20, this.height), [new i.l({
                                color: 13288622
                            }), new i.l({
                                color: 13288622
                            }), new i.l({
                                map: new i.c(this.groundCanvas)
                            }), new i.l({
                                color: 13288622
                            }), new i.l({
                                color: 13288622
                            }), new i.l({
                                color: 13288622
                            })]);
                            t.position.set(0, -10, 0), this.scene.add(t)
                        }
                    }, {
                        key: "installTrafficController",
                        value: function() {
                            var t = this;
                            this.junctions.forEach((function(e) {
                                e.trafficLights.forEach((function(e) {
                                    t.trafficLights.push(e), t.scene.add(e.mesh)
                                }))
                            })), this.trafficLightController = new ct(this.trafficLights)
                        }
                    }, {
                        key: "createCenterReference",
                        value: function() {
                            var t = new i.k(new i.a(5, 125, 5), new i.l({
                                color: 16711680
                            }));
                            t.rotation.x = -Math.PI / 2, this.scene.add(t);
                            var e = new i.k(new i.a(125, 5, 5), new i.l({
                                color: 16711680
                            }));
                            e.rotation.x = -Math.PI / 2, this.scene.add(e)
                        }
                    }, {
                        key: "initilize",
                        value: function() {
                            this.drawTilesGrid(), this.populateRoads(), this.installTrafficController(), this.populateCars(), this.createGround()
                        }
                    }, {
                        key: "getCarCollidableList",
                        value: function(t) {
                            var e = this.cars.filter((function(e) {
                                    return !e.broken && t !== e && t.mesh.position.distanceTo(e.mesh.position) < 90
                                })),
                                n = t.currentRoadPath,
                                i = this.trafficLights.filter((function(e) {
                                    return !(!e.active || e.roadPath !== n && "green" === e.state || t.transferingToPath && -1 !== e.availableRoadPaths.indexOf(t.transferingToPath)) && t.mesh.position.distanceTo(e.mesh.position) < 90
                                }));
                            return [].concat(ut(e), ut(i))
                        }
                    }, {
                        key: "toggleTrafficSignals",
                        value: function() {
                            this.trafficLightController ? (this.trafficLightController.destroy(), this.trafficLightController = null) : this.trafficLightController = new ct(this.trafficLights)
                        }
                    }, {
                        key: "on",
                        value: function(t, e) {
                            return this.callbacks[t] = e, this
                        }
                    }, {
                        key: "updateCars",
                        value: function() {
                            var t, e, n = this.cars.length;
                            for (t = 0; t < n; t++)(e = this.cars[t]).checkCollision(this.getCarCollidableList(e)), e.update(t);
                            this.populateCars()
                        }
                    }, {
                        key: "update",
                        value: function() {
                            this.updateCars()
                        }
                    }]) && ft(e.prototype, n), a && ft(e, a), t
                }(),
                pt = {
                    carsTotal: 40,
                    roadsTotal: 4,
                    roadLanes: 3
                },
                wt = document.querySelector("#scene"),
                Pt = document.getElementById("car_accident_count"),
                mt = document.getElementById("car_arrival_count"),
                bt = document.getElementById("btn_toggle_traffic_signals"),
                Tt = document.getElementById("btn_generate_city");

            function kt() {
                allInit();
                Pt.textContent = 0, mt.textContent = 0, bt.checked = !0, (yt = new i.m(45, window.innerWidth / window.innerHeight, 100, 5e3)).position.set(0, 950, 1400), (gt = new xt(pt)).on("carAccident", (function() {
                    Pt.textContent = parseInt(Pt.textContent, 10) + 1
                })).on("carArrival", (function() {
                    mt.textContent = parseInt(mt.textContent, 10) + 1
                })), (vt = new i.v({
                    antialias: !0
                })).setSize(window.innerWidth, window.innerHeight), new a.a(yt, vt.domElement).maxDistance = 1800, wt.innerHTML = "", wt.appendChild(vt.domElement)
            }

            function Rt() {
                bt.textContent = "".concat(gt.trafficLightController ? "Activate" : "Deactivate", " Traffic Signals"), gt.toggleTrafficSignals()
            }
            Object.keys(pt).forEach((function(t) {
                    var e = document.querySelector("#control_".concat(t, " input"));
                    e.addEventListener("change", (function(e) {
                        return function(t, e) {
                            pt[e] = t.currentTarget.value, document.querySelector("#control_".concat(e, " strong")).textContent = pt[e]
                        }(e, t)
                    })), e.value = pt[t]
                })), bt.addEventListener("change", Rt), Tt.addEventListener("click", kt), kt(),
                function t() {
                    gt.update(), vt.render(gt.scene, yt), requestAnimationFrame(t)
                }();
            n(3), n(4)
        }
    },
    [
        [5, 1, 2]
    ]
]);