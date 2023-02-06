System.register("chunks:///_virtual/AStar.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _createClass, cclegacy, _decorator;

  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "0344fD+r89L+qVmbWRmMzxg", "AStar", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var AStar = exports('AStar', (_dec = ccclass('AStar'), _dec(_class = /*#__PURE__*/function () {
        function AStar() {
          this._open = void 0;
          this._closed = void 0;
          this._grid = void 0;
          this._endNode = void 0;
          this._startNode = void 0;
          this._path = void 0;
          this._heuristic = this.diagonal;
          this._straightCost = 1.0;
          this._diagCost = Math.SQRT2;
          this._startCalculateTime = void 0;
          this.costTotTime = void 0;
        }

        var _proto = AStar.prototype; //计算本次寻路的总耗时
        //判断节点是否开放列表

        _proto.isOpen = function isOpen(node) {
          var self = this;
          return self._open.indexOf(node) > -1;
        } //判断节点是否封闭列表
        ;

        _proto.isClosed = function isClosed(node) {
          var self = this;
          return self._closed.indexOf(node) > -1;
        } //对指定的网络寻找路径
        ;

        _proto.findPath = function findPath(grid) {
          var self = this;
          self._grid = grid;
          self._open = [];
          self._closed = [];
          self._startNode = self._grid.startNode;
          self._endNode = self._grid.endNode;
          self._startNode.g = 0;
          self._startNode.h = self._heuristic(self._startNode);
          self._startNode.f = self._startNode.g + self._startNode.h;
          self._startCalculateTime = self.getTime();
          return self.search();
        } //计算周围节点代价的关键处理函数
        ;

        _proto.search = function search() {
          var self = this;
          var node = self._startNode; //如果当前节点不是终点

          while (node != self._endNode) {
            //找出相邻节点的x,y范围
            var startX = Math.max(0, node.x - 1);
            var endX = Math.min(self._grid.numCols - 1, node.x + 1);
            var startY = Math.max(0, node.y - 1);
            var endY = Math.min(self._grid.numRows - 1, node.y + 1); //循环处理所有相邻节点

            for (var i = startX; i <= endX; i++) {
              for (var j = startY; j <= endY; j++) {
                var test = self._grid.getNode(i, j); //如果是当前节点，或者是不可通过的，且排除水平和垂直方向都是障碍物节点时的特例情况


                if (test == node || !test.walkable || !self._grid.getNode(node.x, test.y).walkable || !self._grid.getNode(test.x, node.y).walkable) {
                  continue;
                }

                var cost = self._straightCost; //如果是对象线，则使用对角代价

                if (!(node.x == test.x || node.y == test.y)) {
                  cost = self._diagCost;
                } //计算test节点的总代价


                var g = node.g + cost * test.costMultiplier;

                var h = self._heuristic(test);

                var f = g + h; //如果该点在open或close列表中

                if (self.isOpen(test) || self.isClosed(test)) {
                  //如果本次计算的代价更小，则以本次计算为准
                  if (f < test.f) {
                    // console.log("\n第", _t, "轮，有节点重新指向，x=", i, "，y=", j, "，g=", g, "，h=", h, "，f=", f, "，test=",test.toString());
                    test.f = f;
                    test.g = g;
                    test.h = h;
                    test.parent = node; //重新指定该点的父节点为本轮计算中心点
                  }
                } else //如果还不在open列表中，则除了更新代价以及设置父节点，还要加入open数组
                  {
                    test.f = f;
                    test.g = g;
                    test.h = h;
                    test.parent = node;

                    self._open.push(test);
                  }
              }
            }

            self._closed.push(node); //把处理过的本轮中心节点加入close节点
            //辅助调试，输出open数组中都有哪些节点
            // for (let i = 0; i < self._open.length; i++) {
            //    console.log(self._open[i].toString());
            // }


            if (self._open.length == 0) {
              // Message.show("没找到最佳节点，无路可走!");
              console.log("没找到最佳节点，无路可走!");
              var totTime = (self.getTime() - self._startCalculateTime) / 1000;
              self.costTotTime = totTime;
              console.log("本次寻路计算总耗时: " + totTime + "秒");
              return false;
            }

            self._open.sort(function (a, b) {
              return a.f - b.f;
            }); //按总代价从小到大排序


            node = self._open.shift(); //从open数组中删除代价最小的结节，同时把该节点赋值为node，做为下次的中心点
          } //循环结束后，构建路径


          self.buildPath();
          return true;
        } //根据父节点指向，从终点反向连接到起点
        ;

        _proto.buildPath = function buildPath() {
          var self = this;
          self._path = [];
          var node = self._endNode;

          self._path.push(node);

          while (node != self._startNode) {
            node = node.parent;

            self._path.unshift(node);
          }

          var totTime = (self.getTime() - self._startCalculateTime) / 1000;
          self.costTotTime = totTime;
          console.log("本次寻路计算总耗时: " + totTime + "秒");
        } //获取当前时间(毫秒)
        ;

        _proto.getTime = function getTime() {
          return new Date().getTime();
        } //曼哈顿估价法
        ;

        _proto.manhattan = function manhattan(node) {
          var self = this;
          return Math.abs(node.x - self._endNode.x) * self._straightCost + Math.abs(node.y - self._endNode.y) * self._straightCost;
        } //几何估价法
        ;

        _proto.euclidian = function euclidian(node) {
          var self = this;
          var dx = node.x - self._endNode.x;
          var dy = node.y - self._endNode.y;
          return Math.sqrt(dx * dx + dy * dy) * self._straightCost;
        } //对角线估价法
        ;

        _proto.diagonal = function diagonal(node) {
          var self = this;
          var dx = Math.abs(node.x - self._endNode.x);
          var dy = Math.abs(node.y - self._endNode.y);
          var diag = Math.min(dx, dy);
          var straight = dx + dy;
          return self._diagCost * diag + self._straightCost * (straight - 2 * diag);
        } //返回所有被计算过的节点(辅助函数)
        ;

        _createClass(AStar, [{
          key: "visited",
          get: function get() {
            var self = this;
            return self._closed.concat(self._open);
          } //返回open数组

        }, {
          key: "openArray",
          get: function get() {
            var self = this;
            return self._open;
          } //返回close数组

        }, {
          key: "closedArray",
          get: function get() {
            var self = this;
            return self._closed;
          }
        }, {
          key: "path",
          get: function get() {
            var self = this;
            return self._path;
          }
        }]);

        return AStar;
      }()) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BagDlg.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './UIDlg.ts', './ImgLoader.ts', './List.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Button, Prefab, Label, instantiate, Vec3, UIDlg, ImgLoader, List;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Button = module.Button;
      Prefab = module.Prefab;
      Label = module.Label;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
    }, function (module) {
      UIDlg = module.UIDlg;
    }, function (module) {
      ImgLoader = module.ImgLoader;
    }, function (module) {
      List = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3;

      cclegacy._RF.push({}, "7e76axb+QlLMKjOaD3rhVdo", "BagDlg", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var BagDlg = exports('BagDlg', (_dec = ccclass('BagDlg'), _dec2 = property({
        type: Button
      }), _dec3 = property(List), _dec4 = property(Prefab), _dec5 = property(Label), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UIDlg) {
        _inheritsLoose(BagDlg, _UIDlg);

        function BagDlg() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UIDlg.call.apply(_UIDlg, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "btn_close", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "list_bag", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "bagItem", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "curPage", _descriptor4, _assertThisInitialized(_this));

          _this._bagDataList = void 0;
          _this.totalItemNum = 90;
          _this.pagePreNum = 12;
          _this.pageTotalNum = void 0;
          return _this;
        }

        var _proto = BagDlg.prototype; //总页数

        _proto.onEnter = function onEnter() {
          var self = this;
          self._bagDataList = [];

          for (var i = 0; i < self.totalItemNum; i++) {
            self._bagDataList.push({
              icon: "dy/icon/i" + Math.floor(Math.random() * 10),
              count: Math.floor(Math.random() * 100)
            });
          }

          this.pageTotalNum = Math.ceil(this.totalItemNum / this.pagePreNum); //总页数

          this.list_bag.numItems = this.pageTotalNum;
          this.onPageChange();
        } //水平列表渲染器
        ;

        _proto.onListRender = function onListRender(item, idx) {
          if (item.children.length) {
            for (var n = 0; n < item.children.length; n++) {
              var bi = item.children[n];
              var exactIdx = idx * this.pagePreNum + n;
              bi.getChildByName('icon').getComponent(ImgLoader).url = exactIdx < this.totalItemNum ? this._bagDataList[exactIdx].icon : '';
            }
          } else {
            // 我这里就不考虑性能了，直接实例化。
            for (var _n = 0; _n < this.pagePreNum; _n++) {
              var _bi = instantiate(this.bagItem);

              _bi.setParent(item);

              var _exactIdx = idx * this.pagePreNum + _n;

              console.log('exactIdx: ' + _exactIdx);
              _bi.getChildByName('icon').getComponent(ImgLoader).url = this._bagDataList[_exactIdx].icon;
            }
          }

          var pos = item.getPosition();
          item.setPosition(new Vec3(pos.x, 156));
        } //当列表项被选择...
        ;

        _proto.onListSelected = function onListSelected(item, selectedIdx, lastSelectedIdx, val) {
          var self = this;
          var itemInfo = self._bagDataList[selectedIdx];
          console.log(selectedIdx);
        };

        _proto.onPageChange = function onPageChange(pageNum) {
          if (pageNum === void 0) {
            pageNum = null;
          }

          var pageN = pageNum == null ? this.list_bag.curPageNum : pageNum;
          this.curPage.string = '当前页数：' + (pageN + 1);
        };

        _proto._tap_btn_close = function _tap_btn_close() {
          this.close();
        };

        return BagDlg;
      }(UIDlg), _class3.prefabUrl = 'prefab/bag/BagDlg', _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "btn_close", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "list_bag", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "bagItem", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "curPage", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BaseEnum.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports('BaseEnum', void 0);

      cclegacy._RF.push({}, "db093pwWWtDUZTnMgn5P9zO", "BaseEnum", undefined);
      /*
       * @Descripttion: 框架枚举类
       * @Author: CYK
       * @Date: 2022-06-25 15:57:33
       */


      var BaseEnum;

      (function (_BaseEnum) {
        var Game;

        (function (Game) {
          Game["onSpPlayEnd"] = "onSpPlayEnd";
        })(Game || (Game = {}));

        _BaseEnum.Game = Game;
        var READ_FILE_TYPE; // readAsArrayBuffer

        (function (READ_FILE_TYPE) {
          READ_FILE_TYPE[READ_FILE_TYPE["DATA_URL"] = 0] = "DATA_URL";
          READ_FILE_TYPE[READ_FILE_TYPE["TEXT"] = 1] = "TEXT";
          READ_FILE_TYPE[READ_FILE_TYPE["BINARY"] = 2] = "BINARY";
          READ_FILE_TYPE[READ_FILE_TYPE["ARRAYBUFFER"] = 3] = "ARRAYBUFFER";
        })(READ_FILE_TYPE || (READ_FILE_TYPE = {}));

        _BaseEnum.READ_FILE_TYPE = READ_FILE_TYPE;
      })(BaseEnum || (BaseEnum = exports('BaseEnum', {})));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BaseUtil.ts", ['cc', './ScaleMode.ts'], function (exports) {
  'use strict';

  var cclegacy, screen, view, Size, Node, UITransform, UIOpacity, Layers, scaleMode;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      screen = module.screen;
      view = module.view;
      Size = module.Size;
      Node = module.Node;
      UITransform = module.UITransform;
      UIOpacity = module.UIOpacity;
      Layers = module.Layers;
    }, function (module) {
      scaleMode = module.scaleMode;
    }],
    execute: function () {
      exports('BaseUT', void 0);

      cclegacy._RF.push({}, "cf03fhAu29N34p5XfVowsjF", "BaseUtil", undefined);

      var BaseUT;

      (function (_BaseUT) {
        function getStageSize() {
          var size = screen.windowSize;
          size.width /= view.getScaleX();
          size.height /= view.getScaleY();
          return size;
        }

        _BaseUT.getStageSize = getStageSize;

        function getLayerScaleSize() {
          var windowSize = BaseUT.getStageSize();
          var designHeight = windowSize.height < scaleMode.designHeight_max ? windowSize.height : scaleMode.designHeight_max;
          return new Size(windowSize.width, designHeight);
        }

        _BaseUT.getLayerScaleSize = getLayerScaleSize;

        function setFitSize(node) {
          var scaleSize = BaseUT.getLayerScaleSize();
          BaseUT.setSize(node, scaleSize.width, scaleSize.height);
          return scaleSize;
        }

        _BaseUT.setFitSize = setFitSize;

        function newUINode(name) {
          var newNode = new Node(name);
          newNode.addComponent(UITransform);
          newNode.addComponent(UIOpacity);
          newNode.layer = Layers.Enum.UI_2D;
          return newNode;
        }

        _BaseUT.newUINode = newUINode;

        function setAlpha(node, alpha) {
          var Opacity = node.getComponent(UIOpacity);
          Opacity.opacity = 255 * alpha;
        }

        _BaseUT.setAlpha = setAlpha;

        function setPivot(node, xv, yv) {
          var tranform = node.getComponent(UITransform);
          tranform.anchorX = xv;
          tranform.anchorY = yv;
        }

        _BaseUT.setPivot = setPivot;

        function setSize(node, width, height) {
          var uiTransform = node.getComponent(UITransform);
          uiTransform.setContentSize(width, height);
        }

        _BaseUT.setSize = setSize;

        function getSize(node) {
          var uiTransform = node.getComponent(UITransform);
          return new Size(uiTransform.width, uiTransform.height);
        }

        _BaseUT.getSize = getSize;

        function getFitY(min, max) {
          var windowSize = BaseUT.getLayerScaleSize();
          return min + (max - min) * (windowSize.height - 1068) / (1280 - 1068);
        }

        _BaseUT.getFitY = getFitY;
      })(BaseUT || (BaseUT = exports('BaseUT', {})));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/BottomTabLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ResMgr.ts', './UIMenu.ts', './ImgLoader.ts', './List.ts', './EquipLayer.ts', './HomeLayer.ts', './SettingLayer.ts', './ShopLayer.ts', './SkillLayer.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, ResMgr, UIMenu, ImgLoader, List, EquipLayer, HomeLayer, SettingLayer, ShopLayer, SkillLayer;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      UIMenu = module.UIMenu;
    }, function (module) {
      ImgLoader = module.ImgLoader;
    }, function (module) {
      List = module.default;
    }, function (module) {
      EquipLayer = module.EquipLayer;
    }, function (module) {
      HomeLayer = module.HomeLayer;
    }, function (module) {
      SettingLayer = module.SettingLayer;
    }, function (module) {
      ShopLayer = module.ShopLayer;
    }, function (module) {
      SkillLayer = module.SkillLayer;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _class3;

      cclegacy._RF.push({}, "083c8CfKglApKYNViA3QkiK", "BottomTabLayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var BottomTabLayer = exports('BottomTabLayer', (_dec = ccclass('BottomTabLayer'), _dec2 = property(List), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UIMenu) {
        _inheritsLoose(BottomTabLayer, _UIMenu);

        function BottomTabLayer() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UIMenu.call.apply(_UIMenu, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "list_tab", _descriptor, _assertThisInitialized(_this));

          _this._layerInfos = void 0;
          _this._toLayer = void 0;
          return _this;
        }

        var _proto = BottomTabLayer.prototype;

        _proto.onEnter = function onEnter() {
          var self = this;
          self._layerInfos = [{
            layer: EquipLayer.__className,
            icon: 'ui/home/ico_zhuangbei',
            preRes: [EquipLayer.prefabUrl]
          }, {
            layer: ShopLayer.__className,
            icon: 'ui/home/ico_shandian',
            preRes: [ShopLayer.prefabUrl]
          }, {
            layer: HomeLayer.__className,
            icon: 'ui/home/ico_shijie',
            preRes: [HomeLayer.prefabUrl]
          }, {
            layer: SkillLayer.__className,
            icon: 'ui/home/ico_tianfu',
            preRes: [SkillLayer.prefabUrl]
          }, {
            layer: SettingLayer.__className,
            icon: 'ui/home/ico_shezhi',
            preRes: [SettingLayer.prefabUrl]
          }];
        };

        _proto.onFirstEnter = function onFirstEnter() {
          var self = this;
          this.list_tab.numItems = self._layerInfos.length;
          this.list_tab.selectedId = 2;
        } //水平列表渲染器
        ;

        _proto.onListHRender = function onListHRender(item, idx) {
          item.getChildByName('icon').getComponent(ImgLoader).url = this._layerInfos[idx].icon;
        } //当列表项被选择...
        ;

        _proto.onListSelected = function onListSelected(item, selectedIdx, lastSelectedIdx, val) {
          var self = this;
          var layerInfo = self._layerInfos[selectedIdx];
          var layerName = layerInfo.layer;
          self._toLayer = layerName;
          ResMgr.inst.loadWithoutJuHua(layerInfo.preRes, function () {
            if (self._toLayer != layerName) return;
            self.emit('jumpToLayer', {
              layerName: layerName
            });
          }, self);
        };

        return BottomTabLayer;
      }(UIMenu), _class3.prefabUrl = 'prefab/home/BottomTabLayer', _class3), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "list_tab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ButtonPlus.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SoundMgr.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, cclegacy, _decorator, Node, Button, SoundMgr;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Button = module.Button;
    }, function (module) {
      SoundMgr = module.SoundMgr;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "668dcQo8b9L7bzcNhn/f/X6", "ButtonPlus", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var ButtonPlus = exports('ButtonPlus', (_dec = ccclass('ButtonPlus'), _dec(_class = /*#__PURE__*/function (_Button) {
        _inheritsLoose(ButtonPlus, _Button);

        function ButtonPlus() {
          return _Button.apply(this, arguments) || this;
        }

        var _proto = ButtonPlus.prototype;

        _proto.onLoad = function onLoad() {
          this.node.on(Node.EventType.TOUCH_END, this.playClickSound, this);
        };

        _proto.playClickSound = function playClickSound() {
          SoundMgr.inst.playClickSound();
        };

        return ButtonPlus;
      }(Button)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Emmiter.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _inheritsLoose, cclegacy, EventTarget;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      EventTarget = module.EventTarget;
    }],
    execute: function () {
      cclegacy._RF.push({}, "84d2dBrYchPDarRC6+jwDa+", "Emmiter", undefined);

      var Emmiter = exports('Emmiter', /*#__PURE__*/function (_EventTarget) {
        _inheritsLoose(Emmiter, _EventTarget);

        function Emmiter() {
          return _EventTarget.apply(this, arguments) || this;
        }

        return Emmiter;
      }(EventTarget));
      var emmiter = exports('emmiter', new Emmiter());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/EquipLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SoundMgr.ts', './UILayer.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, cclegacy, _decorator, SoundMgr, UILayer;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      SoundMgr = module.SoundMgr;
    }, function (module) {
      UILayer = module.UILayer;
    }],
    execute: function () {
      var _dec, _class, _class2;

      cclegacy._RF.push({}, "a1fcfVJdnVDGY0oK9Q/Lf+S", "EquipLayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var EquipLayer = exports('EquipLayer', (_dec = ccclass('EquipLayer'), _dec(_class = (_class2 = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(EquipLayer, _UILayer);

        function EquipLayer() {
          return _UILayer.apply(this, arguments) || this;
        }

        var _proto = EquipLayer.prototype;
        /** 预制体路径 */

        _proto.onEnter = function onEnter() {
          SoundMgr.inst.playBg('dy/sound/bg01');
        };

        _proto.update = function update(deltaTime) {};

        return EquipLayer;
      }(UILayer), _class2.prefabUrl = 'prefab/home/EquipLayer', _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/FileMgr.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseEnum.ts'], function (exports) {
  'use strict';

  var _createClass, cclegacy, sys, BaseEnum;

  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      sys = module.sys;
    }, function (module) {
      BaseEnum = module.BaseEnum;
    }],
    execute: function () {
      cclegacy._RF.push({}, "78317oPAPNDd7Hb7lE/C7KK", "FileMgr", undefined);

      var FileMgr = exports('FileMgr', /*#__PURE__*/function () {
        function FileMgr() {}

        var _proto = FileMgr.prototype;
        /**
         * 打开文件选择器
         *
         * @param {string} accept
         * @param {(file: File) => void} callback
         * @memberof FileMgr
         */

        _proto.openLocalFile = function openLocalFile(accept, callback) {
          var inputEl = document.getElementById('file_input');

          if (!inputEl) {
            // console.log('xxxxxx createElement input');
            inputEl = document.createElement('input');
            inputEl.id = 'file_input';
            inputEl.setAttribute('id', 'file_input');
            inputEl.setAttribute('type', 'file');
            inputEl.setAttribute('class', 'fileToUpload');
            inputEl.style.opacity = '0';
            inputEl.style.position = 'absolute';
            inputEl.setAttribute('left', '-999px');
            document.body.appendChild(inputEl);
          }

          accept = accept || ".*";
          inputEl.setAttribute('accept', accept); // inputEl.addEventListener('change', (event) => {
          //     console.log('xxx onchange1', event, inputEl.value);
          // });

          inputEl.onchange = function (event) {
            // console.log('xxx onchange2', event, inputEl.files);
            var files = inputEl.files;

            if (files && files.length > 0) {
              var file = files[0];
              if (callback) callback(file);
            }
          };

          inputEl.click();
        }
        /**
         * 读取本地文件数据
         *
         * @param {File} file
         * @param {READ_FILE_TYPE} readType
         * @param {((result: string | ArrayBuffer) => void)} callback
         * @memberof FileMgr
         */
        ;

        _proto.readLocalFile = function readLocalFile(file, readType, callback) {
          var reader = new FileReader();

          reader.onload = function (event) {
            if (callback) {
              if (reader.readyState == FileReader.DONE) {
                // console.log('xxx FileReader', event, reader.result);
                callback(reader.result);
              } else {
                callback(null);
              }
            }
          };

          switch (readType) {
            case BaseEnum.READ_FILE_TYPE.DATA_URL:
              reader.readAsDataURL(file);
              break;

            case BaseEnum.READ_FILE_TYPE.TEXT:
              reader.readAsText(file); //作为字符串读出
              //reader.readAsText(file,'gb2312');   //默认是用utf-8格式输出的，想指定输出格式就再添加一个参数，像txt的ANSI格式只能用国标才能显示出来

              break;

            case BaseEnum.READ_FILE_TYPE.BINARY:
              reader.readAsBinaryString(file);
              break;

            case BaseEnum.READ_FILE_TYPE.ARRAYBUFFER:
              reader.readAsArrayBuffer(file);
              break;
          }
        }
        /**
         * 保存数据到本地
         *
         * @param {*} textToWrite       要保存的文件内容
         * @param {*} fileNameToSaveAs  要保存的文件名
         * @memberof FileMgr
         */
        ;

        _proto.saveForBrowser = function saveForBrowser(textToWrite, fileNameToSaveAs) {
          if (sys.isBrowser) {
            console.log("浏览器");
            var textFileAsBlob = new Blob([textToWrite], {
              type: 'application/json'
            });
            var downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";

            if (window.webkitURL != null) {
              // Chrome allows the link to be clicked            
              // without actually adding it to the DOM.            
              downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            } else {
              // Firefox requires the link to be added to the DOM            
              // before it can be clicked.            
              downloadLink.href = window.URL.createObjectURL(textFileAsBlob); // downloadLink.onclick = destroyClickedElement;            

              downloadLink.style.display = "none";
              document.body.appendChild(downloadLink);
            }

            downloadLink.click();
          }
        };

        _createClass(FileMgr, null, [{
          key: "inst",
          get: function get() {
            if (!this._inst) {
              this._inst = new FileMgr();
            }

            return this._inst;
          }
        }]);

        return FileMgr;
      }());
      FileMgr._inst = void 0;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Grid.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Nodes.ts'], function (exports) {
  'use strict';

  var _createClass, cclegacy, _decorator, Nodes;

  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      Nodes = module.Nodes;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "8e7576mBodECoKcEb1Vy3h5", "Grid", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      /**
       * Predefined variables
       * Name = Grid
       * DateTime = Tue Mar 29 2022 17:44:30 GMT+0800 (中国标准时间)
       * Author = cyk54088
       * FileBasename = Grid.ts
       * FileBasenameNoExtension = Grid
       * URL = db://assets/scripts/Grid.ts
       * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
       *
       */

      var Grid = exports('Grid', (_dec = ccclass('Grid'), _dec(_class = /*#__PURE__*/function () {
        function Grid() {
          this._startNode = void 0;
          this._endNode = void 0;
          this._nodes = void 0;
          this._numCols = void 0;
          this._numRows = void 0;
        }

        var _proto = Grid.prototype; //行数

        _proto.init = function init(numCols, numRows) {
          var self = this;
          self._numCols = numCols;
          self._numRows = numRows;
          self._nodes = [];

          for (var i = 0; i < self._numCols; i++) {
            self._nodes[i] = [];

            for (var j = 0; j < self._numRows; j++) {
              self._nodes[i][j] = new Nodes();

              self._nodes[i][j].init(i, j);
            }
          }
        };

        _proto.resetWalkable = function resetWalkable() {
          var self = this;

          for (var i = 0; i < self._numCols; i++) {
            for (var j = 0; j < self._numRows; j++) {
              self._nodes[i][j].walkable = true;
            }
          }
        };

        _proto.getNode = function getNode(x, y) {
          var self = this;
          return self._nodes[x][y];
        };

        _proto.setEndNode = function setEndNode(x, y) {
          var self = this;
          self._endNode = self._nodes[x][y];
        };

        _proto.setStartNode = function setStartNode(x, y) {
          var self = this;
          self._startNode = self._nodes[x][y];
        };

        _proto.setWalkable = function setWalkable(x, y, value) {
          var self = this;
          self._nodes[x][y].walkable = value;
        };
        /** 获取可行走节点随机一点坐标**/


        _proto.getRanDomStartPos = function getRanDomStartPos() {
          var self = this;
          var canWalkArr = [];

          for (var i = 0; i < self._numCols; i++) {
            for (var j = 0; j < self._numRows; j++) {
              var node = self._nodes[i][j];
              if (node.walkable) canWalkArr.push(node);
            }
          }

          var randomIdx = Math.floor(Math.random() * canWalkArr.length);
          return canWalkArr[randomIdx];
        };

        _createClass(Grid, [{
          key: "endNode",
          get: function get() {
            var self = this;
            return self._endNode;
          }
        }, {
          key: "numCols",
          get: function get() {
            var self = this;
            return self._numCols;
          }
        }, {
          key: "numRows",
          get: function get() {
            var self = this;
            return self._numRows;
          }
        }, {
          key: "startNode",
          get: function get() {
            var self = this;
            return self._startNode;
          }
        }]);

        return Grid;
      }()) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HomeLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SoundMgr.ts', './UILayer.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, cclegacy, _decorator, SoundMgr, UILayer;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      SoundMgr = module.SoundMgr;
    }, function (module) {
      UILayer = module.UILayer;
    }],
    execute: function () {
      var _dec, _class, _class2;

      cclegacy._RF.push({}, "1d94e9Hw/xBKqjydj6+QF36", "HomeLayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var HomeLayer = exports('HomeLayer', (_dec = ccclass('HomeLayer'), _dec(_class = (_class2 = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(HomeLayer, _UILayer);

        function HomeLayer() {
          return _UILayer.apply(this, arguments) || this;
        }

        var _proto = HomeLayer.prototype;
        /** 预制体路径 */

        _proto.onEnter = function onEnter() {
          SoundMgr.inst.playMainBg();
        };

        _proto.update = function update(deltaTime) {};

        return HomeLayer;
      }(UILayer), _class2.prefabUrl = 'prefab/home/HomeLayer', _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HomeScene.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './UIScene.ts', './HomeLayer.ts', './ModuleMgr.ts', './TopUsrInfoLayer.ts', './BottomTabLayer.ts', './SoundMgr.ts', './EquipLayer.ts', './SettingLayer.ts', './ShopLayer.ts', './SkillLayer.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, UIScene, HomeLayer, registerModule, TopUsrInfoLayer, BottomTabLayer, SoundMgr, EquipLayer, SettingLayer, ShopLayer, SkillLayer;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      UIScene = module.UIScene;
    }, function (module) {
      HomeLayer = module.HomeLayer;
    }, function (module) {
      registerModule = module.registerModule;
    }, function (module) {
      TopUsrInfoLayer = module.TopUsrInfoLayer;
    }, function (module) {
      BottomTabLayer = module.BottomTabLayer;
    }, function (module) {
      SoundMgr = module.SoundMgr;
    }, function (module) {
      EquipLayer = module.EquipLayer;
    }, function (module) {
      SettingLayer = module.SettingLayer;
    }, function (module) {
      ShopLayer = module.ShopLayer;
    }, function (module) {
      SkillLayer = module.SkillLayer;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "2cd6eVFd+9FbJmYjv9P3hR3", "HomeScene", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var HomeScene = exports('HomeScene', (_dec = ccclass('HomeScene'), _dec(_class = /*#__PURE__*/function (_UIScene) {
        _inheritsLoose(HomeScene, _UIScene);

        function HomeScene() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UIScene.call.apply(_UIScene, [this].concat(args)) || this;
          _this._topUsrInfo = void 0;
          _this._bottomTab = void 0;
          return _this;
        }

        var _proto = HomeScene.prototype;

        _proto.ctor = function ctor() {
          var self = this;
          self.mainClassLayer = HomeLayer;
          var subLayerMgr = self.subLayerMgr;
          var classList = [SettingLayer, EquipLayer, ShopLayer, SkillLayer];

          for (var i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
          }
        };

        _proto.onEnter = /*#__PURE__*/function () {
          var _onEnter = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
            var self;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    self = this;
                    self.onEmitter('jumpToLayer', self.jumpToLayer);

                    if (self._topUsrInfo) {
                      _context.next = 6;
                      break;
                    }

                    _context.next = 5;
                    return TopUsrInfoLayer.show();

                  case 5:
                    self._topUsrInfo = _context.sent;

                  case 6:
                    if (self._bottomTab) {
                      _context.next = 10;
                      break;
                    }

                    _context.next = 9;
                    return BottomTabLayer.show();

                  case 9:
                    self._bottomTab = _context.sent;

                  case 10:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function onEnter() {
            return _onEnter.apply(this, arguments);
          }

          return onEnter;
        }();

        _proto.jumpToLayer = function jumpToLayer(data) {
          var self = this;

          if (!data) {
            console.error('跳转数据为null');
            return;
          }

          self.run(data.layerName);
        };

        _proto.onExit = function onExit() {
          SoundMgr.inst.playMainBg();
        };

        return HomeScene;
      }(UIScene)) || _class));
      registerModule(HomeScene, ['ui/home']);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ImgLoader.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ResMgr.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, _createClass, cclegacy, _decorator, Sprite, Component, ResMgr;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Component = module.Component;
    }, function (module) {
      ResMgr = module.ResMgr;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "bd5ffXtU0JG9LgAlbDlBRyw", "ImgLoader", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var ImgLoader = exports('ImgLoader', (_dec = ccclass('ImgLoader'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(ImgLoader, _Component);

        function ImgLoader() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this._sprite = void 0;
          _this._url = void 0;
          return _this;
        }

        var _proto = ImgLoader.prototype;

        _proto.onLoad = function onLoad() {
          var self = this;
          self._sprite = this.node.getComponent(Sprite);
          if (!self._sprite) self._sprite = this.node.addComponent(Sprite);
        };

        _createClass(ImgLoader, [{
          key: "url",
          set: function set(value) {
            var self = this;
            if (self._url == value) return;
            self._url = value;

            if (value.startsWith('ui/')) {
              var atlassUrl = value.slice(0, value.lastIndexOf('/'));
              var spriteAtlas = ResMgr.inst.get(atlassUrl);

              if (!spriteAtlas) {
                ResMgr.inst.loadWithoutJuHua(atlassUrl, function () {
                  self._sprite.spriteFrame = ResMgr.inst.get(value);
                }, self);
              } else {
                self._sprite.spriteFrame = ResMgr.inst.get(value);
              }
            } else {
              if (self._url == '' || self._url == null || self._url == undefined) {
                self._sprite.spriteFrame = null;
                return;
              }

              var spriteFrameUrl = value + '/spriteFrame';
              ResMgr.inst.loadWithoutJuHua(spriteFrameUrl, function () {
                var spriteFrame = ResMgr.inst.get(spriteFrameUrl);
                if (spriteFrame) self._sprite.spriteFrame = spriteFrame;
              }, self);
            }
          }
        }]);

        return ImgLoader;
      }(Component)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/JuHuaDlg.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './UIMsg.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, UIMsg;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
    }, function (module) {
      UIMsg = module.UIMsg;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _class3;

      cclegacy._RF.push({}, "8573feob4VPW4UFM9Uw0fNI", "JuHuaDlg", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var JuHuaDlg = exports('JuHuaDlg', (_dec = ccclass('JuHuaDlg'), _dec2 = property(Node), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UIMsg) {
        _inheritsLoose(JuHuaDlg, _UIMsg);

        function JuHuaDlg() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UIMsg.call.apply(_UIMsg, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "img_maskBg", _descriptor, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = JuHuaDlg.prototype;

        _proto.onEnter = function onEnter() {
          var self = this;
          self.img_maskBg.active = false;
          self.setTimeout(function () {
            self.img_maskBg.active = true;
            var img_wait = self.img_maskBg.getChildByName('img_wait');
            self.getTween(img_wait).to(1, {
              angle: 360
            }).set({
              angle: 0
            }).union().repeatForever().start();
          }, 4000);
        };

        return JuHuaDlg;
      }(UIMsg), _class3.prefabUrl = 'prefab/common/JuHuaDlg', _class3), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "img_maskBg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/List.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './env', './ListItem.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, ScrollView, Enum, Node, Prefab, CCFloat, EventHandler, CCBoolean, CCInteger, isValid, UITransform, Layout, instantiate, NodePool, Vec3, Size, Widget, tween, Component, DEV, ListItem;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      ScrollView = module.ScrollView;
      Enum = module.Enum;
      Node = module.Node;
      Prefab = module.Prefab;
      CCFloat = module.CCFloat;
      EventHandler = module.EventHandler;
      CCBoolean = module.CCBoolean;
      CCInteger = module.CCInteger;
      isValid = module.isValid;
      UITransform = module.UITransform;
      Layout = module.Layout;
      instantiate = module.instantiate;
      NodePool = module.NodePool;
      Vec3 = module.Vec3;
      Size = module.Size;
      Widget = module.Widget;
      tween = module.tween;
      Component = module.Component;
    }, function (module) {
      DEV = module.DEV;
    }, function (module) {
      ListItem = module.default;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17;

      cclegacy._RF.push({}, "23702FgpwVKLr+Oe2OJoxQ6", "List", undefined);
      /******************************************
       * @author kL <klk0@qq.com>
       * @date 2020/12/9
       * @doc 列表组件.
       * @end
       ******************************************/


      var ccclass = _decorator.ccclass,
          property = _decorator.property,
          disallowMultiple = _decorator.disallowMultiple,
          menu = _decorator.menu,
          executionOrder = _decorator.executionOrder,
          requireComponent = _decorator.requireComponent;
      var TemplateType;

      (function (TemplateType) {
        TemplateType[TemplateType["NODE"] = 1] = "NODE";
        TemplateType[TemplateType["PREFAB"] = 2] = "PREFAB";
      })(TemplateType || (TemplateType = {}));

      var SlideType; //页面模式，将强制关闭滚动惯性

      (function (SlideType) {
        SlideType[SlideType["NORMAL"] = 1] = "NORMAL";
        SlideType[SlideType["ADHERING"] = 2] = "ADHERING";
        SlideType[SlideType["PAGE"] = 3] = "PAGE";
      })(SlideType || (SlideType = {}));

      var SelectedType; //多选

      (function (SelectedType) {
        SelectedType[SelectedType["NONE"] = 0] = "NONE";
        SelectedType[SelectedType["SINGLE"] = 1] = "SINGLE";
        SelectedType[SelectedType["MULT"] = 2] = "MULT";
      })(SelectedType || (SelectedType = {}));

      var List = exports('default', (_dec = disallowMultiple(), _dec2 = menu('List'), _dec3 = requireComponent(ScrollView), _dec4 = executionOrder(-5000), _dec5 = property({
        type: Enum(TemplateType),
        tooltip: DEV
      }), _dec6 = property({
        type: Node,
        tooltip: DEV,
        visible: function visible() {
          return this.templateType == TemplateType.NODE;
        }
      }), _dec7 = property({
        type: Prefab,
        tooltip: DEV,
        visible: function visible() {
          return this.templateType == TemplateType.PREFAB;
        }
      }), _dec8 = property({}), _dec9 = property({
        type: Enum(SlideType),
        tooltip: DEV
      }), _dec10 = property({
        type: CCFloat,
        range: [0, 1, .1],
        tooltip: DEV,
        slide: true,
        visible: function visible() {
          return this._slideMode == SlideType.PAGE;
        }
      }), _dec11 = property({
        type: EventHandler,
        tooltip: DEV,
        visible: function visible() {
          return this._slideMode == SlideType.PAGE;
        }
      }), _dec12 = property({}), _dec13 = property({
        type: CCBoolean,
        tooltip: DEV
      }), _dec14 = property({
        tooltip: DEV,
        visible: function visible() {
          var val =
          /*this.virtual &&*/
          this.slideMode == SlideType.NORMAL;
          if (!val) this.cyclic = false;
          return val;
        }
      }), _dec15 = property({
        tooltip: DEV,
        visible: function visible() {
          return this.virtual;
        }
      }), _dec16 = property({
        tooltip: DEV,
        visible: function visible() {
          var val = this.virtual && !this.lackCenter;
          if (!val) this.lackSlide = false;
          return val;
        }
      }), _dec17 = property({
        type: CCInteger
      }), _dec18 = property({
        type: CCInteger,
        range: [0, 6, 1],
        tooltip: DEV,
        slide: true
      }), _dec19 = property({
        type: CCInteger,
        range: [0, 12, 1],
        tooltip: DEV,
        slide: true
      }), _dec20 = property({
        type: EventHandler,
        tooltip: DEV
      }), _dec21 = property({
        type: Enum(SelectedType),
        tooltip: DEV
      }), _dec22 = property({
        type: EventHandler,
        tooltip: DEV,
        visible: function visible() {
          return this.selectedMode > SelectedType.NONE;
        }
      }), _dec23 = property({
        tooltip: DEV,
        visible: function visible() {
          return this.selectedMode == SelectedType.SINGLE;
        }
      }), _dec24 = property({
        serializable: false
      }), ccclass(_class = _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(List, _Component);

        function List() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "templateType", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "tmpNode", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "tmpPrefab", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "_slideMode", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "pageDistance", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "pageChangeEvent", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "_virtual", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "cyclic", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "lackCenter", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "lackSlide", _descriptor10, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "_updateRate", _descriptor11, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "frameByFrameRenderNum", _descriptor12, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "renderEvent", _descriptor13, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "selectedMode", _descriptor14, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "selectedEvent", _descriptor15, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "repeatEventSingle", _descriptor16, _assertThisInitialized(_this));

          _this._selectedId = -1;
          _this._lastSelectedId = void 0;
          _this.multSelected = void 0;
          _this._forceUpdate = false;
          _this._align = void 0;
          _this._horizontalDir = void 0;
          _this._verticalDir = void 0;
          _this._startAxis = void 0;
          _this._alignCalcType = void 0;
          _this.content = void 0;
          _this._contentUt = void 0;
          _this.firstListId = void 0;
          _this.displayItemNum = void 0;
          _this._updateDone = true;
          _this._updateCounter = void 0;
          _this._actualNumItems = void 0;
          _this._cyclicNum = void 0;
          _this._cyclicPos1 = void 0;
          _this._cyclicPos2 = void 0;

          _initializerDefineProperty(_this, "_numItems", _descriptor17, _assertThisInitialized(_this));

          _this._inited = false;
          _this._scrollView = void 0;
          _this._layout = void 0;
          _this._resizeMode = void 0;
          _this._topGap = void 0;
          _this._rightGap = void 0;
          _this._bottomGap = void 0;
          _this._leftGap = void 0;
          _this._columnGap = void 0;
          _this._lineGap = void 0;
          _this._colLineNum = void 0;
          _this._lastDisplayData = void 0;
          _this.displayData = void 0;
          _this._pool = void 0;
          _this._itemTmp = void 0;
          _this._itemTmpUt = void 0;
          _this._needUpdateWidget = false;
          _this._itemSize = void 0;
          _this._sizeType = void 0;
          _this._customSize = void 0;
          _this.frameCount = void 0;
          _this._aniDelRuning = false;
          _this._aniDelCB = void 0;
          _this._aniDelItem = void 0;
          _this._aniDelBeforePos = void 0;
          _this._aniDelBeforeScale = void 0;
          _this.viewTop = void 0;
          _this.viewRight = void 0;
          _this.viewBottom = void 0;
          _this.viewLeft = void 0;
          _this._doneAfterUpdate = false;
          _this.elasticTop = void 0;
          _this.elasticRight = void 0;
          _this.elasticBottom = void 0;
          _this.elasticLeft = void 0;
          _this.scrollToListId = void 0;
          _this.adhering = false;
          _this._adheringBarrier = false;
          _this.nearestListId = void 0;
          _this.curPageNum = 0;
          _this._beganPos = void 0;
          _this._scrollPos = void 0;
          _this._curScrollIsTouch = void 0;
          _this._scrollToListId = void 0;
          _this._scrollToEndTime = void 0;
          _this._scrollToSo = void 0;
          _this._lack = void 0;
          _this._allItemSize = void 0;
          _this._allItemSizeNoEdge = void 0;
          _this._scrollItem = void 0;
          _this._thisNodeUt = void 0;
          return _this;
        }

        var _proto = List.prototype; //----------------------------------------------------------------------------

        _proto.onLoad = function onLoad() {
          this._init();
        };

        _proto.onDestroy = function onDestroy() {
          var t = this;
          if (isValid(t._itemTmp)) t._itemTmp.destroy();
          if (isValid(t.tmpNode)) t.tmpNode.destroy();
          t._pool && t._pool.clear();
        };

        _proto.onEnable = function onEnable() {
          // if (!EDITOR) 
          this._registerEvent();

          this._init(); // 处理重新显示后，有可能上一次的动画移除还未播放完毕，导致动画卡住的问题


          if (this._aniDelRuning) {
            this._aniDelRuning = false;

            if (this._aniDelItem) {
              if (this._aniDelBeforePos) {
                this._aniDelItem.position = this._aniDelBeforePos;
                delete this._aniDelBeforePos;
              }

              if (this._aniDelBeforeScale) {
                this._aniDelItem.scale = this._aniDelBeforeScale;
                delete this._aniDelBeforeScale;
              }

              delete this._aniDelItem;
            }

            if (this._aniDelCB) {
              this._aniDelCB();

              delete this._aniDelCB;
            }
          }
        };

        _proto.onDisable = function onDisable() {
          // if (!EDITOR) 
          this._unregisterEvent();
        } //注册事件
        ;

        _proto._registerEvent = function _registerEvent() {
          var t = this;
          t.node.on(Node.EventType.TOUCH_START, t._onTouchStart, t);
          t.node.on('touch-up', t._onTouchUp, t);
          t.node.on(Node.EventType.TOUCH_CANCEL, t._onTouchCancelled, t);
          t.node.on('scroll-began', t._onScrollBegan, t);
          t.node.on('scroll-ended', t._onScrollEnded, t);
          t.node.on('scrolling', t._onScrolling, t);
          t.node.on(Node.EventType.SIZE_CHANGED, t._onSizeChanged, t);
        } //卸载事件
        ;

        _proto._unregisterEvent = function _unregisterEvent() {
          var t = this;
          t.node.off(Node.EventType.TOUCH_START, t._onTouchStart, t);
          t.node.off('touch-up', t._onTouchUp, t);
          t.node.off(Node.EventType.TOUCH_CANCEL, t._onTouchCancelled, t);
          t.node.off('scroll-began', t._onScrollBegan, t);
          t.node.off('scroll-ended', t._onScrollEnded, t);
          t.node.off('scrolling', t._onScrolling, t);
          t.node.off(Node.EventType.SIZE_CHANGED, t._onSizeChanged, t);
        } //初始化各种..
        ;

        _proto._init = function _init() {
          var t = this;
          if (t._inited) return;
          t._thisNodeUt = t.node.getComponent(UITransform);
          t._scrollView = t.node.getComponent(ScrollView);
          t.content = t._scrollView.content;
          t._contentUt = t.content.getComponent(UITransform);

          if (!t.content) {
            console.error(t.node.name + "'s ScrollView unset content!");
            return;
          }

          t._layout = t.content.getComponent(Layout);
          t._align = t._layout.type; //排列模式

          t._resizeMode = t._layout.resizeMode; //自适应模式

          t._startAxis = t._layout.startAxis;
          t._topGap = t._layout.paddingTop; //顶边距

          t._rightGap = t._layout.paddingRight; //右边距

          t._bottomGap = t._layout.paddingBottom; //底边距

          t._leftGap = t._layout.paddingLeft; //左边距

          t._columnGap = t._layout.spacingX; //列距

          t._lineGap = t._layout.spacingY; //行距

          t._colLineNum; //列数或行数（非GRID模式则=1，表示单列或单行）;

          t._verticalDir = t._layout.verticalDirection; //垂直排列子节点的方向

          t._horizontalDir = t._layout.horizontalDirection; //水平排列子节点的方向

          t.setTemplateItem(instantiate(t.templateType == TemplateType.PREFAB ? t.tmpPrefab : t.tmpNode)); // 特定的滑动模式处理

          if (t._slideMode == SlideType.ADHERING || t._slideMode == SlideType.PAGE) {
            t._scrollView.inertia = false;

            t._scrollView['_onMouseWheel'] = function () {
              return;
            };
          }

          if (!t.virtual) // lackCenter 仅支持 Virtual 模式
            t.lackCenter = false;
          t._lastDisplayData = []; //最后一次刷新的数据

          t.displayData = []; //当前数据

          t._pool = new NodePool(); //这是个池子..

          t._forceUpdate = false; //是否强制更新

          t._updateCounter = 0; //当前分帧渲染帧数

          t._updateDone = true; //分帧渲染是否完成

          t.curPageNum = 0; //当前页数

          if (t.cyclic || 0) {
            t._scrollView['_processAutoScrolling'] = this._processAutoScrolling.bind(t);

            t._scrollView['_startBounceBackIfNeeded'] = function () {
              return false;
            };
          }

          switch (t._align) {
            case Layout.Type.HORIZONTAL:
              {
                switch (t._horizontalDir) {
                  case Layout.HorizontalDirection.LEFT_TO_RIGHT:
                    t._alignCalcType = 1;
                    break;

                  case Layout.HorizontalDirection.RIGHT_TO_LEFT:
                    t._alignCalcType = 2;
                    break;
                }

                break;
              }

            case Layout.Type.VERTICAL:
              {
                switch (t._verticalDir) {
                  case Layout.VerticalDirection.TOP_TO_BOTTOM:
                    t._alignCalcType = 3;
                    break;

                  case Layout.VerticalDirection.BOTTOM_TO_TOP:
                    t._alignCalcType = 4;
                    break;
                }

                break;
              }

            case Layout.Type.GRID:
              {
                switch (t._startAxis) {
                  case Layout.AxisDirection.HORIZONTAL:
                    switch (t._verticalDir) {
                      case Layout.VerticalDirection.TOP_TO_BOTTOM:
                        t._alignCalcType = 3;
                        break;

                      case Layout.VerticalDirection.BOTTOM_TO_TOP:
                        t._alignCalcType = 4;
                        break;
                    }

                    break;

                  case Layout.AxisDirection.VERTICAL:
                    switch (t._horizontalDir) {
                      case Layout.HorizontalDirection.LEFT_TO_RIGHT:
                        t._alignCalcType = 1;
                        break;

                      case Layout.HorizontalDirection.RIGHT_TO_LEFT:
                        t._alignCalcType = 2;
                        break;
                    }

                    break;
                }

                break;
              }
          } // 清空 content
          // t.content.children.forEach((child: Node) => {
          //     child.removeFromParent();
          //     if (child != t.tmpNode && child.isValid)
          //         child.destroy();
          // });


          t.content.removeAllChildren();
          t._inited = true;
        }
        /**
         * 为了实现循环列表，必须覆写cc.ScrollView的某些函数
         * @param {Number} dt
         */
        ;

        _proto._processAutoScrolling = function _processAutoScrolling(dt) {
          // ------------- scroll-view 里定义的一些常量 -------------
          var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
          var EPSILON = 1e-4;
          var ZERO = new Vec3();

          var quintEaseOut = function quintEaseOut(time) {
            time -= 1;
            return time * time * time * time * time + 1;
          }; // ------------- scroll-view 里定义的一些常量 -------------


          var sv = this._scrollView;
          var isAutoScrollBrake = sv['_isNecessaryAutoScrollBrake']();
          var brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
          sv['_autoScrollAccumulatedTime'] += dt * (1 / brakingFactor);
          var percentage = Math.min(1, sv['_autoScrollAccumulatedTime'] / sv['_autoScrollTotalTime']);

          if (sv['_autoScrollAttenuate']) {
            percentage = quintEaseOut(percentage);
          }

          var clonedAutoScrollTargetDelta = sv['_autoScrollTargetDelta'].clone();
          clonedAutoScrollTargetDelta.multiplyScalar(percentage);
          var clonedAutoScrollStartPosition = sv['_autoScrollStartPosition'].clone();
          clonedAutoScrollStartPosition.add(clonedAutoScrollTargetDelta);
          var reachedEnd = Math.abs(percentage - 1) <= EPSILON;
          var fireEvent = Math.abs(percentage - 1) <= sv['getScrollEndedEventTiming']();

          if (fireEvent && !sv['_isScrollEndedWithThresholdEventFired']) {
            sv['_dispatchEvent'](ScrollView.EventType.SCROLL_ENG_WITH_THRESHOLD);
            sv['_isScrollEndedWithThresholdEventFired'] = true;
          }

          if (sv['elastic']) {
            var brakeOffsetPosition = clonedAutoScrollStartPosition.clone();
            brakeOffsetPosition.subtract(sv['_autoScrollBrakingStartPosition']);

            if (isAutoScrollBrake) {
              brakeOffsetPosition.multiplyScalar(brakingFactor);
            }

            clonedAutoScrollStartPosition.set(sv['_autoScrollBrakingStartPosition']);
            clonedAutoScrollStartPosition.add(brakeOffsetPosition);
          } else {
            var moveDelta = clonedAutoScrollStartPosition.clone();
            moveDelta.subtract(sv['_getContentPosition']());
            var outOfBoundary = sv['_getHowMuchOutOfBoundary'](moveDelta);

            if (!outOfBoundary.equals(ZERO, EPSILON)) {
              clonedAutoScrollStartPosition.add(outOfBoundary);
              reachedEnd = true;
            }
          }

          if (reachedEnd) {
            sv['_autoScrolling'] = false;
          }

          var deltaMove = new Vec3(clonedAutoScrollStartPosition);
          deltaMove.subtract(sv['_getContentPosition']());
          sv['_clampDelta'](deltaMove);
          sv['_moveContent'](deltaMove, reachedEnd);
          sv['_dispatchEvent'](ScrollView.EventType.SCROLLING);

          if (!sv['_autoScrolling']) {
            sv['_isBouncing'] = false;
            sv['_scrolling'] = false;
            sv['_dispatchEvent'](ScrollView.EventType.SCROLL_ENDED);
          }
        } //设置模板Item
        ;

        _proto.setTemplateItem = function setTemplateItem(item) {
          if (!item) return;
          var t = this;
          t._itemTmp = item;
          t._itemTmpUt = item.getComponent(UITransform);
          if (t._resizeMode == Layout.ResizeMode.CHILDREN) t._itemSize = t._layout.cellSize;else {
            var itemUt = item.getComponent(UITransform);
            t._itemSize = new Size(itemUt.width, itemUt.height);
          } //获取ListItem，如果没有就取消选择模式

          var com = item.getComponent(ListItem);
          var remove = false;
          if (!com) remove = true; // if (com) {
          //     if (!com._btnCom && !item.getComponent(cc.Button)) {
          //         remove = true;
          //     }
          // }

          if (remove) {
            t.selectedMode = SelectedType.NONE;
          }

          com = item.getComponent(Widget);

          if (com && com.enabled) {
            t._needUpdateWidget = true;
          }

          if (t.selectedMode == SelectedType.MULT) t.multSelected = [];

          switch (t._align) {
            case Layout.Type.HORIZONTAL:
              t._colLineNum = 1;
              t._sizeType = false;
              break;

            case Layout.Type.VERTICAL:
              t._colLineNum = 1;
              t._sizeType = true;
              break;

            case Layout.Type.GRID:
              switch (t._startAxis) {
                case Layout.AxisDirection.HORIZONTAL:
                  //计算列数
                  var trimW = t._contentUt.width - t._leftGap - t._rightGap;
                  t._colLineNum = Math.floor((trimW + t._columnGap) / (t._itemSize.width + t._columnGap));
                  t._sizeType = true;
                  break;

                case Layout.AxisDirection.VERTICAL:
                  //计算行数
                  var trimH = t._contentUt.height - t._topGap - t._bottomGap;
                  t._colLineNum = Math.floor((trimH + t._lineGap) / (t._itemSize.height + t._lineGap));
                  t._sizeType = false;
                  break;
              }

              break;
          }
        }
        /**
         * 检查是否初始化
         * @param {Boolean} printLog 是否打印错误信息
         * @returns
         */
        ;

        _proto.checkInited = function checkInited(printLog) {
          if (printLog === void 0) {
            printLog = true;
          }

          if (!this._inited) {
            if (printLog) console.error('List initialization not completed!');
            return false;
          }

          return true;
        } //禁用 Layout 组件，自行计算 Content Size
        ;

        _proto._resizeContent = function _resizeContent() {
          var t = this;
          var result;

          switch (t._align) {
            case Layout.Type.HORIZONTAL:
              {
                if (t._customSize) {
                  var fixed = t._getFixedSize(null);

                  result = t._leftGap + fixed.val + t._itemSize.width * (t._numItems - fixed.count) + t._columnGap * (t._numItems - 1) + t._rightGap;
                } else {
                  result = t._leftGap + t._itemSize.width * t._numItems + t._columnGap * (t._numItems - 1) + t._rightGap;
                }

                break;
              }

            case Layout.Type.VERTICAL:
              {
                if (t._customSize) {
                  var _fixed = t._getFixedSize(null);

                  result = t._topGap + _fixed.val + t._itemSize.height * (t._numItems - _fixed.count) + t._lineGap * (t._numItems - 1) + t._bottomGap;
                } else {
                  result = t._topGap + t._itemSize.height * t._numItems + t._lineGap * (t._numItems - 1) + t._bottomGap;
                }

                break;
              }

            case Layout.Type.GRID:
              {
                //网格模式不支持居中
                if (t.lackCenter) t.lackCenter = false;

                switch (t._startAxis) {
                  case Layout.AxisDirection.HORIZONTAL:
                    var lineNum = Math.ceil(t._numItems / t._colLineNum);
                    result = t._topGap + t._itemSize.height * lineNum + t._lineGap * (lineNum - 1) + t._bottomGap;
                    break;

                  case Layout.AxisDirection.VERTICAL:
                    var colNum = Math.ceil(t._numItems / t._colLineNum);
                    result = t._leftGap + t._itemSize.width * colNum + t._columnGap * (colNum - 1) + t._rightGap;
                    break;
                }

                break;
              }
          }

          var layout = t.content.getComponent(Layout);
          if (layout) layout.enabled = false;
          t._allItemSize = result;
          t._allItemSizeNoEdge = t._allItemSize - (t._sizeType ? t._topGap + t._bottomGap : t._leftGap + t._rightGap);

          if (t.cyclic) {
            var totalSize = t._sizeType ? t._thisNodeUt.height : t._thisNodeUt.width;
            t._cyclicPos1 = 0;
            totalSize -= t._cyclicPos1;
            t._cyclicNum = Math.ceil(totalSize / t._allItemSizeNoEdge) + 1;
            var spacing = t._sizeType ? t._lineGap : t._columnGap;
            t._cyclicPos2 = t._cyclicPos1 + t._allItemSizeNoEdge + spacing;
            t._cyclicAllItemSize = t._allItemSize + t._allItemSizeNoEdge * (t._cyclicNum - 1) + spacing * (t._cyclicNum - 1);
            t._cycilcAllItemSizeNoEdge = t._allItemSizeNoEdge * t._cyclicNum;
            t._cycilcAllItemSizeNoEdge += spacing * (t._cyclicNum - 1); // cc.log('_cyclicNum ->', t._cyclicNum, t._allItemSizeNoEdge, t._allItemSize, t._cyclicPos1, t._cyclicPos2);
          }

          t._lack = !t.cyclic && t._allItemSize < (t._sizeType ? t._thisNodeUt.height : t._thisNodeUt.width);
          var slideOffset = (!t._lack || !t.lackCenter) && t.lackSlide ? 0 : .1;
          var targetWH = t._lack ? (t._sizeType ? t._thisNodeUt.height : t._thisNodeUt.width) - slideOffset : t.cyclic ? t._cyclicAllItemSize : t._allItemSize;
          if (targetWH < 0) targetWH = 0;

          if (t._sizeType) {
            t._contentUt.height = targetWH;
          } else {
            t._contentUt.width = targetWH;
          } // cc.log('_resizeContent()  numItems =', t._numItems, '，content =', t.content);

        } //滚动进行时...
        ;

        _proto._onScrolling = function _onScrolling(ev) {
          if (ev === void 0) {
            ev = null;
          }

          if (this.frameCount == null) this.frameCount = this._updateRate;

          if (!this._forceUpdate && ev && ev.type != 'scroll-ended' && this.frameCount > 0) {
            this.frameCount--;
            return;
          } else this.frameCount = this._updateRate;

          if (this._aniDelRuning) return; //循环列表处理

          if (this.cyclic) {
            var scrollPos = this.content.getPosition();
            scrollPos = this._sizeType ? scrollPos.y : scrollPos.x;
            var addVal = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap);
            var add = this._sizeType ? new Vec3(0, addVal, 0) : new Vec3(addVal, 0, 0);
            var contentPos = this.content.getPosition();

            switch (this._alignCalcType) {
              case 1:
                //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                if (scrollPos > -this._cyclicPos1) {
                  contentPos.set(-this._cyclicPos2, contentPos.y, contentPos.z);
                  this.content.setPosition(contentPos);

                  if (this._scrollView.isAutoScrolling()) {
                    this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                  } // if (this._beganPos) {
                  //     this._beganPos += add;
                  // }

                } else if (scrollPos < -this._cyclicPos2) {
                  contentPos.set(-this._cyclicPos1, contentPos.y, contentPos.z);
                  this.content.setPosition(contentPos);

                  if (this._scrollView.isAutoScrolling()) {
                    this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                  } // if (this._beganPos) {
                  //     this._beganPos -= add;
                  // }

                }

                break;

              case 2:
                //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                if (scrollPos < this._cyclicPos1) {
                  contentPos.set(this._cyclicPos2, contentPos.y, contentPos.z);
                  this.content.setPosition(contentPos);

                  if (this._scrollView.isAutoScrolling()) {
                    this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                  }
                } else if (scrollPos > this._cyclicPos2) {
                  contentPos.set(this._cyclicPos1, contentPos.y, contentPos.z);
                  this.content.setPosition(contentPos);

                  if (this._scrollView.isAutoScrolling()) {
                    this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                  }
                }

                break;

              case 3:
                //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                if (scrollPos < this._cyclicPos1) {
                  contentPos.set(contentPos.x, this._cyclicPos2, contentPos.z);
                  this.content.setPosition(contentPos);

                  if (this._scrollView.isAutoScrolling()) {
                    this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                  }
                } else if (scrollPos > this._cyclicPos2) {
                  contentPos.set(contentPos.x, this._cyclicPos1, contentPos.z);
                  this.content.setPosition(contentPos);

                  if (this._scrollView.isAutoScrolling()) {
                    this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                  }
                }

                break;

              case 4:
                //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                if (scrollPos > -this._cyclicPos1) {
                  contentPos.set(contentPos.x, -this._cyclicPos2, contentPos.z);
                  this.content.setPosition(contentPos);

                  if (this._scrollView.isAutoScrolling()) {
                    this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].subtract(add);
                  }
                } else if (scrollPos < -this._cyclicPos2) {
                  contentPos.set(contentPos.x, -this._cyclicPos1, contentPos.z);
                  this.content.setPosition(contentPos);

                  if (this._scrollView.isAutoScrolling()) {
                    this._scrollView['_autoScrollStartPosition'] = this._scrollView['_autoScrollStartPosition'].add(add);
                  }
                }

                break;
            }
          }

          this._calcViewPos();

          var vTop, vRight, vBottom, vLeft;

          if (this._sizeType) {
            vTop = this.viewTop;
            vBottom = this.viewBottom;
          } else {
            vRight = this.viewRight;
            vLeft = this.viewLeft;
          }

          if (this._virtual) {
            this.displayData = [];
            var itemPos;
            var curId = 0;
            var endId = this._numItems - 1;

            if (this._customSize) {
              var breakFor = false; //如果该item的位置在可视区域内，就推入displayData

              for (; curId <= endId && !breakFor; curId++) {
                itemPos = this._calcItemPos(curId);

                switch (this._align) {
                  case Layout.Type.HORIZONTAL:
                    if (itemPos.right >= vLeft && itemPos.left <= vRight) {
                      this.displayData.push(itemPos);
                    } else if (curId != 0 && this.displayData.length > 0) {
                      breakFor = true;
                    }

                    break;

                  case Layout.Type.VERTICAL:
                    if (itemPos.bottom <= vTop && itemPos.top >= vBottom) {
                      this.displayData.push(itemPos);
                    } else if (curId != 0 && this.displayData.length > 0) {
                      breakFor = true;
                    }

                    break;

                  case Layout.Type.GRID:
                    switch (this._startAxis) {
                      case Layout.AxisDirection.HORIZONTAL:
                        if (itemPos.bottom <= vTop && itemPos.top >= vBottom) {
                          this.displayData.push(itemPos);
                        } else if (curId != 0 && this.displayData.length > 0) {
                          breakFor = true;
                        }

                        break;

                      case Layout.AxisDirection.VERTICAL:
                        if (itemPos.right >= vLeft && itemPos.left <= vRight) {
                          this.displayData.push(itemPos);
                        } else if (curId != 0 && this.displayData.length > 0) {
                          breakFor = true;
                        }

                        break;
                    }

                    break;
                }
              }
            } else {
              var ww = this._itemSize.width + this._columnGap;
              var hh = this._itemSize.height + this._lineGap;

              switch (this._alignCalcType) {
                case 1:
                  //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                  curId = (vLeft - this._leftGap) / ww;
                  endId = (vRight - this._leftGap) / ww;
                  break;

                case 2:
                  //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                  curId = (-vRight - this._rightGap) / ww;
                  endId = (-vLeft - this._rightGap) / ww;
                  break;

                case 3:
                  //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                  curId = (-vTop - this._topGap) / hh;
                  endId = (-vBottom - this._topGap) / hh;
                  break;

                case 4:
                  //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                  curId = (vBottom - this._bottomGap) / hh;
                  endId = (vTop - this._bottomGap) / hh;
                  break;
              }

              curId = Math.floor(curId) * this._colLineNum;
              endId = Math.ceil(endId) * this._colLineNum;
              endId--;
              if (curId < 0) curId = 0;
              if (endId >= this._numItems) endId = this._numItems - 1;

              for (; curId <= endId; curId++) {
                this.displayData.push(this._calcItemPos(curId));
              }
            }

            this._delRedundantItem();

            if (this.displayData.length <= 0 || !this._numItems) {
              //if none, delete all.
              this._lastDisplayData = [];
              return;
            }

            this.firstListId = this.displayData[0].id;
            this.displayItemNum = this.displayData.length;
            var len = this._lastDisplayData.length;
            var haveDataChange = this.displayItemNum != len;

            if (haveDataChange) {
              // 如果是逐帧渲染，需要排序
              if (this.frameByFrameRenderNum > 0) {
                this._lastDisplayData.sort(function (a, b) {
                  return a - b;
                });
              } // 因List的显示数据是有序的，所以只需要判断数组长度是否相等，以及头、尾两个元素是否相等即可。


              haveDataChange = this.firstListId != this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[len - 1];
            }

            if (this._forceUpdate || haveDataChange) {
              //如果是强制更新
              if (this.frameByFrameRenderNum > 0) {
                // if (this._updateDone) {
                // this._lastDisplayData = [];
                //逐帧渲染
                if (this._numItems > 0) {
                  if (!this._updateDone) {
                    this._doneAfterUpdate = true;
                  } else {
                    this._updateCounter = 0;
                  }

                  this._updateDone = false;
                } else {
                  this._updateCounter = 0;
                  this._updateDone = true;
                } // }

              } else {
                //直接渲染
                this._lastDisplayData = []; // cc.log('List Display Data II::', this.displayData);

                for (var c = 0; c < this.displayItemNum; c++) {
                  this._createOrUpdateItem(this.displayData[c]);
                }

                this._forceUpdate = false;
              }
            }

            this._calcNearestItem();
          }
        } //计算可视范围
        ;

        _proto._calcViewPos = function _calcViewPos() {
          var scrollPos = this.content.getPosition();

          switch (this._alignCalcType) {
            case 1:
              //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
              this.elasticLeft = scrollPos.x > 0 ? scrollPos.x : 0;
              this.viewLeft = (scrollPos.x < 0 ? -scrollPos.x : 0) - this.elasticLeft;
              this.viewRight = this.viewLeft + this._thisNodeUt.width;
              this.elasticRight = this.viewRight > this._contentUt.width ? Math.abs(this.viewRight - this._contentUt.width) : 0;
              this.viewRight += this.elasticRight; // cc.log(this.elasticLeft, this.elasticRight, this.viewLeft, this.viewRight);

              break;

            case 2:
              //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
              this.elasticRight = scrollPos.x < 0 ? -scrollPos.x : 0;
              this.viewRight = (scrollPos.x > 0 ? -scrollPos.x : 0) + this.elasticRight;
              this.viewLeft = this.viewRight - this._thisNodeUt.width;
              this.elasticLeft = this.viewLeft < -this._contentUt.width ? Math.abs(this.viewLeft + this._contentUt.width) : 0;
              this.viewLeft -= this.elasticLeft; // cc.log(this.elasticLeft, this.elasticRight, this.viewLeft, this.viewRight);

              break;

            case 3:
              //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
              this.elasticTop = scrollPos.y < 0 ? Math.abs(scrollPos.y) : 0;
              this.viewTop = (scrollPos.y > 0 ? -scrollPos.y : 0) + this.elasticTop;
              this.viewBottom = this.viewTop - this._thisNodeUt.height;
              this.elasticBottom = this.viewBottom < -this._contentUt.height ? Math.abs(this.viewBottom + this._contentUt.height) : 0;
              this.viewBottom += this.elasticBottom; // cc.log(this.elasticTop, this.elasticBottom, this.viewTop, this.viewBottom);

              break;

            case 4:
              //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
              this.elasticBottom = scrollPos.y > 0 ? Math.abs(scrollPos.y) : 0;
              this.viewBottom = (scrollPos.y < 0 ? -scrollPos.y : 0) - this.elasticBottom;
              this.viewTop = this.viewBottom + this._thisNodeUt.height;
              this.elasticTop = this.viewTop > this._contentUt.height ? Math.abs(this.viewTop - this._contentUt.height) : 0;
              this.viewTop -= this.elasticTop; // cc.log(this.elasticTop, this.elasticBottom, this.viewTop, this.viewBottom);

              break;
          }
        } //计算位置 根据id
        ;

        _proto._calcItemPos = function _calcItemPos(id) {
          var width, height, top, bottom, left, right, itemX, itemY;

          switch (this._align) {
            case Layout.Type.HORIZONTAL:
              switch (this._horizontalDir) {
                case Layout.HorizontalDirection.LEFT_TO_RIGHT:
                  {
                    if (this._customSize) {
                      var fixed = this._getFixedSize(id);

                      left = this._leftGap + (this._itemSize.width + this._columnGap) * (id - fixed.count) + (fixed.val + this._columnGap * fixed.count);
                      var cs = this._customSize[id];
                      width = cs > 0 ? cs : this._itemSize.width;
                    } else {
                      left = this._leftGap + (this._itemSize.width + this._columnGap) * id;
                      width = this._itemSize.width;
                    }

                    if (this.lackCenter) {
                      left -= this._leftGap;
                      var offset = this._contentUt.width / 2 - this._allItemSizeNoEdge / 2;
                      left += offset;
                    }

                    right = left + width;
                    return {
                      id: id,
                      left: left,
                      right: right,
                      x: left + this._itemTmpUt.anchorX * width,
                      y: this._itemTmp.y
                    };
                  }

                case Layout.HorizontalDirection.RIGHT_TO_LEFT:
                  {
                    if (this._customSize) {
                      var _fixed2 = this._getFixedSize(id);

                      right = -this._rightGap - (this._itemSize.width + this._columnGap) * (id - _fixed2.count) - (_fixed2.val + this._columnGap * _fixed2.count);
                      var _cs = this._customSize[id];
                      width = _cs > 0 ? _cs : this._itemSize.width;
                    } else {
                      right = -this._rightGap - (this._itemSize.width + this._columnGap) * id;
                      width = this._itemSize.width;
                    }

                    if (this.lackCenter) {
                      right += this._rightGap;

                      var _offset = this._contentUt.width / 2 - this._allItemSizeNoEdge / 2;

                      right -= _offset;
                    }

                    left = right - width;
                    return {
                      id: id,
                      right: right,
                      left: left,
                      x: left + this._itemTmpUt.anchorX * width,
                      y: this._itemTmp.y
                    };
                  }
              }

              break;

            case Layout.Type.VERTICAL:
              {
                switch (this._verticalDir) {
                  case Layout.VerticalDirection.TOP_TO_BOTTOM:
                    {
                      if (this._customSize) {
                        var _fixed3 = this._getFixedSize(id);

                        top = -this._topGap - (this._itemSize.height + this._lineGap) * (id - _fixed3.count) - (_fixed3.val + this._lineGap * _fixed3.count);
                        var _cs2 = this._customSize[id];
                        height = _cs2 > 0 ? _cs2 : this._itemSize.height;
                      } else {
                        top = -this._topGap - (this._itemSize.height + this._lineGap) * id;
                        height = this._itemSize.height;
                      }

                      if (this.lackCenter) {
                        top += this._topGap;

                        var _offset2 = this._contentUt.height / 2 - this._allItemSizeNoEdge / 2;

                        top -= _offset2;
                      }

                      bottom = top - height;
                      return {
                        id: id,
                        top: top,
                        bottom: bottom,
                        x: this._itemTmp.x,
                        y: bottom + this._itemTmpUt.anchorY * height
                      };
                    }

                  case Layout.VerticalDirection.BOTTOM_TO_TOP:
                    {
                      if (this._customSize) {
                        var _fixed4 = this._getFixedSize(id);

                        bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * (id - _fixed4.count) + (_fixed4.val + this._lineGap * _fixed4.count);
                        var _cs3 = this._customSize[id];
                        height = _cs3 > 0 ? _cs3 : this._itemSize.height;
                      } else {
                        bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * id;
                        height = this._itemSize.height;
                      }

                      if (this.lackCenter) {
                        bottom -= this._bottomGap;

                        var _offset3 = this._contentUt.height / 2 - this._allItemSizeNoEdge / 2;

                        bottom += _offset3;
                      }

                      top = bottom + height;
                      return {
                        id: id,
                        top: top,
                        bottom: bottom,
                        x: this._itemTmp.x,
                        y: bottom + this._itemTmpUt.anchorY * height
                      };
                    }
                }
              }

            case Layout.Type.GRID:
              {
                var colLine = Math.floor(id / this._colLineNum);

                switch (this._startAxis) {
                  case Layout.AxisDirection.HORIZONTAL:
                    {
                      switch (this._verticalDir) {
                        case Layout.VerticalDirection.TOP_TO_BOTTOM:
                          {
                            top = -this._topGap - (this._itemSize.height + this._lineGap) * colLine;
                            bottom = top - this._itemSize.height;
                            itemY = bottom + this._itemTmpUt.anchorY * this._itemSize.height;
                            break;
                          }

                        case Layout.VerticalDirection.BOTTOM_TO_TOP:
                          {
                            bottom = this._bottomGap + (this._itemSize.height + this._lineGap) * colLine;
                            top = bottom + this._itemSize.height;
                            itemY = bottom + this._itemTmpUt.anchorY * this._itemSize.height;
                            break;
                          }
                      }

                      itemX = this._leftGap + id % this._colLineNum * (this._itemSize.width + this._columnGap);

                      switch (this._horizontalDir) {
                        case Layout.HorizontalDirection.LEFT_TO_RIGHT:
                          {
                            itemX += this._itemTmpUt.anchorX * this._itemSize.width;
                            itemX -= this._contentUt.anchorX * this._contentUt.width;
                            break;
                          }

                        case Layout.HorizontalDirection.RIGHT_TO_LEFT:
                          {
                            itemX += (1 - this._itemTmpUt.anchorX) * this._itemSize.width;
                            itemX -= (1 - this._contentUt.anchorX) * this._contentUt.width;
                            itemX *= -1;
                            break;
                          }
                      }

                      return {
                        id: id,
                        top: top,
                        bottom: bottom,
                        x: itemX,
                        y: itemY
                      };
                    }

                  case Layout.AxisDirection.VERTICAL:
                    {
                      switch (this._horizontalDir) {
                        case Layout.HorizontalDirection.LEFT_TO_RIGHT:
                          {
                            left = this._leftGap + (this._itemSize.width + this._columnGap) * colLine;
                            right = left + this._itemSize.width;
                            itemX = left + this._itemTmpUt.anchorX * this._itemSize.width;
                            itemX -= this._contentUt.anchorX * this._contentUt.width;
                            break;
                          }

                        case Layout.HorizontalDirection.RIGHT_TO_LEFT:
                          {
                            right = -this._rightGap - (this._itemSize.width + this._columnGap) * colLine;
                            left = right - this._itemSize.width;
                            itemX = left + this._itemTmpUt.anchorX * this._itemSize.width;
                            itemX += (1 - this._contentUt.anchorX) * this._contentUt.width;
                            break;
                          }
                      }

                      itemY = -this._topGap - id % this._colLineNum * (this._itemSize.height + this._lineGap);

                      switch (this._verticalDir) {
                        case Layout.VerticalDirection.TOP_TO_BOTTOM:
                          {
                            itemY -= (1 - this._itemTmpUt.anchorY) * this._itemSize.height;
                            itemY += (1 - this._contentUt.anchorY) * this._contentUt.height;
                            break;
                          }

                        case Layout.VerticalDirection.BOTTOM_TO_TOP:
                          {
                            itemY -= this._itemTmpUt.anchorY * this._itemSize.height;
                            itemY += this._contentUt.anchorY * this._contentUt.height;
                            itemY *= -1;
                            break;
                          }
                      }

                      return {
                        id: id,
                        left: left,
                        right: right,
                        x: itemX,
                        y: itemY
                      };
                    }
                }

                break;
              }
          }
        } //计算已存在的Item的位置
        ;

        _proto._calcExistItemPos = function _calcExistItemPos(id) {
          var item = this.getItemByListId(id);
          if (!item) return null;
          var ut = item.getComponent(UITransform);
          var pos = item.getPosition();
          var data = {
            id: id,
            x: pos.x,
            y: pos.y
          };

          if (this._sizeType) {
            data.top = pos.y + ut.height * (1 - ut.anchorY);
            data.bottom = pos.y - ut.height * ut.anchorY;
          } else {
            data.left = pos.x - ut.width * ut.anchorX;
            data.right = pos.x + ut.width * (1 - ut.anchorX);
          }

          return data;
        } //获取Item位置
        ;

        _proto.getItemPos = function getItemPos(id) {
          if (this._virtual) return this._calcItemPos(id);else {
            if (this.frameByFrameRenderNum) return this._calcItemPos(id);else return this._calcExistItemPos(id);
          }
        } //获取固定尺寸
        ;

        _proto._getFixedSize = function _getFixedSize(listId) {
          if (!this._customSize) return null;
          if (listId == null) listId = this._numItems;
          var fixed = 0;
          var count = 0;

          for (var id in this._customSize) {
            if (parseInt(id) < listId) {
              fixed += this._customSize[id];
              count++;
            }
          }

          return {
            val: fixed,
            count: count
          };
        } //滚动结束时..
        ;

        _proto._onScrollBegan = function _onScrollBegan() {
          this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
        } //滚动结束时..
        ;

        _proto._onScrollEnded = function _onScrollEnded() {
          var t = this;
          t._curScrollIsTouch = false;

          if (t.scrollToListId != null) {
            var item = t.getItemByListId(t.scrollToListId);
            t.scrollToListId = null;

            if (item) {
              tween(item).to(.1, {
                scale: 1.06
              }).to(.1, {
                scale: 1
              }).start();
            }
          }

          t._onScrolling();

          if (t._slideMode == SlideType.ADHERING && !t.adhering) {
            //cc.log(t.adhering, t._scrollView.isAutoScrolling(), t._scrollView.isScrolling());
            t.adhere();
          } else if (t._slideMode == SlideType.PAGE) {
            if (t._beganPos != null && t._curScrollIsTouch) {
              this._pageAdhere();
            } else {
              t.adhere();
            }
          }
        } // 触摸时
        ;

        _proto._onTouchStart = function _onTouchStart(ev, captureListeners) {
          if (this._scrollView['_hasNestedViewGroup'](ev, captureListeners)) return;
          this._curScrollIsTouch = true;
          var isMe = ev.eventPhase === Event.AT_TARGET && ev.target === this.node;

          if (!isMe) {
            var itemNode = ev.target;

            while (itemNode._listId == null && itemNode.parent) {
              itemNode = itemNode.parent;
            }

            this._scrollItem = itemNode._listId != null ? itemNode : ev.target;
          }
        } //触摸抬起时..
        ;

        _proto._onTouchUp = function _onTouchUp() {
          var t = this;
          t._scrollPos = null;

          if (t._slideMode == SlideType.ADHERING) {
            if (this.adhering) this._adheringBarrier = true;
            t.adhere();
          } else if (t._slideMode == SlideType.PAGE) {
            if (t._beganPos != null) {
              this._pageAdhere();
            } else {
              t.adhere();
            }
          }

          this._scrollItem = null;
        };

        _proto._onTouchCancelled = function _onTouchCancelled(ev, captureListeners) {
          var t = this;
          if (t._scrollView['_hasNestedViewGroup'](ev, captureListeners) || ev.simulate) return;
          t._scrollPos = null;

          if (t._slideMode == SlideType.ADHERING) {
            if (t.adhering) t._adheringBarrier = true;
            t.adhere();
          } else if (t._slideMode == SlideType.PAGE) {
            if (t._beganPos != null) {
              t._pageAdhere();
            } else {
              t.adhere();
            }
          }

          this._scrollItem = null;
        } //当尺寸改变
        ;

        _proto._onSizeChanged = function _onSizeChanged() {
          if (this.checkInited(false)) this._onScrolling();
        } //当Item自适应
        ;

        _proto._onItemAdaptive = function _onItemAdaptive(item) {
          var ut = item.getComponent(UITransform); // if (this.checkInited(false)) {

          if (!this._sizeType && ut.width != this._itemSize.width || this._sizeType && ut.height != this._itemSize.height) {
            if (!this._customSize) this._customSize = {};
            var val = this._sizeType ? ut.height : ut.width;

            if (this._customSize[item._listId] != val) {
              this._customSize[item._listId] = val;

              this._resizeContent(); // this.content.children.forEach((child: Node) => {
              //     this._updateItemPos(child);
              // });


              this.updateAll(); // 如果当前正在运行 scrollTo，肯定会不准确，在这里做修正

              if (this._scrollToListId != null) {
                this._scrollPos = null;
                this.unschedule(this._scrollToSo);
                this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - new Date().getTime() / 1000));
              }
            }
          } // }

        } //PAGE粘附
        ;

        _proto._pageAdhere = function _pageAdhere() {
          var t = this;
          if (!t.cyclic && (t.elasticTop > 0 || t.elasticRight > 0 || t.elasticBottom > 0 || t.elasticLeft > 0)) return;
          var curPos = t._sizeType ? t.viewTop : t.viewLeft;
          var dis = (t._sizeType ? t._thisNodeUt.height : t._thisNodeUt.width) * t.pageDistance;
          var canSkip = Math.abs(t._beganPos - curPos) > dis;

          if (canSkip) {
            var timeInSecond = .5;

            switch (t._alignCalcType) {
              case 1: //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）

              case 4:
                //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                if (t._beganPos > curPos) {
                  t.prePage(timeInSecond); // cc.log('_pageAdhere   PPPPPPPPPPPPPPP');
                } else {
                  t.nextPage(timeInSecond); // cc.log('_pageAdhere   NNNNNNNNNNNNNNN');
                }

                break;

              case 2: //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）

              case 3:
                //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                if (t._beganPos < curPos) {
                  t.prePage(timeInSecond);
                } else {
                  t.nextPage(timeInSecond);
                }

                break;
            }
          } else if (t.elasticTop <= 0 && t.elasticRight <= 0 && t.elasticBottom <= 0 && t.elasticLeft <= 0) {
            t.adhere();
          }

          t._beganPos = null;
        } //粘附
        ;

        _proto.adhere = function adhere() {
          var t = this;
          if (!t.checkInited()) return;
          if (t.elasticTop > 0 || t.elasticRight > 0 || t.elasticBottom > 0 || t.elasticLeft > 0) return;
          t.adhering = true;

          t._calcNearestItem();

          var offset = (t._sizeType ? t._topGap : t._leftGap) / (t._sizeType ? t._thisNodeUt.height : t._thisNodeUt.width);
          var timeInSecond = .7;
          t.scrollTo(t.nearestListId, timeInSecond, offset);
        } //Update..
        ;

        _proto.update = function update() {
          if (this.frameByFrameRenderNum <= 0 || this._updateDone) return; // cc.log(this.displayData.length, this._updateCounter, this.displayData[this._updateCounter]);

          if (this._virtual) {
            var len = this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum ? this.displayItemNum : this._updateCounter + this.frameByFrameRenderNum;

            for (var n = this._updateCounter; n < len; n++) {
              var data = this.displayData[n];

              if (data) {
                this._createOrUpdateItem(data);
              }
            }

            if (this._updateCounter >= this.displayItemNum - 1) {
              //最后一个
              if (this._doneAfterUpdate) {
                this._updateCounter = 0;
                this._updateDone = false; // if (!this._scrollView.isScrolling())

                this._doneAfterUpdate = false;
              } else {
                this._updateDone = true;

                this._delRedundantItem();

                this._forceUpdate = false;

                this._calcNearestItem();

                if (this.slideMode == SlideType.PAGE) this.curPageNum = this.nearestListId;
              }
            } else {
              this._updateCounter += this.frameByFrameRenderNum;
            }
          } else {
            if (this._updateCounter < this._numItems) {
              var _len2 = this._updateCounter + this.frameByFrameRenderNum > this._numItems ? this._numItems : this._updateCounter + this.frameByFrameRenderNum;

              for (var _n = this._updateCounter; _n < _len2; _n++) {
                this._createOrUpdateItem2(_n);
              }

              this._updateCounter += this.frameByFrameRenderNum;
            } else {
              this._updateDone = true;

              this._calcNearestItem();

              if (this.slideMode == SlideType.PAGE) this.curPageNum = this.nearestListId;
            }
          }
        }
        /**
         * 创建或更新Item（虚拟列表用）
         * @param {Object} data 数据
         */
        ;

        _proto._createOrUpdateItem = function _createOrUpdateItem(data) {
          var item = this.getItemByListId(data.id);

          if (!item) {
            //如果不存在
            var canGet = this._pool.size() > 0;

            if (canGet) {
              item = this._pool.get(); // cc.log('从池中取出::   旧id =', item['_listId'], '，新id =', data.id, item);
            } else {
              item = instantiate(this._itemTmp); // cc.log('新建::', data.id, item);
            }

            if (!canGet || !isValid(item)) {
              item = instantiate(this._itemTmp);
              canGet = false;
            }

            if (item._listId != data.id) {
              item._listId = data.id;
              var ut = item.getComponent(UITransform);
              ut.setContentSize(this._itemSize);
            }

            item.setPosition(new Vec3(data.x, data.y, 0));

            this._resetItemSize(item);

            this.content.addChild(item);

            if (canGet && this._needUpdateWidget) {
              var widget = item.getComponent(Widget);
              if (widget) widget.updateAlignment();
            }

            item.setSiblingIndex(this.content.children.length - 1);
            var listItem = item.getComponent(ListItem);
            item['listItem'] = listItem;

            if (listItem) {
              listItem.listId = data.id;
              listItem.list = this;

              listItem._registerEvent();
            }

            if (this.renderEvent) {
              EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
            }
          } else if (this._forceUpdate && this.renderEvent) {
            //强制更新
            item.setPosition(new Vec3(data.x, data.y, 0));

            this._resetItemSize(item); // cc.log('ADD::', data.id, item);


            if (this.renderEvent) {
              EventHandler.emitEvents([this.renderEvent], item, data.id % this._actualNumItems);
            }
          }

          this._resetItemSize(item);

          this._updateListItem(item['listItem']);

          if (this._lastDisplayData.indexOf(data.id) < 0) {
            this._lastDisplayData.push(data.id);
          }
        } //创建或更新Item（非虚拟列表用）
        ;

        _proto._createOrUpdateItem2 = function _createOrUpdateItem2(listId) {
          var item = this.content.children[listId];
          var listItem;

          if (!item) {
            //如果不存在
            item = instantiate(this._itemTmp);
            item._listId = listId;
            this.content.addChild(item);
            listItem = item.getComponent(ListItem);
            item['listItem'] = listItem;

            if (listItem) {
              listItem.listId = listId;
              listItem.list = this;

              listItem._registerEvent();
            }

            if (this.renderEvent) {
              EventHandler.emitEvents([this.renderEvent], item, listId % this._actualNumItems);
            }
          } else if (this._forceUpdate && this.renderEvent) {
            //强制更新
            item._listId = listId;
            if (listItem) listItem.listId = listId;

            if (this.renderEvent) {
              EventHandler.emitEvents([this.renderEvent], item, listId % this._actualNumItems);
            }
          }

          this._updateListItem(listItem);

          if (this._lastDisplayData.indexOf(listId) < 0) {
            this._lastDisplayData.push(listId);
          }
        };

        _proto._updateListItem = function _updateListItem(listItem) {
          if (!listItem) return;

          if (this.selectedMode > SelectedType.NONE) {
            var item = listItem.node;

            switch (this.selectedMode) {
              case SelectedType.SINGLE:
                listItem.selected = this.selectedId == item._listId;
                break;

              case SelectedType.MULT:
                listItem.selected = this.multSelected.indexOf(item._listId) >= 0;
                break;
            }
          }
        } //仅虚拟列表用
        ;

        _proto._resetItemSize = function _resetItemSize(item) {
          return;
        }
        /**
         * 更新Item位置
         * @param {Number||Node} listIdOrItem
         */
        ;

        _proto._updateItemPos = function _updateItemPos(listIdOrItem) {
          var item = isNaN(listIdOrItem) ? listIdOrItem : this.getItemByListId(listIdOrItem);
          var pos = this.getItemPos(item._listId);
          item.setPosition(pos.x, pos.y);
        }
        /**
         * 设置多选
         * @param {Array} args 可以是单个listId，也可是个listId数组
         * @param {Boolean} bool 值，如果为null的话，则直接用args覆盖
         */
        ;

        _proto.setMultSelected = function setMultSelected(args, bool) {
          var t = this;
          if (!t.checkInited()) return;

          if (!Array.isArray(args)) {
            args = [args];
          }

          if (bool == null) {
            t.multSelected = args;
          } else {
            var listId, sub;

            if (bool) {
              for (var n = args.length - 1; n >= 0; n--) {
                listId = args[n];
                sub = t.multSelected.indexOf(listId);

                if (sub < 0) {
                  t.multSelected.push(listId);
                }
              }
            } else {
              for (var _n2 = args.length - 1; _n2 >= 0; _n2--) {
                listId = args[_n2];
                sub = t.multSelected.indexOf(listId);

                if (sub >= 0) {
                  t.multSelected.splice(sub, 1);
                }
              }
            }
          }

          t._forceUpdate = true;

          t._onScrolling();
        }
        /**
         * 获取多选数据
         * @returns
         */
        ;

        _proto.getMultSelected = function getMultSelected() {
          return this.multSelected;
        }
        /**
         * 多选是否有选择
         * @param {number} listId 索引
         * @returns
         */
        ;

        _proto.hasMultSelected = function hasMultSelected(listId) {
          return this.multSelected && this.multSelected.indexOf(listId) >= 0;
        }
        /**
         * 更新指定的Item
         * @param {Array} args 单个listId，或者数组
         * @returns
         */
        ;

        _proto.updateItem = function updateItem(args) {
          if (!this.checkInited()) return;

          if (!Array.isArray(args)) {
            args = [args];
          }

          for (var n = 0, len = args.length; n < len; n++) {
            var listId = args[n];
            var item = this.getItemByListId(listId);
            if (item) EventHandler.emitEvents([this.renderEvent], item, listId % this._actualNumItems);
          }
        }
        /**
         * 更新全部
         */
        ;

        _proto.updateAll = function updateAll() {
          if (!this.checkInited()) return;
          this.numItems = this.numItems;
        }
        /**
         * 根据ListID获取Item
         * @param {Number} listId
         * @returns
         */
        ;

        _proto.getItemByListId = function getItemByListId(listId) {
          if (this.content) {
            for (var n = this.content.children.length - 1; n >= 0; n--) {
              var item = this.content.children[n];
              if (item._listId == listId) return item;
            }
          }
        }
        /**
         * 获取在显示区域外的Item
         * @returns
         */
        ;

        _proto._getOutsideItem = function _getOutsideItem() {
          var item;
          var result = [];

          for (var n = this.content.children.length - 1; n >= 0; n--) {
            item = this.content.children[n];

            if (!this.displayData.find(function (d) {
              return d.id == item._listId;
            })) {
              result.push(item);
            }
          }

          return result;
        } //删除显示区域以外的Item
        ;

        _proto._delRedundantItem = function _delRedundantItem() {
          if (this._virtual) {
            var arr = this._getOutsideItem();

            for (var n = arr.length - 1; n >= 0; n--) {
              var item = arr[n];
              if (this._scrollItem && item._listId == this._scrollItem._listId) continue;
              item.isCached = true;

              this._pool.put(item);

              for (var m = this._lastDisplayData.length - 1; m >= 0; m--) {
                if (this._lastDisplayData[m] == item._listId) {
                  this._lastDisplayData.splice(m, 1);

                  break;
                }
              }
            } // cc.log('存入::', str, '    pool.length =', this._pool.length);

          } else {
            while (this.content.children.length > this._numItems) {
              this._delSingleItem(this.content.children[this.content.children.length - 1]);
            }
          }
        } //删除单个Item
        ;

        _proto._delSingleItem = function _delSingleItem(item) {
          // cc.log('DEL::', item['_listId'], item);
          item.removeFromParent();
          if (item.destroy) item.destroy();
          item = null;
        }
        /** 
         * 动效删除Item（此方法只适用于虚拟列表，即_virtual=true）
         * 一定要在回调函数里重新设置新的numItems进行刷新，毕竟本List是靠数据驱动的。
         */
        ;

        _proto.aniDelItem = function aniDelItem(listId, callFunc, aniType) {
          var t = this;
          if (!t.checkInited() || t.cyclic || !t._virtual) return console.error('This function is not allowed to be called!');
          if (!callFunc) return console.error('CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!');
          if (t._aniDelRuning) return console.warn('Please wait for the current deletion to finish!');
          var item = t.getItemByListId(listId);
          var listItem;

          if (!item) {
            callFunc(listId);
            return;
          } else {
            listItem = item.getComponent(ListItem);
          }

          t._aniDelRuning = true;
          t._aniDelCB = callFunc;
          t._aniDelItem = item;
          t._aniDelBeforePos = item.position;
          t._aniDelBeforeScale = item.scale;
          var curLastId = t.displayData[t.displayData.length - 1].id;
          var resetSelectedId = listItem.selected;
          listItem.showAni(aniType, function () {
            //判断有没有下一个，如果有的话，创建粗来
            var newId;

            if (curLastId < t._numItems - 2) {
              newId = curLastId + 1;
            }

            if (newId != null) {
              var newData = t._calcItemPos(newId);

              t.displayData.push(newData);
              if (t._virtual) t._createOrUpdateItem(newData);else t._createOrUpdateItem2(newId);
            } else t._numItems--;

            if (t.selectedMode == SelectedType.SINGLE) {
              if (resetSelectedId) {
                t._selectedId = -1;
              } else if (t._selectedId - 1 >= 0) {
                t._selectedId--;
              }
            } else if (t.selectedMode == SelectedType.MULT && t.multSelected.length) {
              var sub = t.multSelected.indexOf(listId);

              if (sub >= 0) {
                t.multSelected.splice(sub, 1);
              } //多选的数据，在其后的全部减一


              for (var n = t.multSelected.length - 1; n >= 0; n--) {
                var id = t.multSelected[n];
                if (id >= listId) t.multSelected[n]--;
              }
            }

            if (t._customSize) {
              if (t._customSize[listId]) delete t._customSize[listId];
              var newCustomSize = {};
              var size;

              for (var _id in t._customSize) {
                size = t._customSize[_id];
                var idNumber = parseInt(_id);
                newCustomSize[idNumber - (idNumber >= listId ? 1 : 0)] = size;
              }

              t._customSize = newCustomSize;
            } //后面的Item向前怼的动效


            var sec = .2333;
            var twe, haveCB;

            for (var _n3 = newId != null ? newId : curLastId; _n3 >= listId + 1; _n3--) {
              item = t.getItemByListId(_n3);

              if (item) {
                var posData = t._calcItemPos(_n3 - 1);

                twe = tween(item).to(sec, {
                  position: new Vec3(posData.x, posData.y, 0)
                });

                if (_n3 <= listId + 1) {
                  haveCB = true;
                  twe.call(function () {
                    t._aniDelRuning = false;
                    callFunc(listId);
                    delete t._aniDelCB;
                  });
                }

                twe.start();
              }
            }

            if (!haveCB) {
              t._aniDelRuning = false;
              callFunc(listId);
              t._aniDelCB = null;
            }
          }, true);
        }
        /**
         * 滚动到..
         * @param {Number} listId 索引（如果<0，则滚到首个Item位置，如果>=_numItems，则滚到最末Item位置）
         * @param {Number} timeInSecond 时间
         * @param {Number} offset 索引目标位置偏移，0-1
         * @param {Boolean} overStress 滚动后是否强调该Item（这只是个实验功能）
         */
        ;

        _proto.scrollTo = function scrollTo(listId, timeInSecond, offset, overStress) {
          if (timeInSecond === void 0) {
            timeInSecond = .5;
          }

          if (offset === void 0) {
            offset = null;
          }

          if (overStress === void 0) {
            overStress = false;
          }

          var t = this;
          if (!t.checkInited(false)) return; // t._scrollView.stopAutoScroll();

          if (timeInSecond == null) //默认0.5
            timeInSecond = .5;else if (timeInSecond < 0) timeInSecond = 0;
          if (listId < 0) listId = 0;else if (listId >= t._numItems) listId = t._numItems - 1; // 以防设置了numItems之后layout的尺寸还未更新

          if (!t._virtual && t._layout && t._layout.enabled) t._layout.updateLayout();
          var pos = t.getItemPos(listId);

          if (!pos) {
            return DEV;
          }

          var targetX, targetY;

          switch (t._alignCalcType) {
            case 1:
              //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
              targetX = pos.left;
              if (offset != null) targetX -= t._thisNodeUt.width * offset;else targetX -= t._leftGap;
              pos = new Vec3(targetX, 0, 0);
              break;

            case 2:
              //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
              targetX = pos.right - t._thisNodeUt.width;
              if (offset != null) targetX += t._thisNodeUt.width * offset;else targetX += t._rightGap;
              pos = new Vec3(targetX + t._contentUt.width, 0, 0);
              break;

            case 3:
              //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
              targetY = pos.top;
              if (offset != null) targetY += t._thisNodeUt.height * offset;else targetY += t._topGap;
              pos = new Vec3(0, -targetY, 0);
              break;

            case 4:
              //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
              targetY = pos.bottom + t._thisNodeUt.height;
              if (offset != null) targetY -= t._thisNodeUt.height * offset;else targetY -= t._bottomGap;
              pos = new Vec3(0, -targetY + t._contentUt.height, 0);
              break;
          }

          var viewPos = t.content.getPosition();
          viewPos = Math.abs(t._sizeType ? viewPos.y : viewPos.x);
          var comparePos = t._sizeType ? pos.y : pos.x;
          var runScroll = Math.abs((t._scrollPos != null ? t._scrollPos : viewPos) - comparePos) > .5; // cc.log(runScroll, t._scrollPos, viewPos, comparePos)
          // t._scrollView.stopAutoScroll();

          if (runScroll) {
            t._scrollView.scrollToOffset(pos, timeInSecond);

            t._scrollToListId = listId;
            t._scrollToEndTime = new Date().getTime() / 1000 + timeInSecond; // cc.log(listId, t.content.width, t.content.getPosition(), pos);

            t._scrollToSo = t.scheduleOnce(function () {
              if (!t._adheringBarrier) {
                t.adhering = t._adheringBarrier = false;
              }

              t._scrollPos = t._scrollToListId = t._scrollToEndTime = t._scrollToSo = null; //cc.log('2222222222', t._adheringBarrier)

              if (overStress) {
                // t.scrollToListId = listId;
                var item = t.getItemByListId(listId);

                if (item) {
                  tween(item).to(.1, {
                    scale: 1.05
                  }).to(.1, {
                    scale: 1
                  }).start();
                }
              }
            }, timeInSecond + .1);

            if (timeInSecond <= 0) {
              t._onScrolling();
            }
          }
        }
        /**
         * 计算当前滚动窗最近的Item
         */
        ;

        _proto._calcNearestItem = function _calcNearestItem() {
          var t = this;
          t.nearestListId = null;
          var data, center;
          if (t._virtual) t._calcViewPos();
          var vTop, vRight, vBottom, vLeft;
          vTop = t.viewTop;
          vRight = t.viewRight;
          vBottom = t.viewBottom;
          vLeft = t.viewLeft;
          var breakFor = false;

          for (var n = 0; n < t.content.children.length && !breakFor; n += t._colLineNum) {
            data = t._virtual ? t.displayData[n] : t._calcExistItemPos(n);

            if (data) {
              center = t._sizeType ? (data.top + data.bottom) / 2 : center = (data.left + data.right) / 2;

              switch (t._alignCalcType) {
                case 1:
                  //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                  if (data.right >= vLeft) {
                    t.nearestListId = data.id;
                    if (vLeft > center) t.nearestListId += t._colLineNum;
                    breakFor = true;
                  }

                  break;

                case 2:
                  //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                  if (data.left <= vRight) {
                    t.nearestListId = data.id;
                    if (vRight < center) t.nearestListId += t._colLineNum;
                    breakFor = true;
                  }

                  break;

                case 3:
                  //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                  if (data.bottom <= vTop) {
                    t.nearestListId = data.id;
                    if (vTop < center) t.nearestListId += t._colLineNum;
                    breakFor = true;
                  }

                  break;

                case 4:
                  //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                  if (data.top >= vBottom) {
                    t.nearestListId = data.id;
                    if (vBottom > center) t.nearestListId += t._colLineNum;
                    breakFor = true;
                  }

                  break;
              }
            }
          } //判断最后一个Item。。。（哎，这些判断真心恶心，判断了前面的还要判断最后一个。。。一开始呢，就只有一个布局（单列布局），那时候代码才三百行，后来就想着完善啊，艹..这坑真深，现在这行数都一千五了= =||）


          data = t._virtual ? t.displayData[t.displayItemNum - 1] : t._calcExistItemPos(t._numItems - 1);

          if (data && data.id == t._numItems - 1) {
            center = t._sizeType ? (data.top + data.bottom) / 2 : center = (data.left + data.right) / 2;

            switch (t._alignCalcType) {
              case 1:
                //单行HORIZONTAL（LEFT_TO_RIGHT）、网格VERTICAL（LEFT_TO_RIGHT）
                if (vRight > center) t.nearestListId = data.id;
                break;

              case 2:
                //单行HORIZONTAL（RIGHT_TO_LEFT）、网格VERTICAL（RIGHT_TO_LEFT）
                if (vLeft < center) t.nearestListId = data.id;
                break;

              case 3:
                //单列VERTICAL（TOP_TO_BOTTOM）、网格HORIZONTAL（TOP_TO_BOTTOM）
                if (vBottom < center) t.nearestListId = data.id;
                break;

              case 4:
                //单列VERTICAL（BOTTOM_TO_TOP）、网格HORIZONTAL（BOTTOM_TO_TOP）
                if (vTop > center) t.nearestListId = data.id;
                break;
            }
          } // cc.log('t.nearestListId =', t.nearestListId);

        } //上一页
        ;

        _proto.prePage = function prePage(timeInSecond) {
          if (timeInSecond === void 0) {
            timeInSecond = .5;
          } // cc.log('👈');


          if (!this.checkInited()) return;
          this.skipPage(this.curPageNum - 1, timeInSecond);
        } //下一页
        ;

        _proto.nextPage = function nextPage(timeInSecond) {
          if (timeInSecond === void 0) {
            timeInSecond = .5;
          } // cc.log('👉');


          if (!this.checkInited()) return;
          this.skipPage(this.curPageNum + 1, timeInSecond);
        } //跳转到第几页
        ;

        _proto.skipPage = function skipPage(pageNum, timeInSecond) {
          var t = this;
          if (!t.checkInited()) return;
          if (t._slideMode != SlideType.PAGE) return console.error('This function is not allowed to be called, Must SlideMode = PAGE!');
          if (pageNum < 0 || pageNum >= t._numItems) return;
          if (t.curPageNum == pageNum) return; // cc.log(pageNum);

          t.curPageNum = pageNum;

          if (t.pageChangeEvent) {
            EventHandler.emitEvents([t.pageChangeEvent], pageNum);
          }

          t.scrollTo(pageNum, timeInSecond);
        } //计算 CustomSize（这个函数还是保留吧，某些罕见的情况的确还是需要手动计算customSize的）
        ;

        _proto.calcCustomSize = function calcCustomSize(numItems) {
          var t = this;
          if (!t.checkInited()) return;
          if (!t._itemTmp) return console.error('Unset template item!');
          if (!t.renderEvent) return console.error('Unset Render-Event!');
          t._customSize = {};
          var temp = instantiate(t._itemTmp);
          var ut = temp.getComponent(UITransform);
          t.content.addChild(temp);

          for (var n = 0; n < numItems; n++) {
            EventHandler.emitEvents([t.renderEvent], temp, n);

            if (ut.height != t._itemSize.height || ut.width != t._itemSize.width) {
              t._customSize[n] = t._sizeType ? ut.height : ut.width;
            }
          }

          if (!Object.keys(t._customSize).length) t._customSize = null;
          temp.removeFromParent();
          if (temp.destroy) temp.destroy();
          return t._customSize;
        };

        _createClass(List, [{
          key: "slideMode",
          get: function get() {
            return this._slideMode;
          } //翻页作用距离
          ,
          set: function set(val) {
            this._slideMode = val;
          }
        }, {
          key: "virtual",
          get: function get() {
            return this._virtual;
          } //是否为循环列表
          ,
          set: function set(val) {
            if (val != null) this._virtual = val;

            if (this._numItems != 0) {
              this._onScrolling();
            }
          }
        }, {
          key: "updateRate",
          get: function get() {
            return this._updateRate;
          } //分帧渲染（每帧渲染的Item数量（<=0时关闭分帧渲染））
          ,
          set: function set(val) {
            if (val >= 0 && val <= 6) {
              this._updateRate = val;
            }
          }
        }, {
          key: "selectedId",
          get: function get() {
            return this._selectedId;
          },
          set: function set(val) {
            var t = this;
            var item;

            switch (t.selectedMode) {
              case SelectedType.SINGLE:
                {
                  if (!t.repeatEventSingle && val == t._selectedId) return;
                  item = t.getItemByListId(val); // if (!item && val >= 0)
                  //     return;

                  var listItem;
                  if (t._selectedId >= 0) t._lastSelectedId = t._selectedId;else //如果＜0则取消选择，把_lastSelectedId也置空吧，如果以后有特殊需求再改吧。
                    t._lastSelectedId = null;
                  t._selectedId = val;

                  if (item) {
                    listItem = item.getComponent(ListItem);
                    listItem.selected = true;
                  }

                  if (t._lastSelectedId >= 0 && t._lastSelectedId != t._selectedId) {
                    var lastItem = t.getItemByListId(t._lastSelectedId);

                    if (lastItem) {
                      lastItem.getComponent(ListItem).selected = false;
                    }
                  }

                  if (t.selectedEvent) {
                    EventHandler.emitEvents([t.selectedEvent], item, val % this._actualNumItems, t._lastSelectedId == null ? null : t._lastSelectedId % this._actualNumItems);
                  }

                  break;
                }

              case SelectedType.MULT:
                {
                  item = t.getItemByListId(val);
                  if (!item) return;

                  var _listItem = item.getComponent(ListItem);

                  if (t._selectedId >= 0) t._lastSelectedId = t._selectedId;
                  t._selectedId = val;
                  var bool = !_listItem.selected;
                  _listItem.selected = bool;
                  var sub = t.multSelected.indexOf(val);

                  if (bool && sub < 0) {
                    t.multSelected.push(val);
                  } else if (!bool && sub >= 0) {
                    t.multSelected.splice(sub, 1);
                  }

                  if (t.selectedEvent) {
                    EventHandler.emitEvents([t.selectedEvent], item, val % this._actualNumItems, t._lastSelectedId == null ? null : t._lastSelectedId % this._actualNumItems, bool);
                  }

                  break;
                }
            }
          }
        }, {
          key: "numItems",
          get: function get() {
            return this._actualNumItems;
          },
          set: function set(val) {
            var t = this;
            if (!t.checkInited(false)) return;

            if (val == null || val < 0) {
              console.error('numItems set the wrong::', val);
              return;
            }

            t._actualNumItems = t._numItems = val;
            t._forceUpdate = true;

            if (t._virtual) {
              t._resizeContent();

              if (t.cyclic) {
                t._numItems = t._cyclicNum * t._numItems;
              }

              t._onScrolling();

              if (!t.frameByFrameRenderNum && t.slideMode == SlideType.PAGE) t.curPageNum = t.nearestListId;
            } else {
              if (t.cyclic) {
                t._resizeContent();

                t._numItems = t._cyclicNum * t._numItems;
              }

              var layout = t.content.getComponent(Layout);

              if (layout) {
                layout.enabled = true;
              }

              t._delRedundantItem();

              t.firstListId = 0;

              if (t.frameByFrameRenderNum > 0) {
                //先渲染几个出来
                var len = t.frameByFrameRenderNum > t._numItems ? t._numItems : t.frameByFrameRenderNum;

                for (var n = 0; n < len; n++) {
                  t._createOrUpdateItem2(n);
                }

                if (t.frameByFrameRenderNum < t._numItems) {
                  t._updateCounter = t.frameByFrameRenderNum;
                  t._updateDone = false;
                }
              } else {
                for (var _n4 = 0; _n4 < t._numItems; _n4++) {
                  t._createOrUpdateItem2(_n4);
                }

                t.displayItemNum = t._numItems;
              }
            }
          }
        }, {
          key: "scrollView",
          get: function get() {
            return this._scrollView;
          }
        }]);

        return List;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "templateType", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return TemplateType.NODE;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "tmpNode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "tmpPrefab", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_slideMode", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return SlideType.NORMAL;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "slideMode", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "slideMode"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "pageDistance", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return .3;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "pageChangeEvent", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new EventHandler();
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_virtual", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "virtual", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "virtual"), _class2.prototype), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "cyclic", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "lackCenter", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "lackSlide", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_updateRate", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _applyDecoratedDescriptor(_class2.prototype, "updateRate", [_dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "updateRate"), _class2.prototype), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "frameByFrameRenderNum", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "renderEvent", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new EventHandler();
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "selectedMode", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return SelectedType.NONE;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "selectedEvent", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new EventHandler();
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "repeatEventSingle", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "_numItems", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class2)) || _class) || _class) || _class) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ListItem.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './env', './ButtonPlus.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, Sprite, Node, Enum, SpriteFrame, EventHandler, UITransform, tween, Vec3, Button, Component, DEV, ButtonPlus;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Sprite = module.Sprite;
      Node = module.Node;
      Enum = module.Enum;
      SpriteFrame = module.SpriteFrame;
      EventHandler = module.EventHandler;
      UITransform = module.UITransform;
      tween = module.tween;
      Vec3 = module.Vec3;
      Button = module.Button;
      Component = module.Component;
    }, function (module) {
      DEV = module.DEV;
    }, function (module) {
      ButtonPlus = module.ButtonPlus;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6;

      cclegacy._RF.push({}, "dbedcTlseZDMaAxug16qFYi", "ListItem", undefined);
      /******************************************
       * @author kL <klk0@qq.com>
       * @date 2019/12/9
       * @doc 列表Item组件.
       * 说明：
       *      1、此组件须配合List组件使用。（配套的配套的..）
       * @end
       ******************************************/


      var ccclass = _decorator.ccclass,
          property = _decorator.property,
          disallowMultiple = _decorator.disallowMultiple,
          menu = _decorator.menu,
          executionOrder = _decorator.executionOrder;
      var SelectedType;

      (function (SelectedType) {
        SelectedType[SelectedType["NONE"] = 0] = "NONE";
        SelectedType[SelectedType["TOGGLE"] = 1] = "TOGGLE";
        SelectedType[SelectedType["SWITCH"] = 2] = "SWITCH";
      })(SelectedType || (SelectedType = {}));

      var ListItem = exports('default', (_dec = disallowMultiple(), _dec2 = menu('List Item'), _dec3 = executionOrder(-5001), _dec4 = property({
        type: Sprite,
        tooltip: DEV
      }), _dec5 = property({
        type: Node,
        tooltip: DEV
      }), _dec6 = property({
        type: Enum(SelectedType),
        tooltip: DEV
      }), _dec7 = property({
        type: Node,
        tooltip: DEV,
        visible: function visible() {
          return this.selectedMode > SelectedType.NONE;
        }
      }), _dec8 = property({
        type: SpriteFrame,
        tooltip: DEV,
        visible: function visible() {
          return this.selectedMode == SelectedType.SWITCH;
        }
      }), _dec9 = property({
        tooltip: DEV
      }), ccclass(_class = _dec(_class = _dec2(_class = _dec3(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(ListItem, _Component);

        function ListItem() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "icon", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "title", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "selectedMode", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "selectedFlag", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "selectedSpriteFrame", _descriptor5, _assertThisInitialized(_this));

          _this._unselectedSpriteFrame = null;

          _initializerDefineProperty(_this, "adaptiveSize", _descriptor6, _assertThisInitialized(_this));

          _this._selected = false;
          _this._btnCom = void 0;
          _this.list = void 0;
          _this._eventReg = false;
          _this.listId = void 0;
          return _this;
        }

        var _proto = ListItem.prototype;

        _proto.onLoad = function onLoad() {
          // //没有按钮组件的话，selectedFlag无效
          // if (!this.btnCom)
          //     this.selectedMode == SelectedType.NONE;
          //有选择模式时，保存相应的东西
          if (this.selectedMode == SelectedType.SWITCH) {
            var com = this.selectedFlag.getComponent(Sprite);
            this._unselectedSpriteFrame = com.spriteFrame;
          }
        };

        _proto.onDestroy = function onDestroy() {
          this.node.off(Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
        };

        _proto._registerEvent = function _registerEvent() {
          if (!this._eventReg) {
            if (this.btnCom && this.list.selectedMode > 0) {
              this.btnCom.clickEvents.unshift(this.createEvt(this, 'onClickThis'));
            }

            if (this.adaptiveSize) {
              this.node.on(Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
            }

            this._eventReg = true;
          }
        };

        _proto._onSizeChange = function _onSizeChange() {
          this.list._onItemAdaptive(this.node);
        }
        /**
         * 创建事件
         * @param {cc.Component} component 组件脚本
         * @param {string} handlerName 触发函数名称
         * @param {cc.Node} node 组件所在node（不传的情况下取component.node）
         * @returns cc.Component.EventHandler
         */
        ;

        _proto.createEvt = function createEvt(component, handlerName, node) {
          if (node === void 0) {
            node = null;
          }

          if (!component.isValid) return; //有些异步加载的，节点以及销毁了。

          component['comName'] = component['comName'] || component.name.match(/\<(.*?)\>/g).pop().replace(/\<|>/g, '');
          var evt = new EventHandler();
          evt.target = node || component.node;
          evt.component = component['comName'];
          evt.handler = handlerName;
          return evt;
        };

        _proto.showAni = function showAni(aniType, callFunc, del) {
          var t = this;
          var twe;
          var ut = t.node.getComponent(UITransform);

          switch (aniType) {
            case 0:
              //向上消失
              twe = tween(t.node).to(.2, {
                scale: new Vec3(.7, .7)
              }).by(.3, {
                position: new Vec3(0, ut.height * 2)
              });
              break;

            case 1:
              //向右消失
              twe = tween(t.node).to(.2, {
                scale: new Vec3(.7, .7)
              }).by(.3, {
                position: new Vec3(ut.width * 2, 0)
              });
              break;

            case 2:
              //向下消失
              twe = tween(t.node).to(.2, {
                scale: new Vec3(.7, .7)
              }).by(.3, {
                position: new Vec3(0, ut.height * -2)
              });
              break;

            case 3:
              //向左消失
              twe = tween(t.node).to(.2, {
                scale: new Vec3(.7, .7)
              }).by(.3, {
                position: new Vec3(ut.width * -2, 0)
              });
              break;

            default:
              //默认：缩小消失
              twe = tween(t.node).to(.3, {
                scale: new Vec3(.1, .1)
              });
              break;
          }

          if (callFunc || del) {
            twe.call(function () {
              if (del) {
                t.list._delSingleItem(t.node);

                for (var n = t.list.displayData.length - 1; n >= 0; n--) {
                  if (t.list.displayData[n].id == t.listId) {
                    t.list.displayData.splice(n, 1);
                    break;
                  }
                }
              }

              callFunc();
            });
          }

          twe.start();
        };

        _proto.onClickThis = function onClickThis() {
          this.list.selectedId = this.listId;
        };

        _createClass(ListItem, [{
          key: "selected",
          get: function get() {
            return this._selected;
          } //按钮组件
          ,
          set: function set(val) {
            this._selected = val;
            if (!this.selectedFlag) return;

            switch (this.selectedMode) {
              case SelectedType.TOGGLE:
                this.selectedFlag.active = val;
                break;

              case SelectedType.SWITCH:
                var sp = this.selectedFlag.getComponent(Sprite);

                if (sp) {
                  sp.spriteFrame = val ? this.selectedSpriteFrame : this._unselectedSpriteFrame;
                }

                break;
            }
          }
        }, {
          key: "btnCom",
          get: function get() {
            if (!this._btnCom) this._btnCom = this.node.getComponent(Button) || this.node.getComponent(ButtonPlus);
            return this._btnCom;
          } //依赖的List组件

        }]);

        return ListItem;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "title", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "selectedMode", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return SelectedType.NONE;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "selectedFlag", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "selectedSpriteFrame", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "adaptiveSize", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class2)) || _class) || _class) || _class) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ListTestLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseEnum.ts', './FileMgr.ts', './SceneMgr.ts', './UILayer.ts', './ButtonPlus.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Button, BaseEnum, FileMgr, SceneMgr, UILayer, ButtonPlus;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Button = module.Button;
    }, function (module) {
      BaseEnum = module.BaseEnum;
    }, function (module) {
      FileMgr = module.FileMgr;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }, function (module) {
      UILayer = module.UILayer;
    }, function (module) {
      ButtonPlus = module.ButtonPlus;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3;

      cclegacy._RF.push({}, "36581i5QD5Fr4A+Q0T3wGN7", "ListTestLayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var ListTestLayer = exports('ListTestLayer', (_dec = ccclass('ListTestLayer'), _dec2 = property({
        type: Button
      }), _dec3 = property({
        type: ButtonPlus
      }), _dec4 = property({
        type: ButtonPlus
      }), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(ListTestLayer, _UILayer);

        function ListTestLayer() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UILayer.call.apply(_UILayer, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "btn_back", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "btn_fileSelect", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "btn_fileSave", _descriptor3, _assertThisInitialized(_this));

          _this.data = [];
          return _this;
        }

        var _proto = ListTestLayer.prototype;

        _proto.onEnter = function onEnter() {
          this.data = [];
        };

        _proto._tap_btn_back = function _tap_btn_back() {
          SceneMgr.inst.pop();
        }
        /** 打开文件选择器+读取数据 */
        ;

        _proto._tap_btn_fileSelect = function _tap_btn_fileSelect() {
          // 打开文件选择器
          FileMgr.inst.openLocalFile(null, function (file) {
            console.log("file", file); // 读取数据

            FileMgr.inst.readLocalFile(file, BaseEnum.READ_FILE_TYPE.TEXT, function (result) {
              console.log("file result", result);
            });
          });
        }
        /** 保存数据到文件 */
        ;

        _proto._tap_btn_fileSave = function _tap_btn_fileSave() {
          var list = [{
            type: 1,
            aa: 5
          }, {
            type: 3,
            bb: 66
          }];
          FileMgr.inst.saveForBrowser(JSON.stringify(list), "json/" + 1 + ".json");
        };

        return ListTestLayer;
      }(UILayer), _class3.prefabUrl = 'prefab/listTest/ListTestLayer', _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "btn_back", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "btn_fileSelect", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "btn_fileSave", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ListTestScene.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './UIScene.ts', './ModuleMgr.ts', './ListTestLayer.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, cclegacy, _decorator, UIScene, registerModule, ListTestLayer;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      UIScene = module.UIScene;
    }, function (module) {
      registerModule = module.registerModule;
    }, function (module) {
      ListTestLayer = module.ListTestLayer;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "1eb34qQJmNHZpf//m3Si0kU", "ListTestScene", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var ListTestScene = exports('ListTestScene', (_dec = ccclass('ListTestScene'), _dec(_class = /*#__PURE__*/function (_UIScene) {
        _inheritsLoose(ListTestScene, _UIScene);

        function ListTestScene() {
          return _UIScene.apply(this, arguments) || this;
        }

        var _proto = ListTestScene.prototype;

        _proto.ctor = function ctor() {
          var self = this;
          self.mainClassLayer = ListTestLayer;
          var subLayerMgr = self.subLayerMgr;
          var classList = [];

          for (var i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
          }
        };

        return ListTestScene;
      }(UIScene)) || _class));
      registerModule(ListTestScene, [ListTestLayer.prefabUrl]);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LoadingLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './UILayer.ts', './SceneMgr.ts', './ResMgr.ts', './HomeLayer.ts', './HomeScene.ts', './TopUsrInfoLayer.ts', './BottomTabLayer.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, ProgressBar, UILayer, SceneMgr, ResMgr, HomeLayer, HomeScene, TopUsrInfoLayer, BottomTabLayer;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      ProgressBar = module.ProgressBar;
    }, function (module) {
      UILayer = module.UILayer;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      HomeLayer = module.HomeLayer;
    }, function (module) {
      HomeScene = module.HomeScene;
    }, function (module) {
      TopUsrInfoLayer = module.TopUsrInfoLayer;
    }, function (module) {
      BottomTabLayer = module.BottomTabLayer;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _class3;

      cclegacy._RF.push({}, "11bdedmCPpNBLna1JJfw+SM", "LoadingLayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var LoadingLayer = exports('LoadingLayer', (_dec = ccclass('LoadingLayer'), _dec2 = property({
        type: ProgressBar
      }), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(LoadingLayer, _UILayer);

        function LoadingLayer() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UILayer.call.apply(_UILayer, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "progressBar", _descriptor, _assertThisInitialized(_this));

          _this._isLoadingHome = void 0;
          _this._preResList = void 0;
          _this._toPercent = void 0;
          return _this;
        }

        var _proto = LoadingLayer.prototype;

        _proto.onEnter = function onEnter() {
          var self = this;
          self._preResList = ['ui/common', HomeLayer.prefabUrl, TopUsrInfoLayer.prefabUrl, BottomTabLayer.prefabUrl];
          var curDownLoadNum = 0; //当前已下载个数

          var initPercent = self._toPercent = 0.4; //默认加载到40%

          ResMgr.inst.loadToWithItor('HomeScene', self._preResList, function () {
            curDownLoadNum++;
            self._toPercent = initPercent + curDownLoadNum / self._preResList.length * 0.6;
          });
        };

        _proto.update = function update(dt) {
          var self = this;

          if (self.progressBar && self.progressBar.progress < self._toPercent) {
            self.progressBar.progress += 0.005;

            if (!self._isLoadingHome && self.progressBar.progress >= 1) {
              self._isLoadingHome = true;
              SceneMgr.inst.run(HomeScene);
            }
          }
        };

        return LoadingLayer;
      }(UILayer), _class3.prefabUrl = 'prefab/loading/LoadingLayer', _class3), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "progressBar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LoadingScene.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './UIScene.ts', './LoadingLayer.ts', './ModuleMgr.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, UIScene, LoadingLayer, registerModule;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      UIScene = module.UIScene;
    }, function (module) {
      LoadingLayer = module.LoadingLayer;
    }, function (module) {
      registerModule = module.registerModule;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "03f77rzqFxO8qPCuhCKV/IW", "LoadingScene", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var LoadingScene = exports('LoadingScene', (_dec = ccclass('LoadingScene'), _dec(_class = /*#__PURE__*/function (_UIScene) {
        _inheritsLoose(LoadingScene, _UIScene);

        function LoadingScene() {
          return _UIScene.apply(this, arguments) || this;
        }

        var _proto = LoadingScene.prototype;

        _proto.ctor = function ctor() {
          var self = this;
          self.mainClassLayer = LoadingLayer;
          var subLayerMgr = self.subLayerMgr;
          var classList = [];

          for (var i = 0; i < classList.length; i++) {
            subLayerMgr.register(classList[i]);
          }
        };

        _proto.onEnter = /*#__PURE__*/function () {
          var _onEnter = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function onEnter() {
            return _onEnter.apply(this, arguments);
          }

          return onEnter;
        }();

        return LoadingScene;
      }(UIScene)) || _class));
      registerModule(LoadingScene, ['dy/sp/pet']);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./Main.ts', './BaseEnum.ts', './BaseUtil.ts', './Emmiter.ts', './ModuleCfgInfo.ts', './ScaleMode.ts', './FileMgr.ts', './ModuleMgr.ts', './ResMgr.ts', './SceneMgr.ts', './SoundMgr.ts', './SubLayerMgr.ts', './TickMgr.ts', './ButtonPlus.ts', './ImgLoader.ts', './List.ts', './ListItem.ts', './Sp.ts', './UIComp.ts', './UIDlg.ts', './UILayer.ts', './UIMenu.ts', './UIMsg.ts', './UIScene.ts', './AStar.ts', './Grid.ts', './Nodes.ts', './TestAStar.ts', './BagDlg.ts', './JuHuaDlg.ts', './MessageTip.ts', './BottomTabLayer.ts', './HomeLayer.ts', './HomeScene.ts', './TestComp.ts', './TopUsrInfoLayer.ts', './EquipLayer.ts', './SettingLayer.ts', './ShopLayer.ts', './SkillLayer.ts', './ListTestLayer.ts', './ListTestScene.ts', './LoadingLayer.ts', './LoadingScene.ts'], function () {
  'use strict';

  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/Main.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseEnum.ts', './BaseUtil.ts', './ScaleMode.ts', './ResMgr.ts', './SceneMgr.ts', './SoundMgr.ts', './TickMgr.ts', './Sp.ts', './LoadingScene.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Prefab, Node, instantiate, Component, BaseEnum, BaseUT, scaleMode, ResMgr, SceneMgr, SoundMgr, TickMgr, Sp, LoadingScene;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Prefab = module.Prefab;
      Node = module.Node;
      instantiate = module.instantiate;
      Component = module.Component;
    }, function (module) {
      BaseEnum = module.BaseEnum;
    }, function (module) {
      BaseUT = module.BaseUT;
    }, function (module) {
      scaleMode = module.scaleMode;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }, function (module) {
      SoundMgr = module.SoundMgr;
    }, function (module) {
      TickMgr = module.TickMgr;
    }, function (module) {
      Sp = module.Sp;
    }, function (module) {
      LoadingScene = module.LoadingScene;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor;

      cclegacy._RF.push({}, "b6d2eYpyWlINadRQvfSwzwk", "Main", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var Main = exports('Main', (_dec = ccclass('Main'), _dec2 = property({
        type: Prefab,
        tooltip: '点击特效'
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Main, _Component);

        function Main() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "clickEff", _descriptor, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = Main.prototype;

        _proto.onLoad = function onLoad() {
          SoundMgr.inst.defaultBgMusic = "dy/sound/bg00"; //设置默认背景音乐

          SceneMgr.inst.mainScene = 'HomeScene'; //设置主场景

          SoundMgr.inst.buttonSound = "dy/sound/click"; //设置全局按钮点击音效

          TickMgr.inst.mainNode = this;
          ResMgr.inst.setGlobal('dy/sp/click', 'dy/sound/click', 'ui/common');
          scaleMode.designWidth = 640;
          scaleMode.designHeight = 1280;
          scaleMode.designHeight_min = 1030;
          scaleMode.designHeight_max = 1280;
          this.initClickEffContainer();
          SceneMgr.inst.run(LoadingScene, {
            name: '红红火火恍恍惚惚'
          });
        };

        _proto.initClickEffContainer = function initClickEffContainer() {
          var self = this;
          var newNode = BaseUT.newUINode('ClickEff');
          newNode.on(Node.EventType.TOUCH_START, self.touchHandler, self);
          newNode.on(Node.EventType.TOUCH_MOVE, self.touchHandler, self);
          newNode.on(Node.EventType.TOUCH_END, self.onStageCLick, self);
          var windowSize = BaseUT.getStageSize();
          BaseUT.setSize(newNode, windowSize.width, windowSize.height);
          SceneMgr.inst.getCanvas().addChild(newNode);
        };

        _proto.touchHandler = function touchHandler(e) {
          e.preventSwallow = true;
        };

        _proto.onStageCLick = function onStageCLick(event) {
          event.preventSwallow = true;
          var point = event.getUILocation();
          var eff = instantiate(this.clickEff);
          var sp = eff.getComponent(Sp);
          sp.node.on(BaseEnum.Game.onSpPlayEnd, function () {
            sp.node.destroy();
          }, this);
          sp.url = 'dy/sp/click';
          sp.playCount = 1;
          sp.frameRate = 40;
          var parent = SceneMgr.inst.getCanvas().getChildByName('ClickEff');
          var parnetSize = BaseUT.getSize(parent);
          eff.setPosition(point.x - parnetSize.width / 2, point.y - parnetSize.height / 2);
          parent.addChild(eff);
        };

        _proto.update = function update(dt) {
          TickMgr.inst.onTick(dt);
        };

        return Main;
      }(Component), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "clickEff", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/MessageTip.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './UIMsg.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Label, Vec3, UIMsg;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      Vec3 = module.Vec3;
    }, function (module) {
      UIMsg = module.UIMsg;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3;

      cclegacy._RF.push({}, "c821bE2xlFB/YKnGjjQYccl", "MessageTip", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var MessageTip = exports('MessageTip', (_dec = ccclass('MessageTip'), _dec2 = property({
        type: Label
      }), _dec3 = property({
        type: Label
      }), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UIMsg) {
        _inheritsLoose(MessageTip, _UIMsg);

        function MessageTip() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UIMsg.call.apply(_UIMsg, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "lbl_msg", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "lbl_msg1", _descriptor2, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = MessageTip.prototype;

        _proto.dchg = function dchg() {
          var self = this;
          var data = self.data;
          self.lbl_msg.string = self.lbl_msg1.string = data.msg;
          self.getTween(this.node).to(0.5, {
            position: new Vec3(0, 60, 0)
          }, {
            easing: 'elasticOut'
          }).delay(0.8).call(function () {
            self.close();
          }).start();
        };

        return MessageTip;
      }(UIMsg), _class3.prefabUrl = 'prefab/common/MessageTip', _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "lbl_msg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lbl_msg1", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ModuleCfgInfo.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "802ea/uTaVN97NyAr/lScbS", "ModuleCfgInfo", undefined);
      /*
       * @Description: 
       * @Author: CYK
       * @Date: 2022-05-20 09:42:43
       */


      var ModuleCfgInfo = exports('ModuleCfgInfo', function ModuleCfgInfo() {
        this.targetClass = void 0;
        this.name = void 0;
        this.cacheEnabled = void 0;
        this.preResList = void 0;
      });

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ModuleMgr.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ModuleCfgInfo.ts'], function (exports) {
  'use strict';

  var _createClass, cclegacy, ModuleCfgInfo;

  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ModuleCfgInfo = module.ModuleCfgInfo;
    }],
    execute: function () {
      exports('registerModule', registerModule);

      cclegacy._RF.push({}, "c3e75NNacJMkZL7B89FwtDv", "ModuleMgr", undefined);

      var ModuleMgr = exports('ModuleMgr', /*#__PURE__*/function () {
        function ModuleMgr() {}

        _createClass(ModuleMgr, null, [{
          key: "inst",
          get: function get() {
            if (!this._inst) {
              this._inst = new ModuleMgr();
            }

            return this._inst;
          }
        }]);

        return ModuleMgr;
      }());
      ModuleMgr._inst = void 0;
      var moduleInfoMap = exports('moduleInfoMap', {});
      /**
       * 注册场景模块
       * @param sceneName 场景名称
       * @param resList 预加载资源列表
       * @param cacheEnabled 是否开启缓存模式
       */

      function registerModule(targetClass, preResList, cacheEnabled) {
        var moduleCfgInfo = new ModuleCfgInfo();
        moduleCfgInfo.targetClass = targetClass;
        moduleCfgInfo.name = targetClass.name;
        moduleCfgInfo.cacheEnabled = cacheEnabled;
        moduleCfgInfo.preResList = preResList;
        moduleInfoMap[targetClass.name] = moduleCfgInfo;
      }

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Nodes.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, _decorator;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "ca8904DRoVOz6T7l8wyJAOp", "Nodes", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var Nodes = exports('Nodes', (_dec = ccclass('Nodes'), _dec(_class = /*#__PURE__*/function () {
        function Nodes() {
          this.x = void 0;
          this.y = void 0;
          this.f = void 0;
          this.g = void 0;
          this.h = void 0;
          this.walkable = true;
          this.parent = void 0;
          this.costMultiplier = 1.0;
        }

        var _proto = Nodes.prototype; //代价因子

        _proto.init = function init(x, y) {
          var self = this;
          self.x = x;
          self.y = y;
        };

        _proto.toString = function toString() {
          var self = this;
          return "x=" + self.x.toString() + ",y=" + self.y.toString() + ",g=" + Number(self.g).toFixed(1) + ",h=" + Number(self.h).toFixed(1) + ",f=" + Number(self.f).toFixed(1);
        };

        return Nodes;
      }()) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ResMgr.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './JuHuaDlg.ts', './LoadingScene.ts', './SceneMgr.ts'], function (exports) {
  'use strict';

  var _createClass, _asyncToGenerator, _regeneratorRuntime, cclegacy, resources, Prefab, Asset, JuHuaDlg, LoadingScene, SceneMgr;

  return {
    setters: [function (module) {
      _createClass = module.createClass;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      resources = module.resources;
      Prefab = module.Prefab;
      Asset = module.Asset;
    }, function (module) {
      JuHuaDlg = module.JuHuaDlg;
    }, function (module) {
      LoadingScene = module.LoadingScene;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f9d1cbIYAVJf4Zd+nmUKR1h", "ResMgr", undefined);

      var ResMgr = exports('ResMgr', /*#__PURE__*/function () {
        function ResMgr() {
          this.moduleResMap = void 0;
          this._juHuaDlg = void 0;
        }

        var _proto = ResMgr.prototype;

        _proto.closeJuHuaDlg = function closeJuHuaDlg() {
          if (this._juHuaDlg) {
            this._juHuaDlg.close();

            this._juHuaDlg = null;
          }
        }
        /**
         * 加载预制体 Prefab
         * @param path 预制体路径
         * @returns 
         */
        ;

        _proto.loadPrefab = /*#__PURE__*/function () {
          var _loadPrefab = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(prefabPath) {
            var _this = this;

            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    return _context.abrupt("return", new Promise(function (resolve, reject) {
                      var cachePrefab = _this.get(prefabPath);

                      if (cachePrefab) {
                        console.log('resName: ' + prefabPath + '加载完毕(缓存已有)');

                        _this.pushResNametoMap(prefabPath);

                        return resolve(cachePrefab);
                      } else {
                        resources.load(prefabPath, Prefab, function (err, prefab) {
                          if (!err) {
                            console.log('resName: ' + prefabPath + '加载完毕');

                            _this.pushResNametoMap(prefabPath);

                            resolve(prefab);
                          } else {
                            console.log('resName: ' + prefabPath + '加载失败');
                            reject(err);
                          }
                        });
                      }
                    }));

                  case 1:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function loadPrefab(_x) {
            return _loadPrefab.apply(this, arguments);
          }

          return loadPrefab;
        }();

        _proto._loadWithItor = /*#__PURE__*/function () {
          var _loadWithItor2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(res, itorCb, cb, ctx, needJuHua, sceneName) {
            var _this2 = this;

            var resList, totLen, hasLoadResCount, isAllLoaded, i, resName, loadSucc, _loop, _i;

            return _regeneratorRuntime().wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (needJuHua === void 0) {
                      needJuHua = true;
                    }

                    resList = typeof res === 'string' ? [res] : res;
                    totLen = resList.length; //待下载总个数

                    hasLoadResCount = 0; //已下载个数

                    if (!needJuHua) {
                      _context2.next = 19;
                      break;
                    }

                    isAllLoaded = true;
                    i = 0;

                  case 7:
                    if (!(i < totLen)) {
                      _context2.next = 15;
                      break;
                    }

                    resName = resList[i];

                    if (this.get(resName)) {
                      _context2.next = 12;
                      break;
                    }

                    isAllLoaded = false;
                    return _context2.abrupt("break", 15);

                  case 12:
                    i++;
                    _context2.next = 7;
                    break;

                  case 15:
                    if (!(!isAllLoaded && !this._juHuaDlg && SceneMgr.inst.curSceneName != LoadingScene.name)) {
                      _context2.next = 19;
                      break;
                    }

                    _context2.next = 18;
                    return JuHuaDlg.show();

                  case 18:
                    this._juHuaDlg = _context2.sent;

                  case 19:
                    loadSucc = function loadSucc(resName, isFromCache) {
                      hasLoadResCount++;
                      console.log('resName: ' + resName + '加载完毕' + (isFromCache ? '(缓存已有)' : ''));

                      _this2.pushResNametoMap(resName, sceneName);

                      if (itorCb) itorCb.call(ctx, resName, hasLoadResCount);

                      if (hasLoadResCount == totLen) {
                        _this2.closeJuHuaDlg();

                        if (cb) cb.call(ctx);
                      }
                    };

                    _loop = function _loop(_i) {
                      var resName = resList[_i];

                      if (_this2.get(resName)) {
                        //缓存已有
                        loadSucc(resName, true);
                      } else {
                        resources.load(resName, Asset, function (err, asset) {
                          if (!err) {
                            loadSucc(resName);
                          } else {
                            console.error(err);
                          }
                        });
                      }
                    };

                    for (_i = 0; _i < totLen; _i++) {
                      _loop(_i);
                    }

                  case 22:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          function _loadWithItor(_x2, _x3, _x4, _x5, _x6, _x7) {
            return _loadWithItor2.apply(this, arguments);
          }

          return _loadWithItor;
        }()
        /**
         * 加载资源
         * @param res 资源列表
         * @param itorCb 单个资源加载完毕回调
         * @param cb 全部下载完成回调
         * @param ctx 
         */
        ;

        _proto.loadWithItor = function loadWithItor(res, itorCb, cb, ctx, needJuHua) {
          if (needJuHua === void 0) {
            needJuHua = true;
          }

          this._loadWithItor(res, itorCb, cb, ctx, needJuHua);
        }
        /**
          * 加载资源到指定模块
          * @param res 资源列表
          * @param itorCb 单个资源加载完毕回调
          * @param cb 全部下载完成回调
          * @param ctx 
          */
        ;

        _proto.loadToWithItor = function loadToWithItor(moduleName, res, itorCb, cb, ctx, needJuHua) {
          if (needJuHua === void 0) {
            needJuHua = true;
          }

          this._loadWithItor(res, itorCb, cb, ctx, needJuHua, moduleName);
        }
        /**
        * 加载资源
        * @param resList 资源列表
        * @param cb 全部下载完成回调
        * @param ctx 
        */
        ;

        _proto.load = function load(resList, cb, ctx) {
          this._loadWithItor(resList, null, cb, ctx);
        }
        /**
        * 加载资源到指定模块
        * @param resList 资源列表
        * @param cb 全部下载完成回调
        * @param ctx 
        */
        ;

        _proto.loadTo = function loadTo(sceneName, resList, cb, ctx) {
          this._loadWithItor(resList, null, cb, ctx, true, sceneName);
        }
        /**
         * 加载资源(无菊花模式)
         * @param resList 资源列表
         * @param cb 全部下载完成回调
         * @param ctx 
         */
        ;

        _proto.loadWithoutJuHua = function loadWithoutJuHua(resList, cb, ctx) {
          this._loadWithItor(resList, null, cb, ctx, false);
        }
        /**
         * 加载资源(无菊花模式)
         * @param resList 资源列表
         * @param cb 全部下载完成回调
         * @param ctx 
         */
        ;

        _proto.loadToWithoutJuHua = function loadToWithoutJuHua(sceneName, resList, cb, ctx) {
          this._loadWithItor(resList, null, cb, ctx, false, sceneName);
        }
        /**获取已加载缓存的资源 */
        ;

        _proto.get = function get(resName) {
          return resources.get(resName);
        }
        /**
         * 释放资源
         * @param res 
         */
        ;

        _proto.releaseRes = function releaseRes(res) {
          var resList = typeof res === 'string' ? [res] : res;

          for (var i = 0; i < resList.length; i++) {
            var resName = resList[i];
            var cahceAsset = this.get(resName);
            if (!cahceAsset) continue;
            resources.release(resName);
            console.log('释放资源: ' + resName);
          }
        }
        /**释放模块资源 */
        ;

        _proto.releaseResModule = function releaseResModule(scenename) {
          var allResList = [];
          var resList = this.moduleResMap[scenename];

          if (resList) {
            delete this.moduleResMap[scenename];
            allResList = allResList.concat(resList);
          }

          this.releaseRes(allResList);
        };

        _proto.pushResNametoMap = function pushResNametoMap(resName, sceneName) {
          var moduleName = sceneName ? sceneName : SceneMgr.inst.curSceneName;
          var globalRes = this.moduleResMap['global'] || [];
          var resList = this.moduleResMap[moduleName] = this.moduleResMap[moduleName] || [];
          if (globalRes.indexOf(resName) == -1 && resList.indexOf(resName) == -1) resList.push(resName);
        }
        /**设置对应资源为全局资源，避免被释放 */
        ;

        _proto.setGlobal = function setGlobal() {
          for (var i = 0; i < arguments.length; i++) {
            this.pushResNametoMap(i < 0 || arguments.length <= i ? undefined : arguments[i], 'global');
          }
        };

        _createClass(ResMgr, null, [{
          key: "inst",
          get: function get() {
            if (!this._inst) {
              this._inst = new ResMgr();
              this._inst.moduleResMap = {};
            }

            return this._inst;
          }
          /**模块资源列表map */

        }]);

        return ResMgr;
      }());
      ResMgr._inst = void 0;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ScaleMode.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "3eb9bycP2VO67rQpBpccgLK", "ScaleMode", undefined);
      /*
       * @Description: 页面缩放参数设置
       * @Author: CYK
       * @Date: 2022-05-19 10:49:35
       */


      var ScaleMode = exports('ScaleMode', function ScaleMode() {
        this.designWidth = void 0;
        this.designHeight = void 0;
        this.designHeight_min = void 0;
        this.designHeight_max = void 0;
      });
      var scaleMode = exports('scaleMode', new ScaleMode());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SceneMgr.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseUtil.ts', './ModuleMgr.ts', './ResMgr.ts'], function (exports) {
  'use strict';

  var _createClass, cclegacy, director, BaseUT, moduleInfoMap, ResMgr;

  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
    }, function (module) {
      BaseUT = module.BaseUT;
    }, function (module) {
      moduleInfoMap = module.moduleInfoMap;
    }, function (module) {
      ResMgr = module.ResMgr;
    }],
    execute: function () {
      cclegacy._RF.push({}, "a941dXizqpFVaFQ7laZBP4g", "SceneMgr", undefined);

      var SceneMgr = exports('SceneMgr', /*#__PURE__*/function () {
        function SceneMgr() {
          this.curScene = void 0;
          this.curSceneName = void 0;
          this.mainScene = void 0;
          this._popArr = void 0;
          this._canvas = void 0;
        }

        var _proto = SceneMgr.prototype;
        /**
         * 获取当前场景的canvas
         * @returns 
         */

        _proto.getCanvas = function getCanvas() {
          if (!this._canvas) {
            this._canvas = director.getScene().getChildByName('Canvas');
          }

          return this._canvas;
        }
        /**打开场景（替换模式） */
        ;

        _proto.run = function run(scene, data) {
          this.showScene(scene, data);
        }
        /**打开场景（入栈模式） */
        ;

        _proto.push = function push(scene, data) {
          this.showScene(scene, data, true);
        };

        _proto.showScene = function showScene(scene, data, toPush) {
          var sceneName = typeof scene === 'string' ? scene : scene.name;
          if (this.curScene && this.curScene.className == sceneName) return; //相同场景

          var moduleInfo = moduleInfoMap[sceneName];

          if (!moduleInfo) {
            console.error('未注册模块：' + sceneName);
            return;
          }

          this.curSceneName = sceneName;

          if (moduleInfo.preResList && moduleInfo.preResList.length > 0) {
            ResMgr.inst.load(moduleInfo.preResList, this.onUILoaded.bind(this, moduleInfo, data, toPush));
          } else {
            this.onUILoaded(moduleInfo, data, toPush);
          }
        };

        _proto.onUILoaded = function onUILoaded(moduleInfo, data, toPush) {
          if (toPush && this.curScene) {
            this._popArr.push(this.curScene);

            this.curScene.removeFromParent();
          } else {
            this.checkDestoryLastScene(!toPush);
          }

          var sceneName = moduleInfo.name;
          var newNode = BaseUT.newUINode(sceneName);
          var script = this.curScene = newNode.addComponent(sceneName);
          script.setData(data);
          script.addToGRoot();
        }
        /**判断销毁上个场景并释放资源 */
        ;

        _proto.checkDestoryLastScene = function checkDestoryLastScene(destory) {
          if (this.curScene) {
            if (destory) this.curScene.destory();
            var lastModuleInfo = moduleInfoMap[this.curScene.className];

            if (destory && !lastModuleInfo.cacheEnabled) {
              //销毁上个场景
              ResMgr.inst.releaseResModule(this.curScene.className); //释放场景资源
            }
          }
        }
        /** 返回到上个场景*/
        ;

        _proto.pop = function pop() {
          var self = this;

          if (self._popArr.length <= 0) {
            console.error('已经pop到底了！！！！！！！');
            return;
          }

          self.checkDestoryLastScene(true);
          self.curScene = self._popArr.pop();
          self.curSceneName = self.curScene.className;
          self.curScene.addToGRoot();
        };

        _createClass(SceneMgr, null, [{
          key: "inst",
          get: function get() {
            if (!this._inst) {
              this._inst = new SceneMgr();
              this._inst._popArr = [];
            }

            return this._inst;
          }
        }]);

        return SceneMgr;
      }());
      SceneMgr._inst = void 0;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SettingLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SoundMgr.ts', './UILayer.ts', './BagDlg.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Button, SoundMgr, UILayer, BagDlg;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Button = module.Button;
    }, function (module) {
      SoundMgr = module.SoundMgr;
    }, function (module) {
      UILayer = module.UILayer;
    }, function (module) {
      BagDlg = module.BagDlg;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _class3;

      cclegacy._RF.push({}, "2bf5cWFXKRIeKz6UnQPZyx3", "SettingLayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var SettingLayer = exports('SettingLayer', (_dec = ccclass('SettingLayer'), _dec2 = property(Button), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(SettingLayer, _UILayer);

        function SettingLayer() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UILayer.call.apply(_UILayer, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "btn_bag", _descriptor, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = SettingLayer.prototype;

        _proto.onEnter = function onEnter() {
          SoundMgr.inst.playBg('dy/sound/bg02');
        };

        _proto.update = function update(deltaTime) {};

        _proto._tap_btn_bag = function _tap_btn_bag() {
          BagDlg.show();
        };

        return SettingLayer;
      }(UILayer), _class3.prefabUrl = 'prefab/home/SettingLayer', _class3), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "btn_bag", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ShopLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SoundMgr.ts', './UILayer.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, cclegacy, _decorator, SoundMgr, UILayer;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      SoundMgr = module.SoundMgr;
    }, function (module) {
      UILayer = module.UILayer;
    }],
    execute: function () {
      var _dec, _class, _class2;

      cclegacy._RF.push({}, "a6a2eQAPAlOBYxoj6amchBg", "ShopLayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var ShopLayer = exports('ShopLayer', (_dec = ccclass('ShopLayer'), _dec(_class = (_class2 = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(ShopLayer, _UILayer);

        function ShopLayer() {
          return _UILayer.apply(this, arguments) || this;
        }

        var _proto = ShopLayer.prototype;
        /** 预制体路径 */

        _proto.onEnter = function onEnter() {
          SoundMgr.inst.playBg('dy/sound/bg03');
        };

        _proto.update = function update(deltaTime) {};

        return ShopLayer;
      }(UILayer), _class2.prefabUrl = 'prefab/home/ShopLayer', _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SkillLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseUtil.ts', './SoundMgr.ts', './UILayer.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, VideoPlayer, Vec3, BaseUT, SoundMgr, UILayer;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      VideoPlayer = module.VideoPlayer;
      Vec3 = module.Vec3;
    }, function (module) {
      BaseUT = module.BaseUT;
    }, function (module) {
      SoundMgr = module.SoundMgr;
    }, function (module) {
      UILayer = module.UILayer;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _class3;

      cclegacy._RF.push({}, "ab95cZlFvlI0aaAQNZ0tZhc", "SkillLayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var SkillLayer = exports('SkillLayer', (_dec = ccclass('SkillLayer'), _dec2 = property({
        type: VideoPlayer
      }), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(SkillLayer, _UILayer);

        function SkillLayer() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UILayer.call.apply(_UILayer, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "videoPlayer", _descriptor, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = SkillLayer.prototype;

        _proto.onEnter = function onEnter() {
          SoundMgr.inst.stopBg();
          var scale = BaseUT.getFitY(0.6, 0.8);
          this.videoPlayer.node.setScale(new Vec3(scale, scale, 1));
          this.videoPlayer.play();
        };

        _proto.update = function update(deltaTime) {};

        _proto.onExit = function onExit() {
          SoundMgr.inst.recoverBg();
          this.videoPlayer.pause();
        };

        return SkillLayer;
      }(UILayer), _class3.prefabUrl = 'prefab/home/SkillLayer', _class3), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "videoPlayer", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SoundMgr.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './ResMgr.ts', './SceneMgr.ts'], function (exports) {
  'use strict';

  var _createClass, cclegacy, AudioSource, director, ResMgr, SceneMgr;

  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      AudioSource = module.AudioSource;
      director = module.director;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }],
    execute: function () {
      cclegacy._RF.push({}, "02b44GWMgJC0r9GQeJaiosG", "SoundMgr", undefined);

      var SoundMgr = exports('SoundMgr', /*#__PURE__*/function () {
        function SoundMgr() {
          this.buttonSound = void 0;
          this.musicCacheMaxCount = 5;
          this.musicCachePool = [];
          this._defaultBgMusic = void 0;
          this.curBgMusic = void 0;
          this._audioSource = void 0;
        }

        var _proto = SoundMgr.prototype;
        /**播放默认背景音乐 */

        _proto.playMainBg = function playMainBg() {
          if (!this.defaultBgMusic) return;
          this.playBg(this.defaultBgMusic);
        }
        /**播放背景音乐 */
        ;

        _proto.playBg = function playBg(url) {
          var self = this;
          if (self.curBgMusic == url) return;
          self.curBgMusic = url;
          var audioSource = this.bgAudioSource;
          ResMgr.inst.loadToWithoutJuHua('global', url, function () {
            var audioClip = ResMgr.inst.get(url);
            if (self.curBgMusic != url || !audioClip) return; //加载完成的不是最后一次赋值的值

            audioSource.stop();
            audioSource.clip = audioClip;
            audioSource.loop = true;
            audioSource.play();
            if (self.musicCachePool.indexOf(url) == -1) self.musicCachePool.push(url);
            self.checkRealseMusic();
          }, self);
        }
        /**停止背景音乐 */
        ;

        _proto.stopBg = function stopBg() {
          this.bgAudioSource.stop();
        }
        /**暂停背景音乐 */
        ;

        _proto.pauseBg = function pauseBg() {
          this.bgAudioSource.pause();
        }
        /**恢复背景音乐 */
        ;

        _proto.recoverBg = function recoverBg() {
          this.bgAudioSource.play();
        };
        /**
         * 播放音效
         * @param url 音效资源路径
         * @param isLoop 是否循环 
         */


        _proto.playSound = function playSound(url, loop) {
          var self = this;
          var canvas = SceneMgr.inst.getCanvas();
          var audioSource = canvas.getComponent(AudioSource);

          if (!canvas.getComponent(AudioSource)) {
            audioSource = canvas.addComponent(AudioSource);
          }

          ResMgr.inst.loadWithoutJuHua(url, function () {
            var audioClip = ResMgr.inst.get(url);
            if (!audioClip) throw '音效资源不存在: ' + url;
            audioSource.loop = loop;
            audioSource.clip = audioClip;
            loop ? audioSource.play() : audioSource.playOneShot(audioClip);
            if (self.musicCachePool.indexOf(url) == -1) self.musicCachePool.push(url);
            self.checkRealseMusic();
          }, self);
        }
        /**检测释放音效资源 */
        ;

        _proto.checkRealseMusic = function checkRealseMusic() {
          var self = this;

          if (self.musicCachePool.length > self.musicCacheMaxCount) {
            var shiftUrl = self.musicCachePool.shift();
            ResMgr.inst.releaseRes(shiftUrl);
          }
        }
        /**播放点击音效 */
        ;

        _proto.playClickSound = function playClickSound() {
          if (!this.buttonSound) {
            console.warn('请先设置buttonSound点击音效资源路径');
            return;
          }

          this.playSound(this.buttonSound);
        };

        _createClass(SoundMgr, [{
          key: "defaultBgMusic",
          get: function get() {
            return this._defaultBgMusic;
          }
          /**设置默认背景音乐 */
          ,
          set: function set(value) {
            this._defaultBgMusic = value;
            this.playMainBg();
          }
        }, {
          key: "bgAudioSource",
          get: function get() {
            if (!this._audioSource) {
              var mainNode = director.getScene().getChildByName('Main');
              this._audioSource = mainNode.getComponent(AudioSource);
            }

            return this._audioSource;
          }
        }], [{
          key: "inst",
          get: function get() {
            if (!this._inst) {
              this._inst = new SoundMgr();
            }

            return this._inst;
          }
          /**按钮点击音效 */

        }]);

        return SoundMgr;
      }());
      SoundMgr._inst = void 0;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/Sp.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseEnum.ts', './ResMgr.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, CCInteger, Sprite, Component, BaseEnum, ResMgr;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      CCInteger = module.CCInteger;
      Sprite = module.Sprite;
      Component = module.Component;
    }, function (module) {
      BaseEnum = module.BaseEnum;
    }, function (module) {
      ResMgr = module.ResMgr;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

      cclegacy._RF.push({}, "23b5fG1JTNG37FwQDevRbsf", "Sp", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var Sp = exports('Sp', (_dec = ccclass('Sp'), _dec2 = property({
        tooltip: '是否自动播放'
      }), _dec3 = property({
        tooltip: '播放帧频',
        type: CCInteger
      }), _dec4 = property({
        tooltip: '播放次数,-1表示循环播放',
        type: CCInteger
      }), _dec5 = property({
        tooltip: '资源路径'
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Sp, _Component);

        function Sp() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "autoPlay", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "frameRate", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "playCount", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "url", _descriptor4, _assertThisInitialized(_this));

          _this._sprite = void 0;
          _this._url = void 0;
          _this._spriteFrames = void 0;
          _this._curPlayFrame = 0;
          _this._playCount = 0;
          _this._isStop = void 0;
          _this._loadCompleted = void 0;
          _this._intervalTime = void 0;
          return _this;
        }

        var _proto = Sp.prototype;

        _proto.onLoad = function onLoad() {
          var self = this;
          self._sprite = self.node.getComponent(Sprite);
          if (!self._sprite) self._sprite = self.node.addComponent(Sprite);

          if (self.url != '') {
            self.setUrl(self.url);
            if (self.autoPlay) self.play(self.playCount);
          }
        }
        /**
         * 设置资源路径
         * @param value 资源路径
         * @returns 
         */
        ;

        _proto.setUrl = function setUrl(value) {
          var self = this;
          if (self._url == value) return;
          self._url = value;
        }
        /**
         * 播放序列帧图片
         * @param count 播放次数：-1表示循环播放
         */
        ;

        _proto.play = function play(count) {
          if (count === void 0) {
            count = -1;
          }

          var self = this;

          if (!self._url) {
            console.error('请先设置资源路径！！！');
            return;
          }

          self._playCount = 0;
          self._curPlayFrame = 0;
          self.playCount = count;
          self._isStop = false;
          var spriteAtlas = ResMgr.inst.get(self._url);

          if (!spriteAtlas) {
            ResMgr.inst.loadWithoutJuHua(self._url, function () {
              loadComplete();
            }, self);
          } else {
            loadComplete();
          }

          function loadComplete() {
            var spriteAtlas = ResMgr.inst.get(self._url);
            self._spriteFrames = spriteAtlas.getSpriteFrames();
            self._loadCompleted = true;
            self.doInterval();
          }
        };

        _proto.stop = function stop() {
          var self = this;
          self._isStop = true;
        };

        _proto.doInterval = function doInterval() {
          var self = this;
          clearInterval(self._intervalTime);
          if (self.checkClearInterval()) return;
          var time = 1000 / self.frameRate;
          onInterVal();
          self._intervalTime = setInterval(function () {
            onInterVal();
          }, time);

          function onInterVal() {
            if (self.checkClearInterval()) return;
            var totSpriteFrameLen = self._spriteFrames.length;
            var idx = self._curPlayFrame;

            if (idx == totSpriteFrameLen - 1) {
              //全部播放结束一次
              self._curPlayFrame = -1;

              if (self.playCount != -1) {
                self._playCount++;
                if (self._playCount == self.playCount) self.node.emit(BaseEnum.Game.onSpPlayEnd);
              }
            } // console.log('self._spriteFrames[idx]:' + self._spriteFrames[idx].name);


            if (self._sprite) self._sprite.spriteFrame = self._spriteFrames[idx];
            self._curPlayFrame++;
          }
        };

        _proto.checkClearInterval = function checkClearInterval() {
          var self = this;

          if (!self.node || self._isStop || !self._loadCompleted || self.playCount != -1 && self.playCount == self._playCount) {
            clearInterval(self._intervalTime);
            return true;
          }

          return false;
        };

        _proto.onEnable = function onEnable() {
          var self = this;
          self.doInterval();
        };

        _proto.onDisable = function onDisable() {
          var self = this;
          clearInterval(self._intervalTime);
        };

        _proto.onDestroy = function onDestroy() {
          var self = this;
          clearInterval(self._intervalTime);
        };

        return Sp;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "autoPlay", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "frameRate", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 24;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "playCount", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -1;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "url", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/SubLayerMgr.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _asyncToGenerator, _regeneratorRuntime, cclegacy, js;

  return {
    setters: [function (module) {
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      js = module.js;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5f31br6NPZC2o9Ho5D4TRCD", "SubLayerMgr", undefined);

      var SubLayerMgr = exports('SubLayerMgr', /*#__PURE__*/function () {
        function SubLayerMgr() {
          this._classMap = void 0;
          this.curLayer = void 0;
          this._popArr = void 0;
          this._classMap = {};
          this._popArr = [];
        }
        /**
         * 注册子页面
         * @param layerClass 
         */


        var _proto = SubLayerMgr.prototype;

        _proto.register = function register(layerClass, opt) {
          var className = layerClass.__className;
          this._classMap[className] = layerClass;
        }
        /**显示指定界面（替换模式） */
        ;

        _proto.run = function run(LayerNameOrClass, data) {
          this._show(LayerNameOrClass, data);
        }
        /**显示指定界面（入栈模式） */
        ;

        _proto.push = function push(LayerNameOrClass, data) {
          this._show(LayerNameOrClass, data, true);
        };

        _proto._show = /*#__PURE__*/function () {
          var _show2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(LayerNameOrClass, data, toPush) {
            var script, layerName, registerLayer, needDestory;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    script = typeof LayerNameOrClass === 'string' ? js.getClassByName(LayerNameOrClass) : LayerNameOrClass;
                    layerName = script.name;

                    if (!(this.curLayer && this.curLayer.className == layerName)) {
                      _context.next = 4;
                      break;
                    }

                    return _context.abrupt("return");

                  case 4:
                    //打开同个界面
                    registerLayer = this._classMap[layerName];
                    needDestory = !registerLayer && !toPush; //未注册  && 非入栈模式

                    this.checkDestoryLastLayer(needDestory);

                    if (this.curLayer) {
                      if (toPush) this._popArr.push(this.curLayer);

                      if (toPush || !needDestory) {
                        this.curLayer.removeSelf();
                      }
                    }

                    if (!(registerLayer && registerLayer.node)) {
                      _context.next = 12;
                      break;
                    }

                    this.curLayer = registerLayer;
                    this.curLayer.addSelf();
                    return _context.abrupt("return");

                  case 12:
                    _context.next = 14;
                    return script.show(data);

                  case 14:
                    this.curLayer = _context.sent;

                    if (this._classMap[layerName]) {
                      this._classMap[layerName] = this.curLayer;
                    }

                  case 16:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function _show(_x, _x2, _x3) {
            return _show2.apply(this, arguments);
          }

          return _show;
        }()
        /**判断销毁上个界面并释放资源 */
        ;

        _proto.checkDestoryLastLayer = function checkDestoryLastLayer(destory) {
          if (destory && this.curLayer && !this.curLayer.hasDestory) {
            this.curLayer.close();
          }
        }
        /** layer出栈*/
        ;

        _proto.pop = function pop() {
          var self = this;

          if (self._popArr.length <= 0) {
            console.error('已经pop到底了！！！！！！！');
            return;
          }

          self.checkDestoryLastLayer(true);
          self.curLayer = self._popArr.pop();
          self.curLayer.addSelf();
        }
        /**清除所有注册的layer */
        ;

        _proto.releaseAllLayer = function releaseAllLayer() {
          var self = this;
          this.checkDestoryLastLayer(true);

          for (var i = 0; i < self._popArr.length; i++) {
            var layer = this._popArr[i];
            if (!layer.hasDestory) layer.close();
          }

          for (var key in this._classMap) {
            var _layer = this._classMap[key];

            if (_layer.node && !_layer.hasDestory) {
              _layer.close();
            }
          }

          self._popArr = [];
        };

        _proto.dispose = function dispose() {
          var self = this;
          self.releaseAllLayer();
          self._classMap = null;
          self._popArr = null;
        };

        return SubLayerMgr;
      }());

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TestAStar.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseUtil.ts', './TickMgr.ts', './UIComp.ts', './Sp.ts', './MessageTip.ts', './AStar.ts', './Grid.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, _createClass, cclegacy, _decorator, Node, Graphics, Label, Prefab, Widget, instantiate, Vec3, UITransform, BaseUT, TickMgr, UIComp, Sp, MessageTip, AStar, Grid;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Graphics = module.Graphics;
      Label = module.Label;
      Prefab = module.Prefab;
      Widget = module.Widget;
      instantiate = module.instantiate;
      Vec3 = module.Vec3;
      UITransform = module.UITransform;
    }, function (module) {
      BaseUT = module.BaseUT;
    }, function (module) {
      TickMgr = module.TickMgr;
    }, function (module) {
      UIComp = module.UIComp;
    }, function (module) {
      Sp = module.Sp;
    }, function (module) {
      MessageTip = module.MessageTip;
    }, function (module) {
      AStar = module.AStar;
    }, function (module) {
      Grid = module.Grid;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11;

      cclegacy._RF.push({}, "8b043nbxsBM36mMcsp/GyKK", "TestAStar", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      /**
       * 测试AStar（平路情况下（代价因子一样大））
       * @author CYK
       */

      var TestAStar = exports('TestAStar', (_dec = ccclass('TestAStar'), _dec2 = property({
        type: Node
      }), _dec3 = property({
        type: Graphics
      }), _dec4 = property({
        type: Graphics
      }), _dec5 = property({
        type: Graphics
      }), _dec6 = property({
        type: Graphics
      }), _dec7 = property({
        type: Sp
      }), _dec8 = property({
        type: Label
      }), _dec9 = property({
        type: Node
      }), _dec10 = property({
        type: Prefab
      }), _dec11 = property({
        type: Node
      }), _dec12 = property({
        type: Prefab
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_UIComp) {
        _inheritsLoose(TestAStar, _UIComp);

        function TestAStar() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UIComp.call.apply(_UIComp, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "grp_container", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "graphicsGrid", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "graphicsBlock", _descriptor3, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "graphicsPath", _descriptor4, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "graphicsPlayer", _descriptor5, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "sp_player", _descriptor6, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "lbl_cost", _descriptor7, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "groundParent", _descriptor8, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "ground", _descriptor9, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "wallParent", _descriptor10, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "wall", _descriptor11, _assertThisInitialized(_this));

          _this._widget = void 0;
          _this._cellSize = void 0;
          _this._grid = void 0;
          _this._index = void 0;
          _this._path = void 0;
          _this._startFrame = void 0;
          _this._speed = void 0;
          return _this;
        }

        var _proto = TestAStar.prototype; //人物移动速度

        _proto.onFirstEnter = function onFirstEnter() {
          var self = this;
          self._cellSize = 40;
          self._speed = 0.15;
          self._widget = self.getComponent(Widget);
          TickMgr.inst.nextTick(function () {
            self.initGrid();
            self.onReset();
          }, this);
        };

        _proto.initGrid = function initGrid() {
          var self = this;
          var screenWh = self.screenWh;
          var width = screenWh[0];
          var height = screenWh[1];
          var numCols = Math.floor(width / self._cellSize);
          var numRows = Math.floor(height / self._cellSize);
          self._grid = new Grid();

          self._grid.init(numCols, numRows);

          var lineGraphics = self.graphicsGrid;
          lineGraphics.clear();
          lineGraphics.lineWidth = 3;

          for (var i = 0; i < numCols + 1; i++) //画竖线
          {
            lineGraphics.moveTo(i * self._cellSize, 0);
            lineGraphics.lineTo(i * self._cellSize, numRows * self._cellSize);
          }

          for (var _i = 0; _i < numRows + 1; _i++) //画横线
          {
            lineGraphics.moveTo(0, _i * self._cellSize);
            lineGraphics.lineTo(numCols * self._cellSize, _i * self._cellSize);
          }

          lineGraphics.stroke();
          var len = numCols * numRows;

          for (var _i2 = 0; _i2 < len; _i2++) {
            var ground = instantiate(this.ground);
            this.groundParent.addChild(ground);
          }
        };

        _proto.makeBlock = function makeBlock() {
          var self = this;
          var blockGraphics = self.graphicsBlock;
          blockGraphics.clear();
          var wallParent = this.wallParent;
          wallParent.removeAllChildren();
          var bolckCount = Math.floor(self._grid.numCols * self._grid.numRows / 4);

          for (var i = 0; i < bolckCount; i++) {
            var _x = Math.floor(Math.random() * self._grid.numCols);

            var _y = Math.floor(Math.random() * self._grid.numRows);

            self._grid.setWalkable(_x, _y, false);

            var node = self._grid.getNode(_x, _y);

            blockGraphics.fillColor.fromHEX(self.getColor(node));
            blockGraphics.rect(_x * self._cellSize, _y * self._cellSize, self._cellSize, self._cellSize);
            blockGraphics.fill();
            var wall = instantiate(this.wall);
            wallParent.addChild(wall);
            wall.setPosition(new Vec3(_x * self._cellSize, _y * self._cellSize));
          }
        }
        /** 生成一个player角色 */
        ;

        _proto.makePlayer = function makePlayer() {
          var self = this;
          var radius = 13; //半径

          self.graphicsPlayer.clear();
          self.graphicsPlayer.fillColor.fromHEX('#ff0000');
          self.graphicsPlayer.circle(0, 0, radius);
          self.graphicsPlayer.fill();

          var ranDomStaryPos = self._grid.getRanDomStartPos();

          var _x = ranDomStaryPos.x * self._cellSize + self._cellSize / 2;

          var _y = ranDomStaryPos.y * self._cellSize + self._cellSize / 2;

          self.graphicsPlayer.node.setPosition(_x, _y);
          self.sp_player.node.setPosition(self.graphicsPlayer.node.position);
        };

        _proto._tap_grp_container = function _tap_grp_container(event) {
          var self = this;
          var point = event.getUILocation();
          console.log('getUILocation: ' + event.getUILocation());
          console.log('getLocationInView: ' + event.getLocationInView());
          console.log('getLocation: ' + event.getLocation());
          console.log('getPreviousLocation: ' + event.getPreviousLocation());
          console.log('getStartLocation: ' + event.getStartLocation());
          console.log('getUIStartLocation: ' + event.getUIStartLocation());
          point.y -= (BaseUT.getStageSize().height - BaseUT.getLayerScaleSize().height) / 2 + self._widget.bottom;
          self.graphicsPath.clear();
          var xPos = Math.floor(point.x / self._cellSize);
          var yPos = Math.floor(point.y / self._cellSize);

          var node = self._grid.getNode(xPos, yPos);

          if (!node) return;

          self._grid.setEndNode(xPos, yPos);

          var endNode = self._grid.endNode;

          if (endNode.walkable) {
            self.graphicsPath.fillColor.fromHEX(self.getColor(endNode));
            self.graphicsPath.rect(xPos * self._cellSize, yPos * self._cellSize, self._cellSize, self._cellSize);
            self.graphicsPath.fill();
          }

          var playerPos = self.graphicsPlayer.node.position;
          xPos = Math.floor(playerPos.x / self._cellSize);
          yPos = Math.floor(playerPos.y / self._cellSize);

          self._grid.setStartNode(xPos, yPos);

          self.findPath();
        }
        /** 寻路 */
        ;

        _proto.findPath = function findPath() {
          var self = this;
          var astar = new AStar();

          if (astar.findPath(self._grid)) {
            self.lbl_cost.string = "本次寻路总耗时: " + astar.costTotTime + "秒";
            self._path = astar.path;
            self._index = 0;
            self._startFrame = true;
          } else {
            MessageTip.show({
              msg: '没找到最佳节点，无路可走!'
            });
          }
        };

        _proto.update = function update(deltaTime) {
          var self = this;
          if (!this._startFrame) return;
          var _cellSize = self._cellSize;
          var targetX = self._path[self._index].x * _cellSize + _cellSize / 2;
          var targetY = self._path[self._index].y * _cellSize + _cellSize / 2; //把经过的点，涂上黄色

          var passedNode = self._path[self._index];
          self.graphicsPath.fillColor.fromHEX('#ffff00');
          self.graphicsPath.rect(passedNode.x * _cellSize, passedNode.y * _cellSize, _cellSize, _cellSize);
          self.graphicsPath.fill();
          var playerPos = self.graphicsPlayer.node.position;
          var dx = targetX - playerPos.x;
          var dy = targetY - playerPos.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 1) {
            self._index++; //索引加1，即取一个路径节点

            if (self._index >= self._path.length) //达到最后一个节点时，移除ENTER_FRAME监听
              {
                this._startFrame = false;
              }
          } else {
            var oldPos = [self.graphicsPlayer.node.position.x, self.graphicsPlayer.node.position.y];
            var newPos = [playerPos.x + dx * self._speed, playerPos.y + dy * self._speed];
            var dir = newPos[0] > oldPos[0] ? 1 : -1;
            self.graphicsPlayer.node.setPosition(newPos[0], newPos[1]);
            self.sp_player.node.setPosition(self.graphicsPlayer.node.position);
            self.sp_player.node.setScale(Math.abs(self.sp_player.node.scale.x) * dir, self.sp_player.node.scale.y);
          }
        }
        /**
         * 重置
         */
        ;

        _proto.onReset = function onReset() {
          var self = this;
          self._startFrame = false;
          self.graphicsPath.clear();

          self._grid.resetWalkable();

          self.makeBlock();
          self.makePlayer();
        };

        _proto.showGrid = function showGrid() {
          var self = this;
          self.graphicsGrid.node.active = !self.graphicsGrid.node.active;
          self.graphicsBlock.node.active = !self.graphicsBlock.node.active;
          self.graphicsPlayer.node.active = !self.graphicsPlayer.node.active;
          self.graphicsPath.node.active = !self.graphicsPath.node.active;
        };
        /** 返回节点颜色 */


        _proto.getColor = function getColor(node) {
          var self = this;
          if (!node.walkable) return '#000000';
          if (node == self._grid.startNode) return '#cccccc';
          if (node == self._grid.endNode) return '#ff0000';
          return '#ffffff';
        };

        _proto.onExit = function onExit() {};

        _createClass(TestAStar, [{
          key: "screenWh",
          get: function get() {
            var self = this;
            var transform = self.grp_container.getComponent(UITransform);
            return [transform.contentSize.width, transform.contentSize.height];
          }
        }]);

        return TestAStar;
      }(UIComp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "grp_container", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "graphicsGrid", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "graphicsBlock", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "graphicsPath", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "graphicsPlayer", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "sp_player", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "lbl_cost", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "groundParent", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "ground", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "wallParent", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "wall", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TestComp.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './UIComp.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Label, UIComp;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Label = module.Label;
    }, function (module) {
      UIComp = module.UIComp;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _class3;

      cclegacy._RF.push({}, "e00d1c2WDJCLqHuH+leigJE", "TestComp", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var TestComp = exports('TestComp', (_dec = ccclass('TestComp'), _dec2 = property({
        type: Node,
        tooltip: '哈哈哈'
      }), _dec3 = property({
        type: Label
      }), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UIComp) {
        _inheritsLoose(TestComp, _UIComp);

        function TestComp() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UIComp.call.apply(_UIComp, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "grp_head", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "lbl_name", _descriptor2, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = TestComp.prototype;

        _proto.onEnter = function onEnter() {};

        _proto.update = function update(deltaTime) {};

        return TestComp;
      }(UIComp), _class3.prefabUrl = 'prefab/home/TestComp', _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "grp_head", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lbl_name", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TickMgr.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  'use strict';

  var _createClass, cclegacy;

  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "cdf37IWqL9E65bcFUDCbVgL", "TickMgr", undefined);
      /*
       * @Description: 帧管理器
       * @Author: CYK
       * @Date: 2022-06-09 23:46:58
       */


      var TickMgr = exports('TickMgr', /*#__PURE__*/function () {
        function TickMgr() {
          this.mainNode = void 0;
          this._tickMap = void 0;
        }

        var _proto = TickMgr.prototype;
        /**全局帧执行方法 */

        _proto.onTick = function onTick(dt) {
          if (this._tickMap) {
            for (var _tickName in this._tickMap) {
              var item = this._tickMap[_tickName];
              item.cb.call(item.ctx, dt);
            }
          }
        }
        /**
         * 添加帧执行器
         * @param tickName 
         * @param cb 
         */
        ;

        _proto.addTick = function addTick(tickName, data) {
          if (!this._tickMap) this._tickMap = {};
          this._tickMap[tickName] = data;
        }
        /**移除帧执行器 */
        ;

        _proto.rmTick = function rmTick(tickName) {
          if (this._tickMap && this._tickMap[tickName]) {
            delete this._tickMap[tickName];
          }
        }
        /**延迟一帧执行 */
        ;

        _proto.nextTick = function nextTick(callback, ctx) {
          this.mainNode.scheduleOnce(function () {
            if (callback) callback.call(ctx);
          });
        };

        _createClass(TickMgr, null, [{
          key: "inst",
          get: function get() {
            if (!this._inst) {
              this._inst = new TickMgr();
            }

            return this._inst;
          }
        }]);

        return TickMgr;
      }());
      TickMgr._inst = void 0;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/TopUsrInfoLayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SceneMgr.ts', './UIMenu.ts', './ButtonPlus.ts', './ListTestScene.ts'], function (exports) {
  'use strict';

  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Node, Label, setDisplayStats, isDisplayStats, SceneMgr, UIMenu, ButtonPlus, ListTestScene;

  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Node = module.Node;
      Label = module.Label;
      setDisplayStats = module.setDisplayStats;
      isDisplayStats = module.isDisplayStats;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }, function (module) {
      UIMenu = module.UIMenu;
    }, function (module) {
      ButtonPlus = module.ButtonPlus;
    }, function (module) {
      ListTestScene = module.ListTestScene;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3;

      cclegacy._RF.push({}, "19787fDz/5I7417uUxZ4mNb", "TopUsrInfoLayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var TopUsrInfoLayer = exports('TopUsrInfoLayer', (_dec = ccclass('TopUsrInfoLayer'), _dec2 = property({
        type: Node,
        tooltip: '哈哈哈'
      }), _dec3 = property({
        type: Label
      }), _dec4 = property({
        type: ButtonPlus
      }), _dec(_class = (_class2 = (_class3 = /*#__PURE__*/function (_UIMenu) {
        _inheritsLoose(TopUsrInfoLayer, _UIMenu);

        function TopUsrInfoLayer() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UIMenu.call.apply(_UIMenu, [this].concat(args)) || this;

          _initializerDefineProperty(_this, "grp_head", _descriptor, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "lbl_name", _descriptor2, _assertThisInitialized(_this));

          _initializerDefineProperty(_this, "btn_debug", _descriptor3, _assertThisInitialized(_this));

          return _this;
        }

        var _proto = TopUsrInfoLayer.prototype;

        _proto.onEnter = function onEnter() {};

        _proto.update = function update(deltaTime) {};

        _proto._tap_grp_head = function _tap_grp_head() {
          SceneMgr.inst.push(ListTestScene);
        };

        _proto._tap_btn_debug = function _tap_btn_debug() {
          setDisplayStats(!isDisplayStats());
        };

        return TopUsrInfoLayer;
      }(UIMenu), _class3.prefabUrl = 'prefab/home/TopUsrInfoLayer', _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "grp_head", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "lbl_name", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "btn_debug", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UIComp.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './Emmiter.ts', './SoundMgr.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, _createClass, cclegacy, _decorator, Component, Node, tween, Tween, emmiter, SoundMgr;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Component = module.Component;
      Node = module.Node;
      tween = module.tween;
      Tween = module.Tween;
    }, function (module) {
      emmiter = module.emmiter;
    }, function (module) {
      SoundMgr = module.SoundMgr;
    }],
    execute: function () {
      var _dec, _class, _class2;

      cclegacy._RF.push({}, "81dafeqZrRPbL2Eqic192xt", "UIComp", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var UIComp = exports('UIComp', (_dec = ccclass('UIComp'), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(UIComp, _Component);

        function UIComp() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this._oldParent = void 0;
          _this._emmitMap = void 0;
          _this._objTapMap = void 0;
          _this._tweenTargetList = void 0;
          _this.chilidCompClassMap = void 0;
          _this.data = void 0;
          _this.isFirstEnter = true;
          _this.hasDestory = void 0;
          _this._allList = void 0;
          _this.needRefreshListOnEnter = true;
          _this.timeoutIdArr = void 0;
          _this.intervalIdArr = void 0;
          return _this;
        }

        var _proto = UIComp.prototype;

        _proto.onLoad = function onLoad() {
          console.log('onLoad: ' + this.node.name);
          var self = this;
          self._oldParent = self.node.parent;
        };

        _proto.onEnable = function onEnable() {
          var self = this;
          self.initView();
        };

        _proto.onDisable = function onDisable() {
          var self = this;

          self._dispose();
        };

        _proto.onDestroy = function onDestroy() {
          console.log('onDestroy: ' + this.node.name);
        };

        _proto.onEnter_b = function onEnter_b() {};

        _proto.onEnter = function onEnter() {};

        _proto.onFirstEnter = function onFirstEnter() {};

        _proto.onEnter_a = function onEnter_a() {};

        _proto.dchg = function dchg() {};

        _proto.onExit_b = function onExit_b() {};

        _proto.onExit = function onExit() {};

        _proto.onExit_a = function onExit_a() {};

        _proto.addToLayer = function addToLayer() {}
        /**打开页面时的动画 */
        ;

        _proto.onOpenAnimation = function onOpenAnimation() {}
        /**关闭页面时的动画 */
        ;

        _proto.onCloseAnimation = function onCloseAnimation(callback) {
          if (callback) callback.call(this);
        };

        _proto.onEmitter = function onEmitter(event, listener) {
          var self = this;
          emmiter.on(event, listener, self);
          if (!self._emmitMap) self._emmitMap = {};
          self._emmitMap[event] = listener;
        };

        _proto.unEmitter = function unEmitter(event, listener) {
          var self = this;
          emmiter.off(event, listener, self);
        };

        _proto.emit = function emit(event, data) {
          emmiter.emit(event, data);
        };

        _proto.setData = function setData(data) {
          this.data = data;
          if (data) this.dchg();
        };

        _proto.enterOnPop = function enterOnPop() {
          var self = this;
          self.initView();
        };

        _proto.exitOnPush = function exitOnPush() {
          var self = this;

          self._dispose();
        }
        /**
         * 初始化view
         */
        ;

        _proto.initView = function initView() {
          var self = this;
          if (self.hasDestory) return;
          self.addListener();
          console.log('进入' + self.className);
          self.onEnter_b();
          self.onEnter();

          if (self.isFirstEnter) {
            self.isFirstEnter = false;
            self.onFirstEnter();
          }

          self.onEnter_a();
          self.refreshAllList();
        }
        /**添加事件监听**/
        ;

        _proto.addListener = function addListener() {
          var self = this;
          self._objTapMap = {};

          for (var _objName in self) {
            var obj = self[_objName];
            if (!obj) continue;
            var eventFuncName = "_tap_" + _objName;

            if (self[eventFuncName] && (obj instanceof Component || obj instanceof Node)) {
              var eventName = Node.EventType.TOUCH_END;
              var node = obj instanceof Component ? obj.node : obj;
              node.on(eventName, self.onNodeClick, self);
              self._objTapMap[eventFuncName + '&' + eventName] = node;
            }
          }
        };

        _proto.onNodeClick = function onNodeClick(event) {
          var self = this;
          SoundMgr.inst.playClickSound();
          var eventFuncName = "_tap_" + event.currentTarget.name;
          self[eventFuncName](event);
        }
        /**刷新所有列表 */
        ;

        _proto.refreshAllList = function refreshAllList() {
          var self = this;
          if (!self.needRefreshListOnEnter) return; //todo...
        }
        /**获取指定对象的缓动Tweener */
        ;

        _proto.getTween = function getTween(target) {
          if (!this._tweenTargetList) {
            this._tweenTargetList = [];
          }

          if (this._tweenTargetList.indexOf(target) == -1) this._tweenTargetList.push(target);
          return tween(target);
        }
        /**清除指定对象的缓动Tweener */
        ;

        _proto.rmTween = function rmTween(target) {
          Tween.stopAllByTarget(target);
        }
        /**清除所有对象的缓动 */
        ;

        _proto.rmAllTweens = function rmAllTweens() {
          if (this._tweenTargetList) {
            for (var i = 0; i < this._tweenTargetList.length; i++) {
              this.rmTween(this._tweenTargetList[i]);
            }
          }

          this._tweenTargetList = null;
        };

        _proto.setTimeout = function (_setTimeout) {
          function setTimeout(_x, _x2) {
            return _setTimeout.apply(this, arguments);
          }

          setTimeout.toString = function () {
            return _setTimeout.toString();
          };

          return setTimeout;
        }(function (cb, timeout) {
          var _this2 = this;

          if (!this.timeoutIdArr) this.timeoutIdArr = [];
          var timeoutId = setTimeout(function () {
            cb.call(_this2);
          }, timeout);
          this.timeoutIdArr.push(timeoutId);
          return timeoutId;
        });

        _proto.setInterval = function (_setInterval) {
          function setInterval(_x3, _x4) {
            return _setInterval.apply(this, arguments);
          }

          setInterval.toString = function () {
            return _setInterval.toString();
          };

          return setInterval;
        }(function (cb, timeout) {
          var _this3 = this;

          if (!this.intervalIdArr) this.intervalIdArr = [];
          var intervalId = setInterval(function () {
            cb.call(_this3);
          }, timeout);
          this.intervalIdArr.push(intervalId);
          return intervalId;
        }
        /**
         * 清除所有的setTimeout和setInterval定时器
         */
        );

        _proto.clearAllTimeoutOrInterval = function clearAllTimeoutOrInterval() {
          var self = this;

          if (self.timeoutIdArr) {
            for (var i = 0; i < self.timeoutIdArr.length; i++) {
              clearTimeout(self.timeoutIdArr[i]);
            }

            self.timeoutIdArr = null;
            console.log('清除timeoutIdArr: ' + self.node.name);
          }

          if (self.intervalIdArr) {
            for (var _i = 0; _i < self.intervalIdArr.length; _i++) {
              clearInterval(self.intervalIdArr[_i]);
            }

            self.intervalIdArr = null;
            console.log('清除intervalIdArr: ' + self.node.name);
          }
        };

        _proto.close = function close() {
          var self = this;
          self.onCloseAnimation(function () {
            self.destory();
          });
        };

        _proto.addSelf = function addSelf() {
          this.node.setParent(this._oldParent);
        };

        _proto.removeSelf = function removeSelf() {
          var self = this;
          self.node.removeFromParent();
        };

        _proto.destory = function destory() {
          var self = this;
          if (self.hasDestory) return;
          self.chilidCompClassMap = null;
          self._allList = null;
          this.node.destroy();
          self.hasDestory = true;
        };

        _proto._dispose = function _dispose() {
          var self = this;

          if (self._emmitMap) {
            for (var _event in self._emmitMap) {
              self.unEmitter(_event, self._emmitMap[_event]);
            }

            self._emmitMap = null;
          }

          if (self._objTapMap) {
            for (var key in self._objTapMap) {
              var splitKey = key.split('&');
              var eventFuncName = splitKey[0];
              var eventName = splitKey[1];
              var obj = self._objTapMap[key];
              obj.off(eventName, self.onNodeClick, self);
            }

            self._objTapMap = null;
          }

          if (self['offBgMaskClick']) self['offBgMaskClick'](); //清除背景灰色遮罩点击事件

          self.clearAllTimeoutOrInterval();
          self.rmAllTweens(); //子组件退出

          for (var _key2 in self.chilidCompClassMap) {
            var script = self.chilidCompClassMap[_key2];

            script._dispose();
          }

          console.log('退出' + self.className);
          self.onExit_b();
          self.onExit();
          self.onExit_a();
        };

        _createClass(UIComp, [{
          key: "className",
          get: function get() {
            var self = this;
            var str = self.name;
            str = str.match(/<(\S*)>/)[1];
            return str;
          }
        }], [{
          key: "__className",
          get: function get() {
            return this.name;
          }
        }]);

        return UIComp;
      }(Component), _class2.prefabUrl = '', _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UIDlg.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseUtil.ts', './SceneMgr.ts', './UILayer.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, _createClass, cclegacy, _decorator, Graphics, Color, Vec3, Node, BaseUT, SceneMgr, UILayer;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Graphics = module.Graphics;
      Color = module.Color;
      Vec3 = module.Vec3;
      Node = module.Node;
    }, function (module) {
      BaseUT = module.BaseUT;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }, function (module) {
      UILayer = module.UILayer;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "fd0a9W7//VLi4SGBIYOSe34", "UIDlg", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var UIDlg = exports('UIDlg', (_dec = ccclass('UIDlg'), _dec(_class = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(UIDlg, _UILayer);

        function UIDlg() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _UILayer.call.apply(_UILayer, [this].concat(args)) || this;
          _this.dlgMaskName = '__bgMask';
          _this._clickBgMask = void 0;
          _this._bgMaskNode = void 0;
          return _this;
        }

        var _proto = UIDlg.prototype;

        _proto.addToLayer = function addToLayer() {
          var self = this;
          var bgMaskNode = self._bgMaskNode = BaseUT.newUINode(self.dlgMaskName);
          var bg = bgMaskNode.addComponent(Graphics);
          var stageSize = BaseUT.getStageSize();
          var modalLayerColor = new Color(0x00, 0x00, 0x00, 255 * 0.4);
          bg.fillColor = modalLayerColor;
          bg.rect(-stageSize.width / 2, -stageSize.height / 2, stageSize.width, stageSize.height);
          bg.fill();
          BaseUT.setSize(bgMaskNode, stageSize.width, stageSize.height);
          self.clickBgMask = true;
          bgMaskNode.setParent(SceneMgr.inst.curScene.dlg);
          BaseUT.setPivot(self.node, 0.5, 0.5);
          self.node.setParent(SceneMgr.inst.curScene.dlg);
          self.onOpenAnimation();
        };

        _proto.resetParent = function resetParent() {
          var self = this;

          self._bgMaskNode.removeFromParent();

          self.node.insertChild(self._bgMaskNode, 0);
        };

        _proto.onOpenAnimation = function onOpenAnimation() {
          var self = this;
          self.getTween(this.node).to(0.1, {
            scale: new Vec3(1.1, 1.1, 1)
          }).to(0.1, {
            scale: new Vec3(1, 1, 1)
          }) // 缩放缓动
          .call(function () {
            self.resetParent();
          }).start();
        };

        _proto.onCloseAnimation = function onCloseAnimation(cb) {
          cb.call(this);
        }
        /**灰色遮罩是否可点击 */
        ;

        _proto.offBgMaskClick = function offBgMaskClick() {
          var self = this;

          self._bgMaskNode.off(Node.EventType.TOUCH_END, self.close, self);
        };

        _createClass(UIDlg, [{
          key: "clickBgMask",
          set: function set(value) {
            var self = this;
            if (self._clickBgMask == value) return;
            self._clickBgMask = value;

            if (value) {
              self._bgMaskNode.on(Node.EventType.TOUCH_END, self.close, self);
            } else {
              self.offBgMaskClick();
            }
          }
        }]);

        return UIDlg;
      }(UILayer)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UILayer.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './BaseUtil.ts', './ResMgr.ts', './SceneMgr.ts', './UIComp.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, _asyncToGenerator, _regeneratorRuntime, cclegacy, _decorator, instantiate, Layers, BaseUT, ResMgr, SceneMgr, UIComp;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _asyncToGenerator = module.asyncToGenerator;
      _regeneratorRuntime = module.regeneratorRuntime;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      instantiate = module.instantiate;
      Layers = module.Layers;
    }, function (module) {
      BaseUT = module.BaseUT;
    }, function (module) {
      ResMgr = module.ResMgr;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }, function (module) {
      UIComp = module.UIComp;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "8571a4LASpMRbsNSiK965zF", "UILayer", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var UILayer = exports('UILayer', (_dec = ccclass('UILayer'), _dec(_class = /*#__PURE__*/function (_UIComp) {
        _inheritsLoose(UILayer, _UIComp);

        function UILayer() {
          return _UIComp.apply(this, arguments) || this;
        }

        UILayer.show = /*#__PURE__*/function () {
          var _show = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
            var prefab, newNode, script;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return ResMgr.inst.loadPrefab(this.prefabUrl);

                  case 2:
                    prefab = _context.sent;
                    newNode = instantiate(prefab);
                    newNode.layer = Layers.Enum.UI_2D;
                    script = newNode.getComponent(this.name);
                    if (!script) script = newNode.addComponent(this.name);
                    BaseUT.setFitSize(script.node);
                    script.setData(data);
                    script.addToLayer();
                    return _context.abrupt("return", script);

                  case 11:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          function show(_x) {
            return _show.apply(this, arguments);
          }

          return show;
        }();

        var _proto = UILayer.prototype;

        _proto.addToLayer = function addToLayer() {
          this.node.setParent(SceneMgr.inst.curScene.layer);
        };

        return UILayer;
      }(UIComp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UIMenu.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SceneMgr.ts', './UILayer.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, cclegacy, _decorator, SceneMgr, UILayer;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }, function (module) {
      UILayer = module.UILayer;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "6cf72LMPeVJMJBMVbsaRH19", "UIMenu", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var UIMenu = exports('UIMenu', (_dec = ccclass('UIMenu'), _dec(_class = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(UIMenu, _UILayer);

        function UIMenu() {
          return _UILayer.apply(this, arguments) || this;
        }

        var _proto = UIMenu.prototype;

        _proto.addToLayer = function addToLayer() {
          this.node.setParent(SceneMgr.inst.curScene.menuLayer);
        };

        return UIMenu;
      }(UILayer)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UIMsg.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SceneMgr.ts', './UILayer.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, cclegacy, _decorator, SceneMgr, UILayer;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }, function (module) {
      UILayer = module.UILayer;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "fa77352ts5LoJAz3oE2bfgD", "UIMsg", undefined);

      var ccclass = _decorator.ccclass,
          property = _decorator.property;
      var UIMsg = exports('UIMsg', (_dec = ccclass('UIMsg'), _dec(_class = /*#__PURE__*/function (_UILayer) {
        _inheritsLoose(UIMsg, _UILayer);

        function UIMsg() {
          return _UILayer.apply(this, arguments) || this;
        }

        var _proto = UIMsg.prototype;

        _proto.addToLayer = function addToLayer() {
          this.node.setParent(SceneMgr.inst.curScene.msg);
        };

        return UIMsg;
      }(UILayer)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UIScene.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './SubLayerMgr.ts', './Emmiter.ts', './BaseUtil.ts', './SceneMgr.ts'], function (exports) {
  'use strict';

  var _inheritsLoose, _createClass, cclegacy, Component, SubLayerMgr, emmiter, BaseUT, SceneMgr;

  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
    }, function (module) {
      SubLayerMgr = module.SubLayerMgr;
    }, function (module) {
      emmiter = module.emmiter;
    }, function (module) {
      BaseUT = module.BaseUT;
    }, function (module) {
      SceneMgr = module.SceneMgr;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2c248rANetBSrUzidcvuUr9", "UIScene", undefined);

      var UIScene = exports('UIScene', /*#__PURE__*/function (_Component) {
        _inheritsLoose(UIScene, _Component);

        function UIScene() {
          var _this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.mainClassLayer = void 0;
          _this.subLayerMgr = void 0;
          _this.layer = void 0;
          _this.dlg = void 0;
          _this.msg = void 0;
          _this.menuLayer = void 0;
          _this._moduleParam = void 0;
          _this._isFirstEnter = true;
          _this._emmitMap = void 0;
          return _this;
        }

        var _proto = UIScene.prototype; //已注册的监听事件列表

        _proto.__preload = function __preload() {
          var self = this;
          self.subLayerMgr = new SubLayerMgr();
          self.ctor_b();
          if (self["ctor"]) self["ctor"]();
          self.ctor_a();
          BaseUT.setFitSize(this.node);
        };

        _proto.ctor_b = function ctor_b() {};

        _proto.ctor_a = function ctor_a() {};

        _proto.onEnter_b = function onEnter_b() {};

        _proto.onEnter_a = function onEnter_a() {};

        _proto.onExit_b = function onExit_b() {};

        _proto.onExit_a = function onExit_a() {};

        _proto.onEmitter = function onEmitter(event, listener) {
          var self = this;
          emmiter.on(event, listener, self);
          if (!self._emmitMap) self._emmitMap = {};
          self._emmitMap[event] = listener;
        };

        _proto.unEmitter = function unEmitter(event, listener) {
          var self = this;
          emmiter.off(event, listener, self);
        };

        _proto.emit = function emit(event, data) {
          emmiter.emit(event, data);
        };

        _proto.onLoad = function onLoad() {
          var self = this;
          this.initLayer();
          this.layer = this.layer;
          this.dlg = this.dlg;
          this.msg = this.msg;
          this.menuLayer = this.menuLayer;

          if (self.mainClassLayer) {
            self.subLayerMgr.register(self.mainClassLayer);
            self.push(self.mainClassLayer, {
              str: '我叫' + self.mainClassLayer.name
            });
          }
        };

        _proto.initLayer = function initLayer() {
          var self = this;
          self.layer = self.addGCom2GRoot('UILayer');
          self.menuLayer = self.addGCom2GRoot('UIMenuLayer');
          self.dlg = self.addGCom2GRoot('UIDlg');
          self.msg = self.addGCom2GRoot('UIMsg');
        }
        /**
        * 添加层级容器到GRoot
        * @param name 名称
        * @returns 
        */
        ;

        _proto.addGCom2GRoot = function addGCom2GRoot(name, isScene) {
          var newNode = BaseUT.newUINode(name);
          newNode.setParent(this.node);
          BaseUT.setFitSize(newNode);
          return newNode;
        };

        _proto.__doEnter = function __doEnter() {
          var self = this;
          console.log('进入' + self.node.name);
          self.onEnter_b();
          if (self['onEnter']) self['onEnter']();

          if (self._isFirstEnter) {
            self._isFirstEnter = false;
            if (self["onFirstEnter"]) self["onFirstEnter"]();
          }

          self.onEnter_a();
        };

        _proto.setData = function setData(data) {
          this._moduleParam = data;
        };

        _proto.onEnable = function onEnable() {
          var self = this;

          self.__doEnter();
        };

        _proto.onDisable = function onDisable() {
          var self = this;

          self._dispose();
        }
        /**重置到主界面（会清掉当前堆栈中的所有界面） */
        ;

        _proto.resetToMain = function resetToMain() {
          var self = this;
          self.releaseAllLayer();
          self.push(self.mainClassLayer, {});
        }
        /**显示指定界面（替换模式） */
        ;

        _proto.run = function run(LayerNameOrClass, data) {
          this.subLayerMgr.run(LayerNameOrClass, data);
        }
        /**显示指定界面（入栈模式） */
        ;

        _proto.push = function push(LayerNameOrClass, data) {
          this.subLayerMgr.push(LayerNameOrClass, data);
        }
        /**layer出栈 */
        ;

        _proto.pop = function pop() {
          this.subLayerMgr.pop();
        }
        /**将场景添加到canvas根节点 */
        ;

        _proto.addToGRoot = function addToGRoot() {
          SceneMgr.inst.getCanvas().insertChild(this.node, 1);
        };

        _proto.removeFromParent = function removeFromParent() {
          this.node.removeFromParent();
        }
        /**清除所有layer */
        ;

        _proto.releaseAllLayer = function releaseAllLayer() {
          this.subLayerMgr.releaseAllLayer();
        };

        _proto.disposeSubLayerMgr = function disposeSubLayerMgr() {
          this.subLayerMgr.dispose();
          this.subLayerMgr = null;
        };

        _proto._dispose = function _dispose() {
          var self = this;

          if (self._emmitMap) {
            for (var _event in self._emmitMap) {
              self.unEmitter(_event, self._emmitMap[_event]);
            }

            self._emmitMap = null;
          }

          console.log('退出' + self.node.name);
          this.onExit_b();
          if (self["onExit"]) self["onExit"]();
          this.onExit_a();
        };

        _proto.destory = function destory() {
          this._dispose();

          this.subLayerMgr.dispose();
          this.subLayerMgr = null;
          this.node.destroy();
        };

        _proto.onDestroy = function onDestroy() {
          console.log('onDestroy: ' + this.node.name);
        };

        _createClass(UIScene, [{
          key: "className",
          get: function get() {
            var self = this;
            var str = self.name;
            str = str.match(/<(\S*)>/)[1];
            return str;
          }
        }]);

        return UIScene;
      }(Component));

      cclegacy._RF.pop();
    }
  };
});
