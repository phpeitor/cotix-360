(function() {
	const I = document.createElement("link").relList;
	if (I && I.supports && I.supports("modulepreload")) return;
	for (const Mt of document.querySelectorAll('link[rel="modulepreload"]')) B(Mt);
	new MutationObserver(Mt => {
		for (const Ht of Mt)
			if (Ht.type === "childList")
				for (const Nt of Ht.addedNodes) Nt.tagName === "LINK" && Nt.rel === "modulepreload" && B(Nt)
	}).observe(document, {
		childList: !0,
		subtree: !0
	});

	function Xt(Mt) {
		const Ht = {};
		return Mt.integrity && (Ht.integrity = Mt.integrity), Mt.referrerPolicy && (Ht.referrerPolicy = Mt.referrerPolicy), Mt.crossOrigin === "use-credentials" ? Ht.credentials = "include" : Mt.crossOrigin === "anonymous" ? Ht.credentials = "omit" : Ht.credentials = "same-origin", Ht
	}

	function B(Mt) {
		if (Mt.ep) return;
		Mt.ep = !0;
		const Ht = Xt(Mt);
		fetch(Mt.href, Ht)
	}
})();
var yf = {
		exports: {}
	},
	er = {};
var Md;

function tm() {
	if (Md) return er;
	Md = 1;
	var rt = Symbol.for("react.transitional.element"),
		I = Symbol.for("react.fragment");

	function Xt(B, Mt, Ht) {
		var Nt = null;
		if (Ht !== void 0 && (Nt = "" + Ht), Mt.key !== void 0 && (Nt = "" + Mt.key), "key" in Mt) {
			Ht = {};
			for (var Ct in Mt) Ct !== "key" && (Ht[Ct] = Mt[Ct])
		} else Ht = Mt;
		return Mt = Ht.ref, {
			$$typeof: rt,
			type: B,
			key: Nt,
			ref: Mt !== void 0 ? Mt : null,
			props: Ht
		}
	}
	return er.Fragment = I, er.jsx = Xt, er.jsxs = Xt, er
}
var Td;

function em() {
	return Td || (Td = 1, yf.exports = tm()), yf.exports
}
var Rn = em(),
	gf = {
		exports: {}
	},
	Qt = {};
var Cd;

function nm() {
	if (Cd) return Qt;
	Cd = 1;
	var rt = Symbol.for("react.transitional.element"),
		I = Symbol.for("react.portal"),
		Xt = Symbol.for("react.fragment"),
		B = Symbol.for("react.strict_mode"),
		Mt = Symbol.for("react.profiler"),
		Ht = Symbol.for("react.consumer"),
		Nt = Symbol.for("react.context"),
		Ct = Symbol.for("react.forward_ref"),
		at = Symbol.for("react.suspense"),
		Y = Symbol.for("react.memo"),
		vt = Symbol.for("react.lazy"),
		it = Symbol.for("react.activity"),
		ot = Symbol.iterator;

	function yt(y) {
		return y === null || typeof y != "object" ? null : (y = ot && y[ot] || y["@@iterator"], typeof y == "function" ? y : null)
	}
	var S = {
			isMounted: function() {
				return !1
			},
			enqueueForceUpdate: function() {},
			enqueueReplaceState: function() {},
			enqueueSetState: function() {}
		},
		Pt = Object.assign,
		re = {};

	function xt(y, L, k) {
		this.props = y, this.context = L, this.refs = re, this.updater = k || S
	}
	xt.prototype.isReactComponent = {}, xt.prototype.setState = function(y, L) {
		if (typeof y != "object" && typeof y != "function" && y != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, y, L, "setState")
	}, xt.prototype.forceUpdate = function(y) {
		this.updater.enqueueForceUpdate(this, y, "forceUpdate")
	};

	function Yt() {}
	Yt.prototype = xt.prototype;

	function Gt(y, L, k) {
		this.props = y, this.context = L, this.refs = re, this.updater = k || S
	}
	var Dt = Gt.prototype = new Yt;
	Dt.constructor = Gt, Pt(Dt, xt.prototype), Dt.isPureReactComponent = !0;
	var It = Array.isArray;

	function ae() {}
	var Ut = {
			H: null,
			A: null,
			T: null,
			S: null
		},
		Me = Object.prototype.hasOwnProperty;

	function ct(y, L, k) {
		var W = k.ref;
		return {
			$$typeof: rt,
			type: y,
			key: L,
			ref: W !== void 0 ? W : null,
			props: k
		}
	}

	function ft(y, L) {
		return ct(y.type, L, y.props)
	}

	function E(y) {
		return typeof y == "object" && y !== null && y.$$typeof === rt
	}

	function Z(y) {
		var L = {
			"=": "=0",
			":": "=2"
		};
		return "$" + y.replace(/[=:]/g, function(k) {
			return L[k]
		})
	}
	var V = /\/+/g;

	function z(y, L) {
		return typeof y == "object" && y !== null && y.key != null ? Z("" + y.key) : L.toString(36)
	}

	function x(y) {
		switch (y.status) {
			case "fulfilled":
				return y.value;
			case "rejected":
				throw y.reason;
			default:
				switch (typeof y.status == "string" ? y.then(ae, ae) : (y.status = "pending", y.then(function(L) {
						y.status === "pending" && (y.status = "fulfilled", y.value = L)
					}, function(L) {
						y.status === "pending" && (y.status = "rejected", y.reason = L)
					})), y.status) {
					case "fulfilled":
						return y.value;
					case "rejected":
						throw y.reason
				}
		}
		throw y
	}

	function _(y, L, k, W, tt) {
		var gt = typeof y;
		(gt === "undefined" || gt === "boolean") && (y = null);
		var zt = !1;
		if (y === null) zt = !0;
		else switch (gt) {
			case "bigint":
			case "string":
			case "number":
				zt = !0;
				break;
			case "object":
				switch (y.$$typeof) {
					case rt:
					case I:
						zt = !0;
						break;
					case vt:
						return zt = y._init, _(zt(y._payload), L, k, W, tt)
				}
		}
		if (zt) return tt = tt(y), zt = W === "" ? "." + z(y, 0) : W, It(tt) ? (k = "", zt != null && (k = zt.replace(V, "$&/") + "/"), _(tt, L, k, "", function(te) {
			return te
		})) : tt != null && (E(tt) && (tt = ft(tt, k + (tt.key == null || y && y.key === tt.key ? "" : ("" + tt.key).replace(V, "$&/") + "/") + zt)), L.push(tt)), 1;
		zt = 0;
		var Bt = W === "" ? "." : W + ":";
		if (It(y))
			for (var Zt = 0; Zt < y.length; Zt++) W = y[Zt], gt = Bt + z(W, Zt), zt += _(W, L, k, gt, tt);
		else if (Zt = yt(y), typeof Zt == "function")
			for (y = Zt.call(y), Zt = 0; !(W = y.next()).done;) W = W.value, gt = Bt + z(W, Zt++), zt += _(W, L, k, gt, tt);
		else if (gt === "object") {
			if (typeof y.then == "function") return _(x(y), L, k, W, tt);
			throw L = String(y), Error("Objects are not valid as a React child (found: " + (L === "[object Object]" ? "object with keys {" + Object.keys(y).join(", ") + "}" : L) + "). If you meant to render a collection of children, use an array instead.")
		}
		return zt
	}

	function R(y, L, k) {
		if (y == null) return y;
		var W = [],
			tt = 0;
		return _(y, W, "", "", function(gt) {
			return L.call(k, gt, tt++)
		}), W
	}

	function K(y) {
		if (y._status === -1) {
			var L = y._result;
			L = L(), L.then(function(k) {
				(y._status === 0 || y._status === -1) && (y._status = 1, y._result = k)
			}, function(k) {
				(y._status === 0 || y._status === -1) && (y._status = 2, y._result = k)
			}), y._status === -1 && (y._status = 0, y._result = L)
		}
		if (y._status === 1) return y._result.default;
		throw y._result
	}
	var G = typeof reportError == "function" ? reportError : function(y) {
			if (typeof window == "object" && typeof window.ErrorEvent == "function") {
				var L = new window.ErrorEvent("error", {
					bubbles: !0,
					cancelable: !0,
					message: typeof y == "object" && y !== null && typeof y.message == "string" ? String(y.message) : String(y),
					error: y
				});
				if (!window.dispatchEvent(L)) return
			} else if (typeof process == "object" && typeof process.emit == "function") {
				process.emit("uncaughtException", y);
				return
			}
			console.error(y)
		},
		P = {
			map: R,
			forEach: function(y, L, k) {
				R(y, function() {
					L.apply(this, arguments)
				}, k)
			},
			count: function(y) {
				var L = 0;
				return R(y, function() {
					L++
				}), L
			},
			toArray: function(y) {
				return R(y, function(L) {
					return L
				}) || []
			},
			only: function(y) {
				if (!E(y)) throw Error("React.Children.only expected to receive a single React element child.");
				return y
			}
		};
	return Qt.Activity = it, Qt.Children = P, Qt.Component = xt, Qt.Fragment = Xt, Qt.Profiler = Mt, Qt.PureComponent = Gt, Qt.StrictMode = B, Qt.Suspense = at, Qt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Ut, Qt.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(y) {
			return Ut.H.useMemoCache(y)
		}
	}, Qt.cache = function(y) {
		return function() {
			return y.apply(null, arguments)
		}
	}, Qt.cacheSignal = function() {
		return null
	}, Qt.cloneElement = function(y, L, k) {
		if (y == null) throw Error("The argument must be a React element, but you passed " + y + ".");
		var W = Pt({}, y.props),
			tt = y.key;
		if (L != null)
			for (gt in L.key !== void 0 && (tt = "" + L.key), L) !Me.call(L, gt) || gt === "key" || gt === "__self" || gt === "__source" || gt === "ref" && L.ref === void 0 || (W[gt] = L[gt]);
		var gt = arguments.length - 2;
		if (gt === 1) W.children = k;
		else if (1 < gt) {
			for (var zt = Array(gt), Bt = 0; Bt < gt; Bt++) zt[Bt] = arguments[Bt + 2];
			W.children = zt
		}
		return ct(y.type, tt, W)
	}, Qt.createContext = function(y) {
		return y = {
			$$typeof: Nt,
			_currentValue: y,
			_currentValue2: y,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		}, y.Provider = y, y.Consumer = {
			$$typeof: Ht,
			_context: y
		}, y
	}, Qt.createElement = function(y, L, k) {
		var W, tt = {},
			gt = null;
		if (L != null)
			for (W in L.key !== void 0 && (gt = "" + L.key), L) Me.call(L, W) && W !== "key" && W !== "__self" && W !== "__source" && (tt[W] = L[W]);
		var zt = arguments.length - 2;
		if (zt === 1) tt.children = k;
		else if (1 < zt) {
			for (var Bt = Array(zt), Zt = 0; Zt < zt; Zt++) Bt[Zt] = arguments[Zt + 2];
			tt.children = Bt
		}
		if (y && y.defaultProps)
			for (W in zt = y.defaultProps, zt) tt[W] === void 0 && (tt[W] = zt[W]);
		return ct(y, gt, tt)
	}, Qt.createRef = function() {
		return {
			current: null
		}
	}, Qt.forwardRef = function(y) {
		return {
			$$typeof: Ct,
			render: y
		}
	}, Qt.isValidElement = E, Qt.lazy = function(y) {
		return {
			$$typeof: vt,
			_payload: {
				_status: -1,
				_result: y
			},
			_init: K
		}
	}, Qt.memo = function(y, L) {
		return {
			$$typeof: Y,
			type: y,
			compare: L === void 0 ? null : L
		}
	}, Qt.startTransition = function(y) {
		var L = Ut.T,
			k = {};
		Ut.T = k;
		try {
			var W = y(),
				tt = Ut.S;
			tt !== null && tt(k, W), typeof W == "object" && W !== null && typeof W.then == "function" && W.then(ae, G)
		} catch (gt) {
			G(gt)
		} finally {
			L !== null && k.types !== null && (L.types = k.types), Ut.T = L
		}
	}, Qt.unstable_useCacheRefresh = function() {
		return Ut.H.useCacheRefresh()
	}, Qt.use = function(y) {
		return Ut.H.use(y)
	}, Qt.useActionState = function(y, L, k) {
		return Ut.H.useActionState(y, L, k)
	}, Qt.useCallback = function(y, L) {
		return Ut.H.useCallback(y, L)
	}, Qt.useContext = function(y) {
		return Ut.H.useContext(y)
	}, Qt.useDebugValue = function() {}, Qt.useDeferredValue = function(y, L) {
		return Ut.H.useDeferredValue(y, L)
	}, Qt.useEffect = function(y, L) {
		return Ut.H.useEffect(y, L)
	}, Qt.useEffectEvent = function(y) {
		return Ut.H.useEffectEvent(y)
	}, Qt.useId = function() {
		return Ut.H.useId()
	}, Qt.useImperativeHandle = function(y, L, k) {
		return Ut.H.useImperativeHandle(y, L, k)
	}, Qt.useInsertionEffect = function(y, L) {
		return Ut.H.useInsertionEffect(y, L)
	}, Qt.useLayoutEffect = function(y, L) {
		return Ut.H.useLayoutEffect(y, L)
	}, Qt.useMemo = function(y, L) {
		return Ut.H.useMemo(y, L)
	}, Qt.useOptimistic = function(y, L) {
		return Ut.H.useOptimistic(y, L)
	}, Qt.useReducer = function(y, L, k) {
		return Ut.H.useReducer(y, L, k)
	}, Qt.useRef = function(y) {
		return Ut.H.useRef(y)
	}, Qt.useState = function(y) {
		return Ut.H.useState(y)
	}, Qt.useSyncExternalStore = function(y, L, k) {
		return Ut.H.useSyncExternalStore(y, L, k)
	}, Qt.useTransition = function() {
		return Ut.H.useTransition()
	}, Qt.version = "19.2.0", Qt
}
var Od;

function vo() {
	return Od || (Od = 1, gf.exports = nm()), gf.exports
}
var hl = vo(),
	bf = {
		exports: {}
	},
	nr = {},
	_f = {
		exports: {}
	},
	Af = {};
var Rd;

function am() {
	return Rd || (Rd = 1, (function(rt) {
		function I(_, R) {
			var K = _.length;
			_.push(R);
			t: for (; 0 < K;) {
				var G = K - 1 >>> 1,
					P = _[G];
				if (0 < Mt(P, R)) _[G] = R, _[K] = P, K = G;
				else break t
			}
		}

		function Xt(_) {
			return _.length === 0 ? null : _[0]
		}

		function B(_) {
			if (_.length === 0) return null;
			var R = _[0],
				K = _.pop();
			if (K !== R) {
				_[0] = K;
				t: for (var G = 0, P = _.length, y = P >>> 1; G < y;) {
					var L = 2 * (G + 1) - 1,
						k = _[L],
						W = L + 1,
						tt = _[W];
					if (0 > Mt(k, K)) W < P && 0 > Mt(tt, k) ? (_[G] = tt, _[W] = K, G = W) : (_[G] = k, _[L] = K, G = L);
					else if (W < P && 0 > Mt(tt, K)) _[G] = tt, _[W] = K, G = W;
					else break t
				}
			}
			return R
		}

		function Mt(_, R) {
			var K = _.sortIndex - R.sortIndex;
			return K !== 0 ? K : _.id - R.id
		}
		if (rt.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
			var Ht = performance;
			rt.unstable_now = function() {
				return Ht.now()
			}
		} else {
			var Nt = Date,
				Ct = Nt.now();
			rt.unstable_now = function() {
				return Nt.now() - Ct
			}
		}
		var at = [],
			Y = [],
			vt = 1,
			it = null,
			ot = 3,
			yt = !1,
			S = !1,
			Pt = !1,
			re = !1,
			xt = typeof setTimeout == "function" ? setTimeout : null,
			Yt = typeof clearTimeout == "function" ? clearTimeout : null,
			Gt = typeof setImmediate < "u" ? setImmediate : null;

		function Dt(_) {
			for (var R = Xt(Y); R !== null;) {
				if (R.callback === null) B(Y);
				else if (R.startTime <= _) B(Y), R.sortIndex = R.expirationTime, I(at, R);
				else break;
				R = Xt(Y)
			}
		}

		function It(_) {
			if (Pt = !1, Dt(_), !S)
				if (Xt(at) !== null) S = !0, ae || (ae = !0, Z());
				else {
					var R = Xt(Y);
					R !== null && x(It, R.startTime - _)
				}
		}
		var ae = !1,
			Ut = -1,
			Me = 5,
			ct = -1;

		function ft() {
			return re ? !0 : !(rt.unstable_now() - ct < Me)
		}

		function E() {
			if (re = !1, ae) {
				var _ = rt.unstable_now();
				ct = _;
				var R = !0;
				try {
					t: {
						S = !1,
						Pt && (Pt = !1, Yt(Ut), Ut = -1),
						yt = !0;
						var K = ot;
						try {
							e: {
								for (Dt(_), it = Xt(at); it !== null && !(it.expirationTime > _ && ft());) {
									var G = it.callback;
									if (typeof G == "function") {
										it.callback = null, ot = it.priorityLevel;
										var P = G(it.expirationTime <= _);
										if (_ = rt.unstable_now(), typeof P == "function") {
											it.callback = P, Dt(_), R = !0;
											break e
										}
										it === Xt(at) && B(at), Dt(_)
									} else B(at);
									it = Xt(at)
								}
								if (it !== null) R = !0;
								else {
									var y = Xt(Y);
									y !== null && x(It, y.startTime - _), R = !1
								}
							}
							break t
						}
						finally {
							it = null, ot = K, yt = !1
						}
						R = void 0
					}
				}
				finally {
					R ? Z() : ae = !1
				}
			}
		}
		var Z;
		if (typeof Gt == "function") Z = function() {
			Gt(E)
		};
		else if (typeof MessageChannel < "u") {
			var V = new MessageChannel,
				z = V.port2;
			V.port1.onmessage = E, Z = function() {
				z.postMessage(null)
			}
		} else Z = function() {
			xt(E, 0)
		};

		function x(_, R) {
			Ut = xt(function() {
				_(rt.unstable_now())
			}, R)
		}
		rt.unstable_IdlePriority = 5, rt.unstable_ImmediatePriority = 1, rt.unstable_LowPriority = 4, rt.unstable_NormalPriority = 3, rt.unstable_Profiling = null, rt.unstable_UserBlockingPriority = 2, rt.unstable_cancelCallback = function(_) {
			_.callback = null
		}, rt.unstable_forceFrameRate = function(_) {
			0 > _ || 125 < _ ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Me = 0 < _ ? Math.floor(1e3 / _) : 5
		}, rt.unstable_getCurrentPriorityLevel = function() {
			return ot
		}, rt.unstable_next = function(_) {
			switch (ot) {
				case 1:
				case 2:
				case 3:
					var R = 3;
					break;
				default:
					R = ot
			}
			var K = ot;
			ot = R;
			try {
				return _()
			} finally {
				ot = K
			}
		}, rt.unstable_requestPaint = function() {
			re = !0
		}, rt.unstable_runWithPriority = function(_, R) {
			switch (_) {
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
					break;
				default:
					_ = 3
			}
			var K = ot;
			ot = _;
			try {
				return R()
			} finally {
				ot = K
			}
		}, rt.unstable_scheduleCallback = function(_, R, K) {
			var G = rt.unstable_now();
			switch (typeof K == "object" && K !== null ? (K = K.delay, K = typeof K == "number" && 0 < K ? G + K : G) : K = G, _) {
				case 1:
					var P = -1;
					break;
				case 2:
					P = 250;
					break;
				case 5:
					P = 1073741823;
					break;
				case 4:
					P = 1e4;
					break;
				default:
					P = 5e3
			}
			return P = K + P, _ = {
				id: vt++,
				callback: R,
				priorityLevel: _,
				startTime: K,
				expirationTime: P,
				sortIndex: -1
			}, K > G ? (_.sortIndex = K, I(Y, _), Xt(at) === null && _ === Xt(Y) && (Pt ? (Yt(Ut), Ut = -1) : Pt = !0, x(It, K - G))) : (_.sortIndex = P, I(at, _), S || yt || (S = !0, ae || (ae = !0, Z()))), _
		}, rt.unstable_shouldYield = ft, rt.unstable_wrapCallback = function(_) {
			var R = ot;
			return function() {
				var K = ot;
				ot = R;
				try {
					return _.apply(this, arguments)
				} finally {
					ot = K
				}
			}
		}
	})(Af)), Af
}
var zd;

function im() {
	return zd || (zd = 1, _f.exports = am()), _f.exports
}
var Sf = {
		exports: {}
	},
	En = {};
var Dd;

function lm() {
	if (Dd) return En;
	Dd = 1;
	var rt = vo();

	function I(at) {
		var Y = "https://react.dev/errors/" + at;
		if (1 < arguments.length) {
			Y += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var vt = 2; vt < arguments.length; vt++) Y += "&args[]=" + encodeURIComponent(arguments[vt])
		}
		return "Minified React error #" + at + "; visit " + Y + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
	}

	function Xt() {}
	var B = {
			d: {
				f: Xt,
				r: function() {
					throw Error(I(522))
				},
				D: Xt,
				C: Xt,
				L: Xt,
				m: Xt,
				X: Xt,
				S: Xt,
				M: Xt
			},
			p: 0,
			findDOMNode: null
		},
		Mt = Symbol.for("react.portal");

	function Ht(at, Y, vt) {
		var it = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
		return {
			$$typeof: Mt,
			key: it == null ? null : "" + it,
			children: at,
			containerInfo: Y,
			implementation: vt
		}
	}
	var Nt = rt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;

	function Ct(at, Y) {
		if (at === "font") return "";
		if (typeof Y == "string") return Y === "use-credentials" ? Y : ""
	}
	return En.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = B, En.createPortal = function(at, Y) {
		var vt = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
		if (!Y || Y.nodeType !== 1 && Y.nodeType !== 9 && Y.nodeType !== 11) throw Error(I(299));
		return Ht(at, Y, null, vt)
	}, En.flushSync = function(at) {
		var Y = Nt.T,
			vt = B.p;
		try {
			if (Nt.T = null, B.p = 2, at) return at()
		} finally {
			Nt.T = Y, B.p = vt, B.d.f()
		}
	}, En.preconnect = function(at, Y) {
		typeof at == "string" && (Y ? (Y = Y.crossOrigin, Y = typeof Y == "string" ? Y === "use-credentials" ? Y : "" : void 0) : Y = null, B.d.C(at, Y))
	}, En.prefetchDNS = function(at) {
		typeof at == "string" && B.d.D(at)
	}, En.preinit = function(at, Y) {
		if (typeof at == "string" && Y && typeof Y.as == "string") {
			var vt = Y.as,
				it = Ct(vt, Y.crossOrigin),
				ot = typeof Y.integrity == "string" ? Y.integrity : void 0,
				yt = typeof Y.fetchPriority == "string" ? Y.fetchPriority : void 0;
			vt === "style" ? B.d.S(at, typeof Y.precedence == "string" ? Y.precedence : void 0, {
				crossOrigin: it,
				integrity: ot,
				fetchPriority: yt
			}) : vt === "script" && B.d.X(at, {
				crossOrigin: it,
				integrity: ot,
				fetchPriority: yt,
				nonce: typeof Y.nonce == "string" ? Y.nonce : void 0
			})
		}
	}, En.preinitModule = function(at, Y) {
		if (typeof at == "string")
			if (typeof Y == "object" && Y !== null) {
				if (Y.as == null || Y.as === "script") {
					var vt = Ct(Y.as, Y.crossOrigin);
					B.d.M(at, {
						crossOrigin: vt,
						integrity: typeof Y.integrity == "string" ? Y.integrity : void 0,
						nonce: typeof Y.nonce == "string" ? Y.nonce : void 0
					})
				}
			} else Y == null && B.d.M(at)
	}, En.preload = function(at, Y) {
		if (typeof at == "string" && typeof Y == "object" && Y !== null && typeof Y.as == "string") {
			var vt = Y.as,
				it = Ct(vt, Y.crossOrigin);
			B.d.L(at, vt, {
				crossOrigin: it,
				integrity: typeof Y.integrity == "string" ? Y.integrity : void 0,
				nonce: typeof Y.nonce == "string" ? Y.nonce : void 0,
				type: typeof Y.type == "string" ? Y.type : void 0,
				fetchPriority: typeof Y.fetchPriority == "string" ? Y.fetchPriority : void 0,
				referrerPolicy: typeof Y.referrerPolicy == "string" ? Y.referrerPolicy : void 0,
				imageSrcSet: typeof Y.imageSrcSet == "string" ? Y.imageSrcSet : void 0,
				imageSizes: typeof Y.imageSizes == "string" ? Y.imageSizes : void 0,
				media: typeof Y.media == "string" ? Y.media : void 0
			})
		}
	}, En.preloadModule = function(at, Y) {
		if (typeof at == "string")
			if (Y) {
				var vt = Ct(Y.as, Y.crossOrigin);
				B.d.m(at, {
					as: typeof Y.as == "string" && Y.as !== "script" ? Y.as : void 0,
					crossOrigin: vt,
					integrity: typeof Y.integrity == "string" ? Y.integrity : void 0
				})
			} else B.d.m(at)
	}, En.requestFormReset = function(at) {
		B.d.r(at)
	}, En.unstable_batchedUpdates = function(at, Y) {
		return at(Y)
	}, En.useFormState = function(at, Y, vt) {
		return Nt.H.useFormState(at, Y, vt)
	}, En.useFormStatus = function() {
		return Nt.H.useHostTransitionStatus()
	}, En.version = "19.2.0", En
}
var Ud;

function um() {
	if (Ud) return Sf.exports;
	Ud = 1;

	function rt() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(rt)
		} catch (I) {
			console.error(I)
		}
	}
	return rt(), Sf.exports = lm(), Sf.exports
}
var jd;

function rm() {
	if (jd) return nr;
	jd = 1;
	var rt = im(),
		I = vo(),
		Xt = um();

	function B(t) {
		var e = "https://react.dev/errors/" + t;
		if (1 < arguments.length) {
			e += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var n = 2; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n])
		}
		return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
	}

	function Mt(t) {
		return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11)
	}

	function Ht(t) {
		var e = t,
			n = t;
		if (t.alternate)
			for (; e.return;) e = e.return;
		else {
			t = e;
			do e = t, (e.flags & 4098) !== 0 && (n = e.return), t = e.return; while (t)
		}
		return e.tag === 3 ? n : null
	}

	function Nt(t) {
		if (t.tag === 13) {
			var e = t.memoizedState;
			if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated
		}
		return null
	}

	function Ct(t) {
		if (t.tag === 31) {
			var e = t.memoizedState;
			if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated
		}
		return null
	}

	function at(t) {
		if (Ht(t) !== t) throw Error(B(188))
	}

	function Y(t) {
		var e = t.alternate;
		if (!e) {
			if (e = Ht(t), e === null) throw Error(B(188));
			return e !== t ? null : t
		}
		for (var n = t, a = e;;) {
			var i = n.return;
			if (i === null) break;
			var r = i.alternate;
			if (r === null) {
				if (a = i.return, a !== null) {
					n = a;
					continue
				}
				break
			}
			if (i.child === r.child) {
				for (r = i.child; r;) {
					if (r === n) return at(i), t;
					if (r === a) return at(i), e;
					r = r.sibling
				}
				throw Error(B(188))
			}
			if (n.return !== a.return) n = i, a = r;
			else {
				for (var s = !1, v = i.child; v;) {
					if (v === n) {
						s = !0, n = i, a = r;
						break
					}
					if (v === a) {
						s = !0, a = i, n = r;
						break
					}
					v = v.sibling
				}
				if (!s) {
					for (v = r.child; v;) {
						if (v === n) {
							s = !0, n = r, a = i;
							break
						}
						if (v === a) {
							s = !0, a = r, n = i;
							break
						}
						v = v.sibling
					}
					if (!s) throw Error(B(189))
				}
			}
			if (n.alternate !== a) throw Error(B(190))
		}
		if (n.tag !== 3) throw Error(B(188));
		return n.stateNode.current === n ? t : e
	}

	function vt(t) {
		var e = t.tag;
		if (e === 5 || e === 26 || e === 27 || e === 6) return t;
		for (t = t.child; t !== null;) {
			if (e = vt(t), e !== null) return e;
			t = t.sibling
		}
		return null
	}
	var it = Object.assign,
		ot = Symbol.for("react.element"),
		yt = Symbol.for("react.transitional.element"),
		S = Symbol.for("react.portal"),
		Pt = Symbol.for("react.fragment"),
		re = Symbol.for("react.strict_mode"),
		xt = Symbol.for("react.profiler"),
		Yt = Symbol.for("react.consumer"),
		Gt = Symbol.for("react.context"),
		Dt = Symbol.for("react.forward_ref"),
		It = Symbol.for("react.suspense"),
		ae = Symbol.for("react.suspense_list"),
		Ut = Symbol.for("react.memo"),
		Me = Symbol.for("react.lazy"),
		ct = Symbol.for("react.activity"),
		ft = Symbol.for("react.memo_cache_sentinel"),
		E = Symbol.iterator;

	function Z(t) {
		return t === null || typeof t != "object" ? null : (t = E && t[E] || t["@@iterator"], typeof t == "function" ? t : null)
	}
	var V = Symbol.for("react.client.reference");

	function z(t) {
		if (t == null) return null;
		if (typeof t == "function") return t.$$typeof === V ? null : t.displayName || t.name || null;
		if (typeof t == "string") return t;
		switch (t) {
			case Pt:
				return "Fragment";
			case xt:
				return "Profiler";
			case re:
				return "StrictMode";
			case It:
				return "Suspense";
			case ae:
				return "SuspenseList";
			case ct:
				return "Activity"
		}
		if (typeof t == "object") switch (t.$$typeof) {
			case S:
				return "Portal";
			case Gt:
				return t.displayName || "Context";
			case Yt:
				return (t._context.displayName || "Context") + ".Consumer";
			case Dt:
				var e = t.render;
				return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
			case Ut:
				return e = t.displayName || null, e !== null ? e : z(t.type) || "Memo";
			case Me:
				e = t._payload, t = t._init;
				try {
					return z(t(e))
				} catch {}
		}
		return null
	}
	var x = Array.isArray,
		_ = I.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
		R = Xt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
		K = {
			pending: !1,
			data: null,
			method: null,
			action: null
		},
		G = [],
		P = -1;

	function y(t) {
		return {
			current: t
		}
	}

	function L(t) {
		0 > P || (t.current = G[P], G[P] = null, P--)
	}

	function k(t, e) {
		P++, G[P] = t.current, t.current = e
	}
	var W = y(null),
		tt = y(null),
		gt = y(null),
		zt = y(null);

	function Bt(t, e) {
		switch (k(gt, e), k(tt, t), k(W, null), e.nodeType) {
			case 9:
			case 11:
				t = (t = e.documentElement) && (t = t.namespaceURI) ? Jh(t) : 0;
				break;
			default:
				if (t = e.tagName, e = e.namespaceURI) e = Jh(e), t = Wh(e, t);
				else switch (t) {
					case "svg":
						t = 1;
						break;
					case "math":
						t = 2;
						break;
					default:
						t = 0
				}
		}
		L(W), k(W, t)
	}

	function Zt() {
		L(W), L(tt), L(gt)
	}

	function te(t) {
		t.memoizedState !== null && k(zt, t);
		var e = W.current,
			n = Wh(e, t.type);
		e !== n && (k(tt, t), k(W, n))
	}

	function Le(t) {
		tt.current === t && (L(W), L(tt)), zt.current === t && (L(zt), ku._currentValue = K)
	}
	var Rt, ee;

	function _e(t) {
		if (Rt === void 0) try {
			throw Error()
		} catch (n) {
			var e = n.stack.trim().match(/\n( *(at )?)/);
			Rt = e && e[1] || "", ee = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : ""
		}
		return `
` + Rt + t + ee
	}
	var ve = !1;

	function on(t, e) {
		if (!t || ve) return "";
		ve = !0;
		var n = Error.prepareStackTrace;
		Error.prepareStackTrace = void 0;
		try {
			var a = {
				DetermineComponentFrameRoot: function() {
					try {
						if (e) {
							var J = function() {
								throw Error()
							};
							if (Object.defineProperty(J.prototype, "props", {
									set: function() {
										throw Error()
									}
								}), typeof Reflect == "object" && Reflect.construct) {
								try {
									Reflect.construct(J, [])
								} catch (X) {
									var H = X
								}
								Reflect.construct(t, [], J)
							} else {
								try {
									J.call()
								} catch (X) {
									H = X
								}
								t.call(J.prototype)
							}
						} else {
							try {
								throw Error()
							} catch (X) {
								H = X
							}(J = t()) && typeof J.catch == "function" && J.catch(function() {})
						}
					} catch (X) {
						if (X && H && typeof X.stack == "string") return [X.stack, H.stack]
					}
					return [null, null]
				}
			};
			a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
			var i = Object.getOwnPropertyDescriptor(a.DetermineComponentFrameRoot, "name");
			i && i.configurable && Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
				value: "DetermineComponentFrameRoot"
			});
			var r = a.DetermineComponentFrameRoot(),
				s = r[0],
				v = r[1];
			if (s && v) {
				var b = s.split(`
`),
					j = v.split(`
`);
				for (i = a = 0; a < b.length && !b[a].includes("DetermineComponentFrameRoot");) a++;
				for (; i < j.length && !j[i].includes("DetermineComponentFrameRoot");) i++;
				if (a === b.length || i === j.length)
					for (a = b.length - 1, i = j.length - 1; 1 <= a && 0 <= i && b[a] !== j[i];) i--;
				for (; 1 <= a && 0 <= i; a--, i--)
					if (b[a] !== j[i]) {
						if (a !== 1 || i !== 1)
							do
								if (a--, i--, 0 > i || b[a] !== j[i]) {
									var Q = `
` + b[a].replace(" at new ", " at ");
									return t.displayName && Q.includes("<anonymous>") && (Q = Q.replace("<anonymous>", t.displayName)), Q
								} while (1 <= a && 0 <= i);
						break
					}
			}
		} finally {
			ve = !1, Error.prepareStackTrace = n
		}
		return (n = t ? t.displayName || t.name : "") ? _e(n) : ""
	}

	function Kn(t, e) {
		switch (t.tag) {
			case 26:
			case 27:
			case 5:
				return _e(t.type);
			case 16:
				return _e("Lazy");
			case 13:
				return t.child !== e && e !== null ? _e("Suspense Fallback") : _e("Suspense");
			case 19:
				return _e("SuspenseList");
			case 0:
			case 15:
				return on(t.type, !1);
			case 11:
				return on(t.type.render, !1);
			case 1:
				return on(t.type, !0);
			case 31:
				return _e("Activity");
			default:
				return ""
		}
	}

	function Oe(t) {
		try {
			var e = "",
				n = null;
			do e += Kn(t, n), n = t, t = t.return; while (t);
			return e
		} catch (a) {
			return `
Error generating stack: ` + a.message + `
` + a.stack
		}
	}
	var qt = Object.prototype.hasOwnProperty,
		xn = rt.unstable_scheduleCallback,
		Qe = rt.unstable_cancelCallback,
		Ua = rt.unstable_shouldYield,
		gn = rt.unstable_requestPaint,
		Ae = rt.unstable_now,
		tn = rt.unstable_getCurrentPriorityLevel,
		d = rt.unstable_ImmediatePriority,
		o = rt.unstable_UserBlockingPriority,
		f = rt.unstable_NormalPriority,
		p = rt.unstable_LowPriority,
		M = rt.unstable_IdlePriority,
		q = rt.log,
		et = rt.unstable_setDisableYieldValue,
		St = null,
		Et = null;

	function mt(t) {
		if (typeof q == "function" && et(t), Et && typeof Et.setStrictMode == "function") try {
			Et.setStrictMode(St, t)
		} catch {}
	}
	var Tt = Math.clz32 ? Math.clz32 : Ne,
		Se = Math.log,
		en = Math.LN2;

	function Ne(t) {
		return t >>>= 0, t === 0 ? 32 : 31 - (Se(t) / en | 0) | 0
	}
	var bn = 256,
		cn = 262144,
		nn = 4194304;

	function Ze(t) {
		var e = t & 42;
		if (e !== 0) return e;
		switch (t & -t) {
			case 1:
				return 1;
			case 2:
				return 2;
			case 4:
				return 4;
			case 8:
				return 8;
			case 16:
				return 16;
			case 32:
				return 32;
			case 64:
				return 64;
			case 128:
				return 128;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
				return t & 261888;
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
				return t & 3932160;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				return t & 62914560;
			case 67108864:
				return 67108864;
			case 134217728:
				return 134217728;
			case 268435456:
				return 268435456;
			case 536870912:
				return 536870912;
			case 1073741824:
				return 0;
			default:
				return t
		}
	}

	function fn(t, e, n) {
		var a = t.pendingLanes;
		if (a === 0) return 0;
		var i = 0,
			r = t.suspendedLanes,
			s = t.pingedLanes;
		t = t.warmLanes;
		var v = a & 134217727;
		return v !== 0 ? (a = v & ~r, a !== 0 ? i = Ze(a) : (s &= v, s !== 0 ? i = Ze(s) : n || (n = v & ~t, n !== 0 && (i = Ze(n))))) : (v = a & ~r, v !== 0 ? i = Ze(v) : s !== 0 ? i = Ze(s) : n || (n = a & ~t, n !== 0 && (i = Ze(n)))), i === 0 ? 0 : e !== 0 && e !== i && (e & r) === 0 && (r = i & -i, n = e & -e, r >= n || r === 32 && (n & 4194048) !== 0) ? e : i
	}

	function zn(t, e) {
		return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0
	}

	function fa(t, e) {
		switch (t) {
			case 1:
			case 2:
			case 4:
			case 8:
			case 64:
				return e + 250;
			case 16:
			case 32:
			case 128:
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
				return e + 5e3;
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				return -1;
			case 67108864:
			case 134217728:
			case 268435456:
			case 536870912:
			case 1073741824:
				return -1;
			default:
				return -1
		}
	}

	function Vt() {
		var t = nn;
		return nn <<= 1, (nn & 62914560) === 0 && (nn = 4194304), t
	}

	function Dn(t) {
		for (var e = [], n = 0; 31 > n; n++) e.push(t);
		return e
	}

	function Jt(t, e) {
		t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0)
	}

	function sa(t, e, n, a, i, r) {
		var s = t.pendingLanes;
		t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= n, t.entangledLanes &= n, t.errorRecoveryDisabledLanes &= n, t.shellSuspendCounter = 0;
		var v = t.entanglements,
			b = t.expirationTimes,
			j = t.hiddenUpdates;
		for (n = s & ~n; 0 < n;) {
			var Q = 31 - Tt(n),
				J = 1 << Q;
			v[Q] = 0, b[Q] = -1;
			var H = j[Q];
			if (H !== null)
				for (j[Q] = null, Q = 0; Q < H.length; Q++) {
					var X = H[Q];
					X !== null && (X.lane &= -536870913)
				}
			n &= ~J
		}
		a !== 0 && ni(t, a, 0), r !== 0 && i === 0 && t.tag !== 0 && (t.suspendedLanes |= r & ~(s & ~e))
	}

	function ni(t, e, n) {
		t.pendingLanes |= e, t.suspendedLanes &= ~e;
		var a = 31 - Tt(e);
		t.entangledLanes |= e, t.entanglements[a] = t.entanglements[a] | 1073741824 | n & 261930
	}

	function ar(t, e) {
		var n = t.entangledLanes |= e;
		for (t = t.entanglements; n;) {
			var a = 31 - Tt(n),
				i = 1 << a;
			i & e | t[a] & e && (t[a] |= e), n &= ~i
		}
	}

	function ai(t, e) {
		var n = e & -e;
		return n = (n & 42) !== 0 ? 1 : dl(n), (n & (t.suspendedLanes | e)) !== 0 ? 0 : n
	}

	function dl(t) {
		switch (t) {
			case 2:
				t = 1;
				break;
			case 8:
				t = 4;
				break;
			case 32:
				t = 16;
				break;
			case 256:
			case 512:
			case 1024:
			case 2048:
			case 4096:
			case 8192:
			case 16384:
			case 32768:
			case 65536:
			case 131072:
			case 262144:
			case 524288:
			case 1048576:
			case 2097152:
			case 4194304:
			case 8388608:
			case 16777216:
			case 33554432:
				t = 128;
				break;
			case 268435456:
				t = 134217728;
				break;
			default:
				t = 0
		}
		return t
	}

	function bt(t) {
		return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2
	}

	function vl() {
		var t = R.p;
		return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : gd(t.type))
	}

	function ir(t, e) {
		var n = R.p;
		try {
			return R.p = t, e()
		} finally {
			R.p = n
		}
	}
	var ba = Math.random().toString(36).slice(2),
		Be = "__reactFiber$" + ba,
		sn = "__reactProps$" + ba,
		ja = "__reactContainer$" + ba,
		ii = "__reactEvents$" + ba,
		lr = "__reactListeners$" + ba,
		ur = "__reactHandles$" + ba,
		Xi = "__reactResources$" + ba,
		li = "__reactMarker$" + ba;

	function Jn(t) {
		delete t[Be], delete t[sn], delete t[ii], delete t[lr], delete t[ur]
	}

	function La(t) {
		var e = t[Be];
		if (e) return e;
		for (var n = t.parentNode; n;) {
			if (e = n[ja] || n[Be]) {
				if (n = e.alternate, e.child !== null || n !== null && n.child !== null)
					for (t = nd(t); t !== null;) {
						if (n = t[Be]) return n;
						t = nd(t)
					}
				return e
			}
			t = n, n = t.parentNode
		}
		return null
	}

	function ui(t) {
		if (t = t[Be] || t[ja]) {
			var e = t.tag;
			if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return t
		}
		return null
	}

	function Gi(t) {
		var e = t.tag;
		if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
		throw Error(B(33))
	}

	function _a(t) {
		var e = t[Xi];
		return e || (e = t[Xi] = {
			hoistableStyles: new Map,
			hoistableScripts: new Map
		}), e
	}

	function Fe(t) {
		t[li] = !0
	}
	var ml = new Set,
		Wn = {};

	function In(t, e) {
		Aa(t, e), Aa(t + "Capture", e)
	}

	function Aa(t, e) {
		for (Wn[t] = e, t = 0; t < e.length; t++) ml.add(e[t])
	}
	var mo = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),
		qi = {},
		iu = {};

	function rr(t) {
		return qt.call(iu, t) ? !0 : qt.call(qi, t) ? !1 : mo.test(t) ? iu[t] = !0 : (qi[t] = !0, !1)
	}

	function Sa(t, e, n) {
		if (rr(e))
			if (n === null) t.removeAttribute(e);
			else {
				switch (typeof n) {
					case "undefined":
					case "function":
					case "symbol":
						t.removeAttribute(e);
						return;
					case "boolean":
						var a = e.toLowerCase().slice(0, 5);
						if (a !== "data-" && a !== "aria-") {
							t.removeAttribute(e);
							return
						}
				}
				t.setAttribute(e, "" + n)
			}
	}

	function Qi(t, e, n) {
		if (n === null) t.removeAttribute(e);
		else {
			switch (typeof n) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					t.removeAttribute(e);
					return
			}
			t.setAttribute(e, "" + n)
		}
	}

	function hn(t, e, n, a) {
		if (a === null) t.removeAttribute(n);
		else {
			switch (typeof a) {
				case "undefined":
				case "function":
				case "symbol":
				case "boolean":
					t.removeAttribute(n);
					return
			}
			t.setAttributeNS(e, n, "" + a)
		}
	}

	function _n(t) {
		switch (typeof t) {
			case "bigint":
			case "boolean":
			case "number":
			case "string":
			case "undefined":
				return t;
			case "object":
				return t;
			default:
				return ""
		}
	}

	function ri(t) {
		var e = t.type;
		return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio")
	}

	function oi(t, e, n) {
		var a = Object.getOwnPropertyDescriptor(t.constructor.prototype, e);
		if (!t.hasOwnProperty(e) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
			var i = a.get,
				r = a.set;
			return Object.defineProperty(t, e, {
				configurable: !0,
				get: function() {
					return i.call(this)
				},
				set: function(s) {
					n = "" + s, r.call(this, s)
				}
			}), Object.defineProperty(t, e, {
				enumerable: a.enumerable
			}), {
				getValue: function() {
					return n
				},
				setValue: function(s) {
					n = "" + s
				},
				stopTracking: function() {
					t._valueTracker = null, delete t[e]
				}
			}
		}
	}

	function Zi(t) {
		if (!t._valueTracker) {
			var e = ri(t) ? "checked" : "value";
			t._valueTracker = oi(t, e, "" + t[e])
		}
	}

	function kn(t) {
		if (!t) return !1;
		var e = t._valueTracker;
		if (!e) return !0;
		var n = e.getValue(),
			a = "";
		return t && (a = ri(t) ? t.checked ? "true" : "false" : t.value), t = a, t !== n ? (e.setValue(t), !0) : !1
	}

	function jt(t) {
		if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
		try {
			return t.activeElement || t.body
		} catch {
			return t.body
		}
	}
	var $n = /[\n"\\]/g;

	function Xe(t) {
		return t.replace($n, function(e) {
			return "\\" + e.charCodeAt(0).toString(16) + " "
		})
	}

	function pl(t, e, n, a, i, r, s, v) {
		t.name = "", s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? t.type = s : t.removeAttribute("type"), e != null ? s === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + _n(e)) : t.value !== "" + _n(e) && (t.value = "" + _n(e)) : s !== "submit" && s !== "reset" || t.removeAttribute("value"), e != null ? yl(t, s, _n(e)) : n != null ? yl(t, s, _n(n)) : a != null && t.removeAttribute("value"), i == null && r != null && (t.defaultChecked = !!r), i != null && (t.checked = i && typeof i != "function" && typeof i != "symbol"), v != null && typeof v != "function" && typeof v != "symbol" && typeof v != "boolean" ? t.name = "" + _n(v) : t.removeAttribute("name")
	}

	function lu(t, e, n, a, i, r, s, v) {
		if (r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" && (t.type = r), e != null || n != null) {
			if (!(r !== "submit" && r !== "reset" || e != null)) {
				Zi(t);
				return
			}
			n = n != null ? "" + _n(n) : "", e = e != null ? "" + _n(e) : n, v || e === t.value || (t.value = e), t.defaultValue = e
		}
		a = a ?? i, a = typeof a != "function" && typeof a != "symbol" && !!a, t.checked = v ? t.checked : !!a, t.defaultChecked = !!a, s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (t.name = s), Zi(t)
	}

	function yl(t, e, n) {
		e === "number" && jt(t.ownerDocument) === t || t.defaultValue === "" + n || (t.defaultValue = "" + n)
	}

	function Re(t, e, n, a) {
		if (t = t.options, e) {
			e = {};
			for (var i = 0; i < n.length; i++) e["$" + n[i]] = !0;
			for (n = 0; n < t.length; n++) i = e.hasOwnProperty("$" + t[n].value), t[n].selected !== i && (t[n].selected = i), i && a && (t[n].defaultSelected = !0)
		} else {
			for (n = "" + _n(n), e = null, i = 0; i < t.length; i++) {
				if (t[i].value === n) {
					t[i].selected = !0, a && (t[i].defaultSelected = !0);
					return
				}
				e !== null || t[i].disabled || (e = t[i])
			}
			e !== null && (e.selected = !0)
		}
	}

	function ci(t, e, n) {
		if (e != null && (e = "" + _n(e), e !== t.value && (t.value = e), n == null)) {
			t.defaultValue !== e && (t.defaultValue = e);
			return
		}
		t.defaultValue = n != null ? "" + _n(n) : ""
	}

	function gl(t, e, n, a) {
		if (e == null) {
			if (a != null) {
				if (n != null) throw Error(B(92));
				if (x(a)) {
					if (1 < a.length) throw Error(B(93));
					a = a[0]
				}
				n = a
			}
			n == null && (n = ""), e = n
		}
		n = _n(e), t.defaultValue = n, a = t.textContent, a === n && a !== "" && a !== null && (t.value = a), Zi(t)
	}

	function Pn(t, e) {
		if (e) {
			var n = t.firstChild;
			if (n && n === t.lastChild && n.nodeType === 3) {
				n.nodeValue = e;
				return
			}
		}
		t.textContent = e
	}
	var ha = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));

	function bl(t, e, n) {
		var a = e.indexOf("--") === 0;
		n == null || typeof n == "boolean" || n === "" ? a ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : a ? t.setProperty(e, n) : typeof n != "number" || n === 0 || ha.has(e) ? e === "float" ? t.cssFloat = n : t[e] = ("" + n).trim() : t[e] = n + "px"
	}

	function wa(t, e, n) {
		if (e != null && typeof e != "object") throw Error(B(62));
		if (t = t.style, n != null) {
			for (var a in n) !n.hasOwnProperty(a) || e != null && e.hasOwnProperty(a) || (a.indexOf("--") === 0 ? t.setProperty(a, "") : a === "float" ? t.cssFloat = "" : t[a] = "");
			for (var i in e) a = e[i], e.hasOwnProperty(i) && n[i] !== a && bl(t, i, a)
		} else
			for (var r in e) e.hasOwnProperty(r) && bl(t, r, e[r])
	}

	function _l(t) {
		if (t.indexOf("-") === -1) return !1;
		switch (t) {
			case "annotation-xml":
			case "color-profile":
			case "font-face":
			case "font-face-src":
			case "font-face-uri":
			case "font-face-format":
			case "font-face-name":
			case "missing-glyph":
				return !1;
			default:
				return !0
		}
	}
	var Fi = new Map([
			["acceptCharset", "accept-charset"],
			["htmlFor", "for"],
			["httpEquiv", "http-equiv"],
			["crossOrigin", "crossorigin"],
			["accentHeight", "accent-height"],
			["alignmentBaseline", "alignment-baseline"],
			["arabicForm", "arabic-form"],
			["baselineShift", "baseline-shift"],
			["capHeight", "cap-height"],
			["clipPath", "clip-path"],
			["clipRule", "clip-rule"],
			["colorInterpolation", "color-interpolation"],
			["colorInterpolationFilters", "color-interpolation-filters"],
			["colorProfile", "color-profile"],
			["colorRendering", "color-rendering"],
			["dominantBaseline", "dominant-baseline"],
			["enableBackground", "enable-background"],
			["fillOpacity", "fill-opacity"],
			["fillRule", "fill-rule"],
			["floodColor", "flood-color"],
			["floodOpacity", "flood-opacity"],
			["fontFamily", "font-family"],
			["fontSize", "font-size"],
			["fontSizeAdjust", "font-size-adjust"],
			["fontStretch", "font-stretch"],
			["fontStyle", "font-style"],
			["fontVariant", "font-variant"],
			["fontWeight", "font-weight"],
			["glyphName", "glyph-name"],
			["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
			["glyphOrientationVertical", "glyph-orientation-vertical"],
			["horizAdvX", "horiz-adv-x"],
			["horizOriginX", "horiz-origin-x"],
			["imageRendering", "image-rendering"],
			["letterSpacing", "letter-spacing"],
			["lightingColor", "lighting-color"],
			["markerEnd", "marker-end"],
			["markerMid", "marker-mid"],
			["markerStart", "marker-start"],
			["overlinePosition", "overline-position"],
			["overlineThickness", "overline-thickness"],
			["paintOrder", "paint-order"],
			["panose-1", "panose-1"],
			["pointerEvents", "pointer-events"],
			["renderingIntent", "rendering-intent"],
			["shapeRendering", "shape-rendering"],
			["stopColor", "stop-color"],
			["stopOpacity", "stop-opacity"],
			["strikethroughPosition", "strikethrough-position"],
			["strikethroughThickness", "strikethrough-thickness"],
			["strokeDasharray", "stroke-dasharray"],
			["strokeDashoffset", "stroke-dashoffset"],
			["strokeLinecap", "stroke-linecap"],
			["strokeLinejoin", "stroke-linejoin"],
			["strokeMiterlimit", "stroke-miterlimit"],
			["strokeOpacity", "stroke-opacity"],
			["strokeWidth", "stroke-width"],
			["textAnchor", "text-anchor"],
			["textDecoration", "text-decoration"],
			["textRendering", "text-rendering"],
			["transformOrigin", "transform-origin"],
			["underlinePosition", "underline-position"],
			["underlineThickness", "underline-thickness"],
			["unicodeBidi", "unicode-bidi"],
			["unicodeRange", "unicode-range"],
			["unitsPerEm", "units-per-em"],
			["vAlphabetic", "v-alphabetic"],
			["vHanging", "v-hanging"],
			["vIdeographic", "v-ideographic"],
			["vMathematical", "v-mathematical"],
			["vectorEffect", "vector-effect"],
			["vertAdvY", "vert-adv-y"],
			["vertOriginX", "vert-origin-x"],
			["vertOriginY", "vert-origin-y"],
			["wordSpacing", "word-spacing"],
			["writingMode", "writing-mode"],
			["xmlnsXlink", "xmlns:xlink"],
			["xHeight", "x-height"]
		]),
		Al = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;

	function fi(t) {
		return Al.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t
	}

	function ta() {}
	var Sl = null;

	function uu(t) {
		return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t
	}
	var ea = null,
		da = null;

	function Na(t) {
		var e = ui(t);
		if (e && (t = e.stateNode)) {
			var n = t[sn] || null;
			t: switch (t = e.stateNode, e.type) {
				case "input":
					if (pl(t, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), e = n.name, n.type === "radio" && e != null) {
						for (n = t; n.parentNode;) n = n.parentNode;
						for (n = n.querySelectorAll('input[name="' + Xe("" + e) + '"][type="radio"]'), e = 0; e < n.length; e++) {
							var a = n[e];
							if (a !== t && a.form === t.form) {
								var i = a[sn] || null;
								if (!i) throw Error(B(90));
								pl(a, i.value, i.defaultValue, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name)
							}
						}
						for (e = 0; e < n.length; e++) a = n[e], a.form === t.form && kn(a)
					}
					break t;
				case "textarea":
					ci(t, n.value, n.defaultValue);
					break t;
				case "select":
					e = n.value, e != null && Re(t, !!n.multiple, e, !1)
			}
		}
	}
	var si = !1;

	function hi(t, e, n) {
		if (si) return t(e, n);
		si = !0;
		try {
			var a = t(e);
			return a
		} finally {
			if (si = !1, (ea !== null || da !== null) && (Qr(), ea && (e = ea, t = da, da = ea = null, Na(e), t)))
				for (e = 0; e < t.length; e++) Na(t[e])
		}
	}

	function va(t, e) {
		var n = t.stateNode;
		if (n === null) return null;
		var a = n[sn] || null;
		if (a === null) return null;
		n = a[e];
		t: switch (e) {
			case "onClick":
			case "onClickCapture":
			case "onDoubleClick":
			case "onDoubleClickCapture":
			case "onMouseDown":
			case "onMouseDownCapture":
			case "onMouseMove":
			case "onMouseMoveCapture":
			case "onMouseUp":
			case "onMouseUpCapture":
			case "onMouseEnter":
				(a = !a.disabled) || (t = t.type, a = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !a;
				break t;
			default:
				t = !1
		}
		if (t) return null;
		if (n && typeof n != "function") throw Error(B(231, e, typeof n));
		return n
	}
	var An = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
		di = !1;
	if (An) try {
		var an = {};
		Object.defineProperty(an, "passive", {
			get: function() {
				di = !0
			}
		}), window.addEventListener("test", an, an), window.removeEventListener("test", an, an)
	} catch {
		di = !1
	}
	var Ea = null,
		Un = null,
		vi = null;

	function Ki() {
		if (vi) return vi;
		var t, e = Un,
			n = e.length,
			a, i = "value" in Ea ? Ea.value : Ea.textContent,
			r = i.length;
		for (t = 0; t < n && e[t] === i[t]; t++);
		var s = n - t;
		for (a = 1; a <= s && e[n - a] === i[r - a]; a++);
		return vi = i.slice(t, 1 < a ? 1 - a : void 0)
	}

	function mi(t) {
		var e = t.keyCode;
		return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0
	}

	function pi() {
		return !0
	}

	function or() {
		return !1
	}

	function Sn(t) {
		function e(n, a, i, r, s) {
			this._reactName = n, this._targetInst = i, this.type = a, this.nativeEvent = r, this.target = s, this.currentTarget = null;
			for (var v in t) t.hasOwnProperty(v) && (n = t[v], this[v] = n ? n(r) : r[v]);
			return this.isDefaultPrevented = (r.defaultPrevented != null ? r.defaultPrevented : r.returnValue === !1) ? pi : or, this.isPropagationStopped = or, this
		}
		return it(e.prototype, {
			preventDefault: function() {
				this.defaultPrevented = !0;
				var n = this.nativeEvent;
				n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = pi)
			},
			stopPropagation: function() {
				var n = this.nativeEvent;
				n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = pi)
			},
			persist: function() {},
			isPersistent: pi
		}), e
	}
	var na = {
			eventPhase: 0,
			bubbles: 0,
			cancelable: 0,
			timeStamp: function(t) {
				return t.timeStamp || Date.now()
			},
			defaultPrevented: 0,
			isTrusted: 0
		},
		wl = Sn(na),
		Ji = it({}, na, {
			view: 0,
			detail: 0
		}),
		po = Sn(Ji),
		yi, El, Ma, Wi = it({}, Ji, {
			screenX: 0,
			screenY: 0,
			clientX: 0,
			clientY: 0,
			pageX: 0,
			pageY: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			getModifierState: hu,
			button: 0,
			buttons: 0,
			relatedTarget: function(t) {
				return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget
			},
			movementX: function(t) {
				return "movementX" in t ? t.movementX : (t !== Ma && (Ma && t.type === "mousemove" ? (yi = t.screenX - Ma.screenX, El = t.screenY - Ma.screenY) : El = yi = 0, Ma = t), yi)
			},
			movementY: function(t) {
				return "movementY" in t ? t.movementY : El
			}
		}),
		ru = Sn(Wi),
		yo = it({}, Wi, {
			dataTransfer: 0
		}),
		go = Sn(yo),
		un = it({}, Ji, {
			relatedTarget: 0
		}),
		Ml = Sn(un),
		ma = it({}, na, {
			animationName: 0,
			elapsedTime: 0,
			pseudoElement: 0
		}),
		bo = Sn(ma),
		Tl = it({}, na, {
			clipboardData: function(t) {
				return "clipboardData" in t ? t.clipboardData : window.clipboardData
			}
		}),
		Cl = Sn(Tl),
		ou = it({}, na, {
			data: 0
		}),
		cu = Sn(ou),
		fu = {
			Esc: "Escape",
			Spacebar: " ",
			Left: "ArrowLeft",
			Up: "ArrowUp",
			Right: "ArrowRight",
			Down: "ArrowDown",
			Del: "Delete",
			Win: "OS",
			Menu: "ContextMenu",
			Apps: "ContextMenu",
			Scroll: "ScrollLock",
			MozPrintableKey: "Unidentified"
		},
		_o = {
			8: "Backspace",
			9: "Tab",
			12: "Clear",
			13: "Enter",
			16: "Shift",
			17: "Control",
			18: "Alt",
			19: "Pause",
			20: "CapsLock",
			27: "Escape",
			32: " ",
			33: "PageUp",
			34: "PageDown",
			35: "End",
			36: "Home",
			37: "ArrowLeft",
			38: "ArrowUp",
			39: "ArrowRight",
			40: "ArrowDown",
			45: "Insert",
			46: "Delete",
			112: "F1",
			113: "F2",
			114: "F3",
			115: "F4",
			116: "F5",
			117: "F6",
			118: "F7",
			119: "F8",
			120: "F9",
			121: "F10",
			122: "F11",
			123: "F12",
			144: "NumLock",
			145: "ScrollLock",
			224: "Meta"
		},
		Ao = {
			Alt: "altKey",
			Control: "ctrlKey",
			Meta: "metaKey",
			Shift: "shiftKey"
		};

	function su(t) {
		var e = this.nativeEvent;
		return e.getModifierState ? e.getModifierState(t) : (t = Ao[t]) ? !!e[t] : !1
	}

	function hu() {
		return su
	}
	var So = it({}, Ji, {
			key: function(t) {
				if (t.key) {
					var e = fu[t.key] || t.key;
					if (e !== "Unidentified") return e
				}
				return t.type === "keypress" ? (t = mi(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? _o[t.keyCode] || "Unidentified" : ""
			},
			code: 0,
			location: 0,
			ctrlKey: 0,
			shiftKey: 0,
			altKey: 0,
			metaKey: 0,
			repeat: 0,
			locale: 0,
			getModifierState: hu,
			charCode: function(t) {
				return t.type === "keypress" ? mi(t) : 0
			},
			keyCode: function(t) {
				return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0
			},
			which: function(t) {
				return t.type === "keypress" ? mi(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0
			}
		}),
		cr = Sn(So),
		wo = it({}, Wi, {
			pointerId: 0,
			width: 0,
			height: 0,
			pressure: 0,
			tangentialPressure: 0,
			tiltX: 0,
			tiltY: 0,
			twist: 0,
			pointerType: 0,
			isPrimary: 0
		}),
		fr = Sn(wo),
		Eo = it({}, Ji, {
			touches: 0,
			targetTouches: 0,
			changedTouches: 0,
			altKey: 0,
			metaKey: 0,
			ctrlKey: 0,
			shiftKey: 0,
			getModifierState: hu
		}),
		Mo = Sn(Eo),
		To = it({}, na, {
			propertyName: 0,
			elapsedTime: 0,
			pseudoElement: 0
		}),
		Co = Sn(To),
		sr = it({}, Wi, {
			deltaX: function(t) {
				return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0
			},
			deltaY: function(t) {
				return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0
			},
			deltaZ: 0,
			deltaMode: 0
		}),
		Oo = Sn(sr),
		du = it({}, na, {
			newState: 0,
			oldState: 0
		}),
		vu = Sn(du),
		Ro = [9, 13, 27, 32],
		mu = An && "CompositionEvent" in window,
		Ii = null;
	An && "documentMode" in document && (Ii = document.documentMode);
	var pu = An && "TextEvent" in window && !Ii,
		Ol = An && (!mu || Ii && 8 < Ii && 11 >= Ii),
		yu = " ",
		Rl = !1;

	function ki(t, e) {
		switch (t) {
			case "keyup":
				return Ro.indexOf(e.keyCode) !== -1;
			case "keydown":
				return e.keyCode !== 229;
			case "keypress":
			case "mousedown":
			case "focusout":
				return !0;
			default:
				return !1
		}
	}

	function gu(t) {
		return t = t.detail, typeof t == "object" && "data" in t ? t.data : null
	}
	var Ba = !1;

	function zo(t, e) {
		switch (t) {
			case "compositionend":
				return gu(e);
			case "keypress":
				return e.which !== 32 ? null : (Rl = !0, yu);
			case "textInput":
				return t = e.data, t === yu && Rl ? null : t;
			default:
				return null
		}
	}

	function hr(t, e) {
		if (Ba) return t === "compositionend" || !mu && ki(t, e) ? (t = Ki(), vi = Un = Ea = null, Ba = !1, t) : null;
		switch (t) {
			case "paste":
				return null;
			case "keypress":
				if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
					if (e.char && 1 < e.char.length) return e.char;
					if (e.which) return String.fromCharCode(e.which)
				}
				return null;
			case "compositionend":
				return Ol && e.locale !== "ko" ? null : e.data;
			default:
				return null
		}
	}
	var zl = {
		color: !0,
		date: !0,
		datetime: !0,
		"datetime-local": !0,
		email: !0,
		month: !0,
		number: !0,
		password: !0,
		range: !0,
		search: !0,
		tel: !0,
		text: !0,
		time: !0,
		url: !0,
		week: !0
	};

	function bu(t) {
		var e = t && t.nodeName && t.nodeName.toLowerCase();
		return e === "input" ? !!zl[t.type] : e === "textarea"
	}

	function He(t, e, n, a) {
		ea ? da ? da.push(a) : da = [a] : ea = a, e = kr(e, "onChange"), 0 < e.length && (n = new wl("onChange", "change", null, n, a), t.push({
			event: n,
			listeners: e
		}))
	}
	var Mn = null,
		Ha = null;

	function dr(t) {
		Gh(t, 0)
	}

	function $i(t) {
		var e = Gi(t);
		if (kn(e)) return t
	}

	function _u(t, e) {
		if (t === "change") return e
	}
	var Au = !1;
	if (An) {
		var gi;
		if (An) {
			var Dl = "oninput" in document;
			if (!Dl) {
				var l = document.createElement("div");
				l.setAttribute("oninput", "return;"), Dl = typeof l.oninput == "function"
			}
			gi = Dl
		} else gi = !1;
		Au = gi && (!document.documentMode || 9 < document.documentMode)
	}

	function u() {
		Mn && (Mn.detachEvent("onpropertychange", c), Ha = Mn = null)
	}

	function c(t) {
		if (t.propertyName === "value" && $i(Ha)) {
			var e = [];
			He(e, Ha, t, uu(t)), hi(dr, e)
		}
	}

	function h(t, e, n) {
		t === "focusin" ? (u(), Mn = e, Ha = n, Mn.attachEvent("onpropertychange", c)) : t === "focusout" && u()
	}

	function m(t) {
		if (t === "selectionchange" || t === "keyup" || t === "keydown") return $i(Ha)
	}

	function g(t, e) {
		if (t === "click") return $i(e)
	}

	function w(t, e) {
		if (t === "input" || t === "change") return $i(e)
	}

	function T(t, e) {
		return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e
	}
	var N = typeof Object.is == "function" ? Object.is : T;

	function U(t, e) {
		if (N(t, e)) return !0;
		if (typeof t != "object" || t === null || typeof e != "object" || e === null) return !1;
		var n = Object.keys(t),
			a = Object.keys(e);
		if (n.length !== a.length) return !1;
		for (a = 0; a < n.length; a++) {
			var i = n[a];
			if (!qt.call(e, i) || !N(t[i], e[i])) return !1
		}
		return !0
	}

	function nt(t) {
		for (; t && t.firstChild;) t = t.firstChild;
		return t
	}

	function ht(t, e) {
		var n = nt(t);
		t = 0;
		for (var a; n;) {
			if (n.nodeType === 3) {
				if (a = t + n.textContent.length, t <= e && a >= e) return {
					node: n,
					offset: e - t
				};
				t = a
			}
			t: {
				for (; n;) {
					if (n.nextSibling) {
						n = n.nextSibling;
						break t
					}
					n = n.parentNode
				}
				n = void 0
			}
			n = nt(n)
		}
	}

	function _t(t, e) {
		return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? _t(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1
	}

	function C(t) {
		t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
		for (var e = jt(t.document); e instanceof t.HTMLIFrameElement;) {
			try {
				var n = typeof e.contentWindow.location.href == "string"
			} catch {
				n = !1
			}
			if (n) t = e.contentWindow;
			else break;
			e = jt(t.document)
		}
		return e
	}

	function lt(t) {
		var e = t && t.nodeName && t.nodeName.toLowerCase();
		return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true")
	}
	var pt = An && "documentMode" in document && 11 >= document.documentMode,
		ut = null,
		me = null,
		dt = null,
		kt = !1;

	function we(t, e, n) {
		var a = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
		kt || ut == null || ut !== jt(a) || (a = ut, "selectionStart" in a && lt(a) ? a = {
			start: a.selectionStart,
			end: a.selectionEnd
		} : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
			anchorNode: a.anchorNode,
			anchorOffset: a.anchorOffset,
			focusNode: a.focusNode,
			focusOffset: a.focusOffset
		}), dt && U(dt, a) || (dt = a, a = kr(me, "onSelect"), 0 < a.length && (e = new wl("onSelect", "select", null, e, n), t.push({
			event: e,
			listeners: a
		}), e.target = ut)))
	}

	function Ke(t, e) {
		var n = {};
		return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n
	}
	var jn = {
			animationend: Ke("Animation", "AnimationEnd"),
			animationiteration: Ke("Animation", "AnimationIteration"),
			animationstart: Ke("Animation", "AnimationStart"),
			transitionrun: Ke("Transition", "TransitionRun"),
			transitionstart: Ke("Transition", "TransitionStart"),
			transitioncancel: Ke("Transition", "TransitionCancel"),
			transitionend: Ke("Transition", "TransitionEnd")
		},
		ne = {},
		Yn = {};
	An && (Yn = document.createElement("div").style, "AnimationEvent" in window || (delete jn.animationend.animation, delete jn.animationiteration.animation, delete jn.animationstart.animation), "TransitionEvent" in window || delete jn.transitionend.transition);

	function Va(t) {
		if (ne[t]) return ne[t];
		if (!jn[t]) return t;
		var e = jn[t],
			n;
		for (n in e)
			if (e.hasOwnProperty(n) && n in Yn) return ne[t] = e[n];
		return t
	}
	var $ = Va("animationend"),
		st = Va("animationiteration"),
		$t = Va("animationstart"),
		oe = Va("transitionrun"),
		Ft = Va("transitionstart"),
		ie = Va("transitioncancel"),
		he = Va("transitionend"),
		de = new Map,
		Tn = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
	Tn.push("scrollEnd");

	function Ee(t, e) {
		de.set(t, e), In(e, [t])
	}
	var dn = typeof reportError == "function" ? reportError : function(t) {
			if (typeof window == "object" && typeof window.ErrorEvent == "function") {
				var e = new window.ErrorEvent("error", {
					bubbles: !0,
					cancelable: !0,
					message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
					error: t
				});
				if (!window.dispatchEvent(e)) return
			} else if (typeof process == "object" && typeof process.emit == "function") {
				process.emit("uncaughtException", t);
				return
			}
			console.error(t)
		},
		ge = [],
		xa = 0,
		Ul = 0;

	function Ta() {
		for (var t = xa, e = Ul = xa = 0; e < t;) {
			var n = ge[e];
			ge[e++] = null;
			var a = ge[e];
			ge[e++] = null;
			var i = ge[e];
			ge[e++] = null;
			var r = ge[e];
			if (ge[e++] = null, a !== null && i !== null) {
				var s = a.pending;
				s === null ? i.next = i : (i.next = s.next, s.next = i), a.pending = i
			}
			r !== 0 && Su(n, i, r)
		}
	}

	function Ca(t, e, n, a) {
		ge[xa++] = t, ge[xa++] = e, ge[xa++] = n, ge[xa++] = a, Ul |= a, t.lanes |= a, t = t.alternate, t !== null && (t.lanes |= a)
	}

	function pa(t, e, n, a) {
		return Ca(t, e, n, a), Pi(t)
	}

	function Cn(t, e) {
		return Ca(t, null, null, e), Pi(t)
	}

	function Su(t, e, n) {
		t.lanes |= n;
		var a = t.alternate;
		a !== null && (a.lanes |= n);
		for (var i = !1, r = t.return; r !== null;) r.childLanes |= n, a = r.alternate, a !== null && (a.childLanes |= n), r.tag === 22 && (t = r.stateNode, t === null || t._visibility & 1 || (i = !0)), t = r, r = r.return;
		return t.tag === 3 ? (r = t.stateNode, i && e !== null && (i = 31 - Tt(n), t = r.hiddenUpdates, a = t[i], a === null ? t[i] = [e] : a.push(e), e.lane = n | 536870912), r) : null
	}

	function Pi(t) {
		if (50 < Qu) throw Qu = 0, Yc = null, Error(B(185));
		for (var e = t.return; e !== null;) t = e, e = t.return;
		return t.tag === 3 ? t.stateNode : null
	}
	var Xn = {};

	function Do(t, e, n, a) {
		this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null
	}

	function wn(t, e, n, a) {
		return new Do(t, e, n, a)
	}

	function Uo(t) {
		return t = t.prototype, !(!t || !t.isReactComponent)
	}

	function Ya(t, e) {
		var n = t.alternate;
		return n === null ? (n = wn(t.tag, e, t.key, t.mode), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 65011712, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : {
			lanes: e.lanes,
			firstContext: e.firstContext
		}, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n.refCleanup = t.refCleanup, n
	}

	function Ef(t, e) {
		t.flags &= 65011714;
		var n = t.alternate;
		return n === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = n.childLanes, t.lanes = n.lanes, t.child = n.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = n.memoizedProps, t.memoizedState = n.memoizedState, t.updateQueue = n.updateQueue, t.type = n.type, e = n.dependencies, t.dependencies = e === null ? null : {
			lanes: e.lanes,
			firstContext: e.firstContext
		}), t
	}

	function vr(t, e, n, a, i, r) {
		var s = 0;
		if (a = t, typeof t == "function") Uo(t) && (s = 1);
		else if (typeof t == "string") s = Gv(t, n, W.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
		else t: switch (t) {
			case ct:
				return t = wn(31, n, e, i), t.elementType = ct, t.lanes = r, t;
			case Pt:
				return tl(n.children, i, r, e);
			case re:
				s = 8, i |= 24;
				break;
			case xt:
				return t = wn(12, n, e, i | 2), t.elementType = xt, t.lanes = r, t;
			case It:
				return t = wn(13, n, e, i), t.elementType = It, t.lanes = r, t;
			case ae:
				return t = wn(19, n, e, i), t.elementType = ae, t.lanes = r, t;
			default:
				if (typeof t == "object" && t !== null) switch (t.$$typeof) {
					case Gt:
						s = 10;
						break t;
					case Yt:
						s = 9;
						break t;
					case Dt:
						s = 11;
						break t;
					case Ut:
						s = 14;
						break t;
					case Me:
						s = 16, a = null;
						break t
				}
				s = 29, n = Error(B(130, t === null ? "null" : typeof t, "")), a = null
		}
		return e = wn(s, n, e, i), e.elementType = t, e.type = a, e.lanes = r, e
	}

	function tl(t, e, n, a) {
		return t = wn(7, t, a, e), t.lanes = n, t
	}

	function jo(t, e, n) {
		return t = wn(6, t, null, e), t.lanes = n, t
	}

	function Mf(t) {
		var e = wn(18, null, null, 0);
		return e.stateNode = t, e
	}

	function Lo(t, e, n) {
		return e = wn(4, t.children !== null ? t.children : [], t.key, e), e.lanes = n, e.stateNode = {
			containerInfo: t.containerInfo,
			pendingChildren: null,
			implementation: t.implementation
		}, e
	}
	var Tf = new WeakMap;

	function aa(t, e) {
		if (typeof t == "object" && t !== null) {
			var n = Tf.get(t);
			return n !== void 0 ? n : (e = {
				value: t,
				source: e,
				stack: Oe(e)
			}, Tf.set(t, e), e)
		}
		return {
			value: t,
			source: e,
			stack: Oe(e)
		}
	}
	var jl = [],
		Ll = 0,
		mr = null,
		wu = 0,
		ia = [],
		la = 0,
		bi = null,
		Oa = 1,
		Ra = "";

	function Xa(t, e) {
		jl[Ll++] = wu, jl[Ll++] = mr, mr = t, wu = e
	}

	function Cf(t, e, n) {
		ia[la++] = Oa, ia[la++] = Ra, ia[la++] = bi, bi = t;
		var a = Oa;
		t = Ra;
		var i = 32 - Tt(a) - 1;
		a &= ~(1 << i), n += 1;
		var r = 32 - Tt(e) + i;
		if (30 < r) {
			var s = i - i % 5;
			r = (a & (1 << s) - 1).toString(32), a >>= s, i -= s, Oa = 1 << 32 - Tt(e) + i | n << i | a, Ra = r + t
		} else Oa = 1 << r | n << i | a, Ra = t
	}

	function No(t) {
		t.return !== null && (Xa(t, 1), Cf(t, 1, 0))
	}

	function Bo(t) {
		for (; t === mr;) mr = jl[--Ll], jl[Ll] = null, wu = jl[--Ll], jl[Ll] = null;
		for (; t === bi;) bi = ia[--la], ia[la] = null, Ra = ia[--la], ia[la] = null, Oa = ia[--la], ia[la] = null
	}

	function Of(t, e) {
		ia[la++] = Oa, ia[la++] = Ra, ia[la++] = bi, Oa = e.id, Ra = e.overflow, bi = t
	}
	var vn = null,
		Ve = null,
		se = !1,
		_i = null,
		ua = !1,
		Ho = Error(B(519));

	function Ai(t) {
		var e = Error(B(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
		throw Eu(aa(e, t)), Ho
	}

	function Rf(t) {
		var e = t.stateNode,
			n = t.type,
			a = t.memoizedProps;
		switch (e[Be] = t, e[sn] = a, n) {
			case "dialog":
				ue("cancel", e), ue("close", e);
				break;
			case "iframe":
			case "object":
			case "embed":
				ue("load", e);
				break;
			case "video":
			case "audio":
				for (n = 0; n < Fu.length; n++) ue(Fu[n], e);
				break;
			case "source":
				ue("error", e);
				break;
			case "img":
			case "image":
			case "link":
				ue("error", e), ue("load", e);
				break;
			case "details":
				ue("toggle", e);
				break;
			case "input":
				ue("invalid", e), lu(e, a.value, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name, !0);
				break;
			case "select":
				ue("invalid", e);
				break;
			case "textarea":
				ue("invalid", e), gl(e, a.value, a.defaultValue, a.children)
		}
		n = a.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || e.textContent === "" + n || a.suppressHydrationWarning === !0 || Fh(e.textContent, n) ? (a.popover != null && (ue("beforetoggle", e), ue("toggle", e)), a.onScroll != null && ue("scroll", e), a.onScrollEnd != null && ue("scrollend", e), a.onClick != null && (e.onclick = ta), e = !0) : e = !1, e || Ai(t, !0)
	}

	function zf(t) {
		for (vn = t.return; vn;) switch (vn.tag) {
			case 5:
			case 31:
			case 13:
				ua = !1;
				return;
			case 27:
			case 3:
				ua = !0;
				return;
			default:
				vn = vn.return
		}
	}

	function Nl(t) {
		if (t !== vn) return !1;
		if (!se) return zf(t), se = !0, !1;
		var e = t.tag,
			n;
		if ((n = e !== 3 && e !== 27) && ((n = e === 5) && (n = t.type, n = !(n !== "form" && n !== "button") || ef(t.type, t.memoizedProps)), n = !n), n && Ve && Ai(t), zf(t), e === 13) {
			if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(B(317));
			Ve = ed(t)
		} else if (e === 31) {
			if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(B(317));
			Ve = ed(t)
		} else e === 27 ? (e = Ve, Ni(t.type) ? (t = rf, rf = null, Ve = t) : Ve = e) : Ve = vn ? oa(t.stateNode.nextSibling) : null;
		return !0
	}

	function el() {
		Ve = vn = null, se = !1
	}

	function Vo() {
		var t = _i;
		return t !== null && (Hn === null ? Hn = t : Hn.push.apply(Hn, t), _i = null), t
	}

	function Eu(t) {
		_i === null ? _i = [t] : _i.push(t)
	}
	var xo = y(null),
		nl = null,
		Ga = null;

	function Si(t, e, n) {
		k(xo, e._currentValue), e._currentValue = n
	}

	function qa(t) {
		t._currentValue = xo.current, L(xo)
	}

	function Yo(t, e, n) {
		for (; t !== null;) {
			var a = t.alternate;
			if ((t.childLanes & e) !== e ? (t.childLanes |= e, a !== null && (a.childLanes |= e)) : a !== null && (a.childLanes & e) !== e && (a.childLanes |= e), t === n) break;
			t = t.return
		}
	}

	function Xo(t, e, n, a) {
		var i = t.child;
		for (i !== null && (i.return = t); i !== null;) {
			var r = i.dependencies;
			if (r !== null) {
				var s = i.child;
				r = r.firstContext;
				t: for (; r !== null;) {
					var v = r;
					r = i;
					for (var b = 0; b < e.length; b++)
						if (v.context === e[b]) {
							r.lanes |= n, v = r.alternate, v !== null && (v.lanes |= n), Yo(r.return, n, t), a || (s = null);
							break t
						} r = v.next
				}
			} else if (i.tag === 18) {
				if (s = i.return, s === null) throw Error(B(341));
				s.lanes |= n, r = s.alternate, r !== null && (r.lanes |= n), Yo(s, n, t), s = null
			} else s = i.child;
			if (s !== null) s.return = i;
			else
				for (s = i; s !== null;) {
					if (s === t) {
						s = null;
						break
					}
					if (i = s.sibling, i !== null) {
						i.return = s.return, s = i;
						break
					}
					s = s.return
				}
			i = s
		}
	}

	function Bl(t, e, n, a) {
		t = null;
		for (var i = e, r = !1; i !== null;) {
			if (!r) {
				if ((i.flags & 524288) !== 0) r = !0;
				else if ((i.flags & 262144) !== 0) break
			}
			if (i.tag === 10) {
				var s = i.alternate;
				if (s === null) throw Error(B(387));
				if (s = s.memoizedProps, s !== null) {
					var v = i.type;
					N(i.pendingProps.value, s.value) || (t !== null ? t.push(v) : t = [v])
				}
			} else if (i === zt.current) {
				if (s = i.alternate, s === null) throw Error(B(387));
				s.memoizedState.memoizedState !== i.memoizedState.memoizedState && (t !== null ? t.push(ku) : t = [ku])
			}
			i = i.return
		}
		t !== null && Xo(e, t, n, a), e.flags |= 262144
	}

	function pr(t) {
		for (t = t.firstContext; t !== null;) {
			if (!N(t.context._currentValue, t.memoizedValue)) return !0;
			t = t.next
		}
		return !1
	}

	function al(t) {
		nl = t, Ga = null, t = t.dependencies, t !== null && (t.firstContext = null)
	}

	function mn(t) {
		return Df(nl, t)
	}

	function yr(t, e) {
		return nl === null && al(t), Df(t, e)
	}

	function Df(t, e) {
		var n = e._currentValue;
		if (e = {
				context: e,
				memoizedValue: n,
				next: null
			}, Ga === null) {
			if (t === null) throw Error(B(308));
			Ga = e, t.dependencies = {
				lanes: 0,
				firstContext: e
			}, t.flags |= 524288
		} else Ga = Ga.next = e;
		return n
	}
	var Vd = typeof AbortController < "u" ? AbortController : function() {
			var t = [],
				e = this.signal = {
					aborted: !1,
					addEventListener: function(n, a) {
						t.push(a)
					}
				};
			this.abort = function() {
				e.aborted = !0, t.forEach(function(n) {
					return n()
				})
			}
		},
		xd = rt.unstable_scheduleCallback,
		Yd = rt.unstable_NormalPriority,
		Ie = {
			$$typeof: Gt,
			Consumer: null,
			Provider: null,
			_currentValue: null,
			_currentValue2: null,
			_threadCount: 0
		};

	function Go() {
		return {
			controller: new Vd,
			data: new Map,
			refCount: 0
		}
	}

	function Mu(t) {
		t.refCount--, t.refCount === 0 && xd(Yd, function() {
			t.controller.abort()
		})
	}
	var Tu = null,
		qo = 0,
		Hl = 0,
		Vl = null;

	function Xd(t, e) {
		if (Tu === null) {
			var n = Tu = [];
			qo = 0, Hl = Fc(), Vl = {
				status: "pending",
				value: void 0,
				then: function(a) {
					n.push(a)
				}
			}
		}
		return qo++, e.then(Uf, Uf), e
	}

	function Uf() {
		if (--qo === 0 && Tu !== null) {
			Vl !== null && (Vl.status = "fulfilled");
			var t = Tu;
			Tu = null, Hl = 0, Vl = null;
			for (var e = 0; e < t.length; e++)(0, t[e])()
		}
	}

	function Gd(t, e) {
		var n = [],
			a = {
				status: "pending",
				value: null,
				reason: null,
				then: function(i) {
					n.push(i)
				}
			};
		return t.then(function() {
			a.status = "fulfilled", a.value = e;
			for (var i = 0; i < n.length; i++)(0, n[i])(e)
		}, function(i) {
			for (a.status = "rejected", a.reason = i, i = 0; i < n.length; i++)(0, n[i])(void 0)
		}), a
	}
	var jf = _.S;
	_.S = function(t, e) {
		ph = Ae(), typeof e == "object" && e !== null && typeof e.then == "function" && Xd(t, e), jf !== null && jf(t, e)
	};
	var il = y(null);

	function Qo() {
		var t = il.current;
		return t !== null ? t : je.pooledCache
	}

	function gr(t, e) {
		e === null ? k(il, il.current) : k(il, e.pool)
	}

	function Lf() {
		var t = Qo();
		return t === null ? null : {
			parent: Ie._currentValue,
			pool: t
		}
	}
	var xl = Error(B(460)),
		Zo = Error(B(474)),
		br = Error(B(542)),
		_r = {
			then: function() {}
		};

	function Nf(t) {
		return t = t.status, t === "fulfilled" || t === "rejected"
	}

	function Bf(t, e, n) {
		switch (n = t[n], n === void 0 ? t.push(e) : n !== e && (e.then(ta, ta), e = n), e.status) {
			case "fulfilled":
				return e.value;
			case "rejected":
				throw t = e.reason, Vf(t), t;
			default:
				if (typeof e.status == "string") e.then(ta, ta);
				else {
					if (t = je, t !== null && 100 < t.shellSuspendCounter) throw Error(B(482));
					t = e, t.status = "pending", t.then(function(a) {
						if (e.status === "pending") {
							var i = e;
							i.status = "fulfilled", i.value = a
						}
					}, function(a) {
						if (e.status === "pending") {
							var i = e;
							i.status = "rejected", i.reason = a
						}
					})
				}
				switch (e.status) {
					case "fulfilled":
						return e.value;
					case "rejected":
						throw t = e.reason, Vf(t), t
				}
				throw ul = e, xl
		}
	}

	function ll(t) {
		try {
			var e = t._init;
			return e(t._payload)
		} catch (n) {
			throw n !== null && typeof n == "object" && typeof n.then == "function" ? (ul = n, xl) : n
		}
	}
	var ul = null;

	function Hf() {
		if (ul === null) throw Error(B(459));
		var t = ul;
		return ul = null, t
	}

	function Vf(t) {
		if (t === xl || t === br) throw Error(B(483))
	}
	var Yl = null,
		Cu = 0;

	function Ar(t) {
		var e = Cu;
		return Cu += 1, Yl === null && (Yl = []), Bf(Yl, t, e)
	}

	function Ou(t, e) {
		e = e.props.ref, t.ref = e !== void 0 ? e : null
	}

	function Sr(t, e) {
		throw e.$$typeof === ot ? Error(B(525)) : (t = Object.prototype.toString.call(e), Error(B(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t)))
	}

	function xf(t) {
		function e(O, A) {
			if (t) {
				var D = O.deletions;
				D === null ? (O.deletions = [A], O.flags |= 16) : D.push(A)
			}
		}

		function n(O, A) {
			if (!t) return null;
			for (; A !== null;) e(O, A), A = A.sibling;
			return null
		}

		function a(O) {
			for (var A = new Map; O !== null;) O.key !== null ? A.set(O.key, O) : A.set(O.index, O), O = O.sibling;
			return A
		}

		function i(O, A) {
			return O = Ya(O, A), O.index = 0, O.sibling = null, O
		}

		function r(O, A, D) {
			return O.index = D, t ? (D = O.alternate, D !== null ? (D = D.index, D < A ? (O.flags |= 67108866, A) : D) : (O.flags |= 67108866, A)) : (O.flags |= 1048576, A)
		}

		function s(O) {
			return t && O.alternate === null && (O.flags |= 67108866), O
		}

		function v(O, A, D, F) {
			return A === null || A.tag !== 6 ? (A = jo(D, O.mode, F), A.return = O, A) : (A = i(A, D), A.return = O, A)
		}

		function b(O, A, D, F) {
			var Ot = D.type;
			return Ot === Pt ? Q(O, A, D.props.children, F, D.key) : A !== null && (A.elementType === Ot || typeof Ot == "object" && Ot !== null && Ot.$$typeof === Me && ll(Ot) === A.type) ? (A = i(A, D.props), Ou(A, D), A.return = O, A) : (A = vr(D.type, D.key, D.props, null, O.mode, F), Ou(A, D), A.return = O, A)
		}

		function j(O, A, D, F) {
			return A === null || A.tag !== 4 || A.stateNode.containerInfo !== D.containerInfo || A.stateNode.implementation !== D.implementation ? (A = Lo(D, O.mode, F), A.return = O, A) : (A = i(A, D.children || []), A.return = O, A)
		}

		function Q(O, A, D, F, Ot) {
			return A === null || A.tag !== 7 ? (A = tl(D, O.mode, F, Ot), A.return = O, A) : (A = i(A, D), A.return = O, A)
		}

		function J(O, A, D) {
			if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint") return A = jo("" + A, O.mode, D), A.return = O, A;
			if (typeof A == "object" && A !== null) {
				switch (A.$$typeof) {
					case yt:
						return D = vr(A.type, A.key, A.props, null, O.mode, D), Ou(D, A), D.return = O, D;
					case S:
						return A = Lo(A, O.mode, D), A.return = O, A;
					case Me:
						return A = ll(A), J(O, A, D)
				}
				if (x(A) || Z(A)) return A = tl(A, O.mode, D, null), A.return = O, A;
				if (typeof A.then == "function") return J(O, Ar(A), D);
				if (A.$$typeof === Gt) return J(O, yr(O, A), D);
				Sr(O, A)
			}
			return null
		}

		function H(O, A, D, F) {
			var Ot = A !== null ? A.key : null;
			if (typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint") return Ot !== null ? null : v(O, A, "" + D, F);
			if (typeof D == "object" && D !== null) {
				switch (D.$$typeof) {
					case yt:
						return D.key === Ot ? b(O, A, D, F) : null;
					case S:
						return D.key === Ot ? j(O, A, D, F) : null;
					case Me:
						return D = ll(D), H(O, A, D, F)
				}
				if (x(D) || Z(D)) return Ot !== null ? null : Q(O, A, D, F, null);
				if (typeof D.then == "function") return H(O, A, Ar(D), F);
				if (D.$$typeof === Gt) return H(O, A, yr(O, D), F);
				Sr(O, D)
			}
			return null
		}

		function X(O, A, D, F, Ot) {
			if (typeof F == "string" && F !== "" || typeof F == "number" || typeof F == "bigint") return O = O.get(D) || null, v(A, O, "" + F, Ot);
			if (typeof F == "object" && F !== null) {
				switch (F.$$typeof) {
					case yt:
						return O = O.get(F.key === null ? D : F.key) || null, b(A, O, F, Ot);
					case S:
						return O = O.get(F.key === null ? D : F.key) || null, j(A, O, F, Ot);
					case Me:
						return F = ll(F), X(O, A, D, F, Ot)
				}
				if (x(F) || Z(F)) return O = O.get(D) || null, Q(A, O, F, Ot, null);
				if (typeof F.then == "function") return X(O, A, D, Ar(F), Ot);
				if (F.$$typeof === Gt) return X(O, A, D, yr(A, F), Ot);
				Sr(A, F)
			}
			return null
		}

		function At(O, A, D, F) {
			for (var Ot = null, pe = null, wt = A, Wt = A = 0, fe = null; wt !== null && Wt < D.length; Wt++) {
				wt.index > Wt ? (fe = wt, wt = null) : fe = wt.sibling;
				var ye = H(O, wt, D[Wt], F);
				if (ye === null) {
					wt === null && (wt = fe);
					break
				}
				t && wt && ye.alternate === null && e(O, wt), A = r(ye, A, Wt), pe === null ? Ot = ye : pe.sibling = ye, pe = ye, wt = fe
			}
			if (Wt === D.length) return n(O, wt), se && Xa(O, Wt), Ot;
			if (wt === null) {
				for (; Wt < D.length; Wt++) wt = J(O, D[Wt], F), wt !== null && (A = r(wt, A, Wt), pe === null ? Ot = wt : pe.sibling = wt, pe = wt);
				return se && Xa(O, Wt), Ot
			}
			for (wt = a(wt); Wt < D.length; Wt++) fe = X(wt, O, Wt, D[Wt], F), fe !== null && (t && fe.alternate !== null && wt.delete(fe.key === null ? Wt : fe.key), A = r(fe, A, Wt), pe === null ? Ot = fe : pe.sibling = fe, pe = fe);
			return t && wt.forEach(function(Yi) {
				return e(O, Yi)
			}), se && Xa(O, Wt), Ot
		}

		function Lt(O, A, D, F) {
			if (D == null) throw Error(B(151));
			for (var Ot = null, pe = null, wt = A, Wt = A = 0, fe = null, ye = D.next(); wt !== null && !ye.done; Wt++, ye = D.next()) {
				wt.index > Wt ? (fe = wt, wt = null) : fe = wt.sibling;
				var Yi = H(O, wt, ye.value, F);
				if (Yi === null) {
					wt === null && (wt = fe);
					break
				}
				t && wt && Yi.alternate === null && e(O, wt), A = r(Yi, A, Wt), pe === null ? Ot = Yi : pe.sibling = Yi, pe = Yi, wt = fe
			}
			if (ye.done) return n(O, wt), se && Xa(O, Wt), Ot;
			if (wt === null) {
				for (; !ye.done; Wt++, ye = D.next()) ye = J(O, ye.value, F), ye !== null && (A = r(ye, A, Wt), pe === null ? Ot = ye : pe.sibling = ye, pe = ye);
				return se && Xa(O, Wt), Ot
			}
			for (wt = a(wt); !ye.done; Wt++, ye = D.next()) ye = X(wt, O, Wt, ye.value, F), ye !== null && (t && ye.alternate !== null && wt.delete(ye.key === null ? Wt : ye.key), A = r(ye, A, Wt), pe === null ? Ot = ye : pe.sibling = ye, pe = ye);
			return t && wt.forEach(function(Pv) {
				return e(O, Pv)
			}), se && Xa(O, Wt), Ot
		}

		function Ue(O, A, D, F) {
			if (typeof D == "object" && D !== null && D.type === Pt && D.key === null && (D = D.props.children), typeof D == "object" && D !== null) {
				switch (D.$$typeof) {
					case yt:
						t: {
							for (var Ot = D.key; A !== null;) {
								if (A.key === Ot) {
									if (Ot = D.type, Ot === Pt) {
										if (A.tag === 7) {
											n(O, A.sibling), F = i(A, D.props.children), F.return = O, O = F;
											break t
										}
									} else if (A.elementType === Ot || typeof Ot == "object" && Ot !== null && Ot.$$typeof === Me && ll(Ot) === A.type) {
										n(O, A.sibling), F = i(A, D.props), Ou(F, D), F.return = O, O = F;
										break t
									}
									n(O, A);
									break
								} else e(O, A);
								A = A.sibling
							}
							D.type === Pt ? (F = tl(D.props.children, O.mode, F, D.key), F.return = O, O = F) : (F = vr(D.type, D.key, D.props, null, O.mode, F), Ou(F, D), F.return = O, O = F)
						}
						return s(O);
					case S:
						t: {
							for (Ot = D.key; A !== null;) {
								if (A.key === Ot)
									if (A.tag === 4 && A.stateNode.containerInfo === D.containerInfo && A.stateNode.implementation === D.implementation) {
										n(O, A.sibling), F = i(A, D.children || []), F.return = O, O = F;
										break t
									} else {
										n(O, A);
										break
									}
								else e(O, A);
								A = A.sibling
							}
							F = Lo(D, O.mode, F),
							F.return = O,
							O = F
						}
						return s(O);
					case Me:
						return D = ll(D), Ue(O, A, D, F)
				}
				if (x(D)) return At(O, A, D, F);
				if (Z(D)) {
					if (Ot = Z(D), typeof Ot != "function") throw Error(B(150));
					return D = Ot.call(D), Lt(O, A, D, F)
				}
				if (typeof D.then == "function") return Ue(O, A, Ar(D), F);
				if (D.$$typeof === Gt) return Ue(O, A, yr(O, D), F);
				Sr(O, D)
			}
			return typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint" ? (D = "" + D, A !== null && A.tag === 6 ? (n(O, A.sibling), F = i(A, D), F.return = O, O = F) : (n(O, A), F = jo(D, O.mode, F), F.return = O, O = F), s(O)) : n(O, A)
		}
		return function(O, A, D, F) {
			try {
				Cu = 0;
				var Ot = Ue(O, A, D, F);
				return Yl = null, Ot
			} catch (wt) {
				if (wt === xl || wt === br) throw wt;
				var pe = wn(29, wt, null, O.mode);
				return pe.lanes = F, pe.return = O, pe
			} finally {}
		}
	}
	var rl = xf(!0),
		Yf = xf(!1),
		wi = !1;

	function Fo(t) {
		t.updateQueue = {
			baseState: t.memoizedState,
			firstBaseUpdate: null,
			lastBaseUpdate: null,
			shared: {
				pending: null,
				lanes: 0,
				hiddenCallbacks: null
			},
			callbacks: null
		}
	}

	function Ko(t, e) {
		t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
			baseState: t.baseState,
			firstBaseUpdate: t.firstBaseUpdate,
			lastBaseUpdate: t.lastBaseUpdate,
			shared: t.shared,
			callbacks: null
		})
	}

	function Ei(t) {
		return {
			lane: t,
			tag: 0,
			payload: null,
			callback: null,
			next: null
		}
	}

	function Mi(t, e, n) {
		var a = t.updateQueue;
		if (a === null) return null;
		if (a = a.shared, (be & 2) !== 0) {
			var i = a.pending;
			return i === null ? e.next = e : (e.next = i.next, i.next = e), a.pending = e, e = Pi(t), Su(t, null, n), e
		}
		return Ca(t, a, e, n), Pi(t)
	}

	function Ru(t, e, n) {
		if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194048) !== 0)) {
			var a = e.lanes;
			a &= t.pendingLanes, n |= a, e.lanes = n, ar(t, n)
		}
	}

	function Jo(t, e) {
		var n = t.updateQueue,
			a = t.alternate;
		if (a !== null && (a = a.updateQueue, n === a)) {
			var i = null,
				r = null;
			if (n = n.firstBaseUpdate, n !== null) {
				do {
					var s = {
						lane: n.lane,
						tag: n.tag,
						payload: n.payload,
						callback: null,
						next: null
					};
					r === null ? i = r = s : r = r.next = s, n = n.next
				} while (n !== null);
				r === null ? i = r = e : r = r.next = e
			} else i = r = e;
			n = {
				baseState: a.baseState,
				firstBaseUpdate: i,
				lastBaseUpdate: r,
				shared: a.shared,
				callbacks: a.callbacks
			}, t.updateQueue = n;
			return
		}
		t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e
	}
	var Wo = !1;

	function zu() {
		if (Wo) {
			var t = Vl;
			if (t !== null) throw t
		}
	}

	function Du(t, e, n, a) {
		Wo = !1;
		var i = t.updateQueue;
		wi = !1;
		var r = i.firstBaseUpdate,
			s = i.lastBaseUpdate,
			v = i.shared.pending;
		if (v !== null) {
			i.shared.pending = null;
			var b = v,
				j = b.next;
			b.next = null, s === null ? r = j : s.next = j, s = b;
			var Q = t.alternate;
			Q !== null && (Q = Q.updateQueue, v = Q.lastBaseUpdate, v !== s && (v === null ? Q.firstBaseUpdate = j : v.next = j, Q.lastBaseUpdate = b))
		}
		if (r !== null) {
			var J = i.baseState;
			s = 0, Q = j = b = null, v = r;
			do {
				var H = v.lane & -536870913,
					X = H !== v.lane;
				if (X ? (ce & H) === H : (a & H) === H) {
					H !== 0 && H === Hl && (Wo = !0), Q !== null && (Q = Q.next = {
						lane: 0,
						tag: v.tag,
						payload: v.payload,
						callback: null,
						next: null
					});
					t: {
						var At = t,
							Lt = v;H = e;
						var Ue = n;
						switch (Lt.tag) {
							case 1:
								if (At = Lt.payload, typeof At == "function") {
									J = At.call(Ue, J, H);
									break t
								}
								J = At;
								break t;
							case 3:
								At.flags = At.flags & -65537 | 128;
							case 0:
								if (At = Lt.payload, H = typeof At == "function" ? At.call(Ue, J, H) : At, H == null) break t;
								J = it({}, J, H);
								break t;
							case 2:
								wi = !0
						}
					}
					H = v.callback, H !== null && (t.flags |= 64, X && (t.flags |= 8192), X = i.callbacks, X === null ? i.callbacks = [H] : X.push(H))
				} else X = {
					lane: H,
					tag: v.tag,
					payload: v.payload,
					callback: v.callback,
					next: null
				}, Q === null ? (j = Q = X, b = J) : Q = Q.next = X, s |= H;
				if (v = v.next, v === null) {
					if (v = i.shared.pending, v === null) break;
					X = v, v = X.next, X.next = null, i.lastBaseUpdate = X, i.shared.pending = null
				}
			} while (!0);
			Q === null && (b = J), i.baseState = b, i.firstBaseUpdate = j, i.lastBaseUpdate = Q, r === null && (i.shared.lanes = 0), zi |= s, t.lanes = s, t.memoizedState = J
		}
	}

	function Xf(t, e) {
		if (typeof t != "function") throw Error(B(191, t));
		t.call(e)
	}

	function Gf(t, e) {
		var n = t.callbacks;
		if (n !== null)
			for (t.callbacks = null, t = 0; t < n.length; t++) Xf(n[t], e)
	}
	var Xl = y(null),
		wr = y(0);

	function qf(t, e) {
		t = $a, k(wr, t), k(Xl, e), $a = t | e.baseLanes
	}

	function Io() {
		k(wr, $a), k(Xl, Xl.current)
	}

	function ko() {
		$a = wr.current, L(Xl), L(wr)
	}
	var Gn = y(null),
		ra = null;

	function Ti(t) {
		var e = t.alternate;
		k(Je, Je.current & 1), k(Gn, t), ra === null && (e === null || Xl.current !== null || e.memoizedState !== null) && (ra = t)
	}

	function $o(t) {
		k(Je, Je.current), k(Gn, t), ra === null && (ra = t)
	}

	function Qf(t) {
		t.tag === 22 ? (k(Je, Je.current), k(Gn, t), ra === null && (ra = t)) : Ci()
	}

	function Ci() {
		k(Je, Je.current), k(Gn, Gn.current)
	}

	function qn(t) {
		L(Gn), ra === t && (ra = null), L(Je)
	}
	var Je = y(0);

	function Er(t) {
		for (var e = t; e !== null;) {
			if (e.tag === 13) {
				var n = e.memoizedState;
				if (n !== null && (n = n.dehydrated, n === null || lf(n) || uf(n))) return e
			} else if (e.tag === 19 && (e.memoizedProps.revealOrder === "forwards" || e.memoizedProps.revealOrder === "backwards" || e.memoizedProps.revealOrder === "unstable_legacy-backwards" || e.memoizedProps.revealOrder === "together")) {
				if ((e.flags & 128) !== 0) return e
			} else if (e.child !== null) {
				e.child.return = e, e = e.child;
				continue
			}
			if (e === t) break;
			for (; e.sibling === null;) {
				if (e.return === null || e.return === t) return null;
				e = e.return
			}
			e.sibling.return = e.return, e = e.sibling
		}
		return null
	}
	var Qa = 0,
		Kt = null,
		ze = null,
		ke = null,
		Mr = !1,
		Gl = !1,
		ol = !1,
		Tr = 0,
		Uu = 0,
		ql = null,
		qd = 0;

	function Ge() {
		throw Error(B(321))
	}

	function Po(t, e) {
		if (e === null) return !1;
		for (var n = 0; n < e.length && n < t.length; n++)
			if (!N(t[n], e[n])) return !1;
		return !0
	}

	function tc(t, e, n, a, i, r) {
		return Qa = r, Kt = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, _.H = t === null || t.memoizedState === null ? Cs : mc, ol = !1, r = n(a, i), ol = !1, Gl && (r = Ff(e, n, a, i)), Zf(t), r
	}

	function Zf(t) {
		_.H = Nu;
		var e = ze !== null && ze.next !== null;
		if (Qa = 0, ke = ze = Kt = null, Mr = !1, Uu = 0, ql = null, e) throw Error(B(300));
		t === null || $e || (t = t.dependencies, t !== null && pr(t) && ($e = !0))
	}

	function Ff(t, e, n, a) {
		Kt = t;
		var i = 0;
		do {
			if (Gl && (ql = null), Uu = 0, Gl = !1, 25 <= i) throw Error(B(301));
			if (i += 1, ke = ze = null, t.updateQueue != null) {
				var r = t.updateQueue;
				r.lastEffect = null, r.events = null, r.stores = null, r.memoCache != null && (r.memoCache.index = 0)
			}
			_.H = Os, r = e(n, a)
		} while (Gl);
		return r
	}

	function Qd() {
		var t = _.H,
			e = t.useState()[0];
		return e = typeof e.then == "function" ? ju(e) : e, t = t.useState()[0], (ze !== null ? ze.memoizedState : null) !== t && (Kt.flags |= 1024), e
	}

	function ec() {
		var t = Tr !== 0;
		return Tr = 0, t
	}

	function nc(t, e, n) {
		e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~n
	}

	function ac(t) {
		if (Mr) {
			for (t = t.memoizedState; t !== null;) {
				var e = t.queue;
				e !== null && (e.pending = null), t = t.next
			}
			Mr = !1
		}
		Qa = 0, ke = ze = Kt = null, Gl = !1, Uu = Tr = 0, ql = null
	}

	function On() {
		var t = {
			memoizedState: null,
			baseState: null,
			baseQueue: null,
			queue: null,
			next: null
		};
		return ke === null ? Kt.memoizedState = ke = t : ke = ke.next = t, ke
	}

	function We() {
		if (ze === null) {
			var t = Kt.alternate;
			t = t !== null ? t.memoizedState : null
		} else t = ze.next;
		var e = ke === null ? Kt.memoizedState : ke.next;
		if (e !== null) ke = e, ze = t;
		else {
			if (t === null) throw Kt.alternate === null ? Error(B(467)) : Error(B(310));
			ze = t, t = {
				memoizedState: ze.memoizedState,
				baseState: ze.baseState,
				baseQueue: ze.baseQueue,
				queue: ze.queue,
				next: null
			}, ke === null ? Kt.memoizedState = ke = t : ke = ke.next = t
		}
		return ke
	}

	function Cr() {
		return {
			lastEffect: null,
			events: null,
			stores: null,
			memoCache: null
		}
	}

	function ju(t) {
		var e = Uu;
		return Uu += 1, ql === null && (ql = []), t = Bf(ql, t, e), e = Kt, (ke === null ? e.memoizedState : ke.next) === null && (e = e.alternate, _.H = e === null || e.memoizedState === null ? Cs : mc), t
	}

	function Or(t) {
		if (t !== null && typeof t == "object") {
			if (typeof t.then == "function") return ju(t);
			if (t.$$typeof === Gt) return mn(t)
		}
		throw Error(B(438, String(t)))
	}

	function ic(t) {
		var e = null,
			n = Kt.updateQueue;
		if (n !== null && (e = n.memoCache), e == null) {
			var a = Kt.alternate;
			a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (e = {
				data: a.data.map(function(i) {
					return i.slice()
				}),
				index: 0
			})))
		}
		if (e == null && (e = {
				data: [],
				index: 0
			}), n === null && (n = Cr(), Kt.updateQueue = n), n.memoCache = e, n = e.data[e.index], n === void 0)
			for (n = e.data[e.index] = Array(t), a = 0; a < t; a++) n[a] = ft;
		return e.index++, n
	}

	function Za(t, e) {
		return typeof e == "function" ? e(t) : e
	}

	function Rr(t) {
		var e = We();
		return lc(e, ze, t)
	}

	function lc(t, e, n) {
		var a = t.queue;
		if (a === null) throw Error(B(311));
		a.lastRenderedReducer = n;
		var i = t.baseQueue,
			r = a.pending;
		if (r !== null) {
			if (i !== null) {
				var s = i.next;
				i.next = r.next, r.next = s
			}
			e.baseQueue = i = r, a.pending = null
		}
		if (r = t.baseState, i === null) t.memoizedState = r;
		else {
			e = i.next;
			var v = s = null,
				b = null,
				j = e,
				Q = !1;
			do {
				var J = j.lane & -536870913;
				if (J !== j.lane ? (ce & J) === J : (Qa & J) === J) {
					var H = j.revertLane;
					if (H === 0) b !== null && (b = b.next = {
						lane: 0,
						revertLane: 0,
						gesture: null,
						action: j.action,
						hasEagerState: j.hasEagerState,
						eagerState: j.eagerState,
						next: null
					}), J === Hl && (Q = !0);
					else if ((Qa & H) === H) {
						j = j.next, H === Hl && (Q = !0);
						continue
					} else J = {
						lane: 0,
						revertLane: j.revertLane,
						gesture: null,
						action: j.action,
						hasEagerState: j.hasEagerState,
						eagerState: j.eagerState,
						next: null
					}, b === null ? (v = b = J, s = r) : b = b.next = J, Kt.lanes |= H, zi |= H;
					J = j.action, ol && n(r, J), r = j.hasEagerState ? j.eagerState : n(r, J)
				} else H = {
					lane: J,
					revertLane: j.revertLane,
					gesture: j.gesture,
					action: j.action,
					hasEagerState: j.hasEagerState,
					eagerState: j.eagerState,
					next: null
				}, b === null ? (v = b = H, s = r) : b = b.next = H, Kt.lanes |= J, zi |= J;
				j = j.next
			} while (j !== null && j !== e);
			if (b === null ? s = r : b.next = v, !N(r, t.memoizedState) && ($e = !0, Q && (n = Vl, n !== null))) throw n;
			t.memoizedState = r, t.baseState = s, t.baseQueue = b, a.lastRenderedState = r
		}
		return i === null && (a.lanes = 0), [t.memoizedState, a.dispatch]
	}

	function uc(t) {
		var e = We(),
			n = e.queue;
		if (n === null) throw Error(B(311));
		n.lastRenderedReducer = t;
		var a = n.dispatch,
			i = n.pending,
			r = e.memoizedState;
		if (i !== null) {
			n.pending = null;
			var s = i = i.next;
			do r = t(r, s.action), s = s.next; while (s !== i);
			N(r, e.memoizedState) || ($e = !0), e.memoizedState = r, e.baseQueue === null && (e.baseState = r), n.lastRenderedState = r
		}
		return [r, a]
	}

	function Kf(t, e, n) {
		var a = Kt,
			i = We(),
			r = se;
		if (r) {
			if (n === void 0) throw Error(B(407));
			n = n()
		} else n = e();
		var s = !N((ze || i).memoizedState, n);
		if (s && (i.memoizedState = n, $e = !0), i = i.queue, cc(If.bind(null, a, i, t), [t]), i.getSnapshot !== e || s || ke !== null && ke.memoizedState.tag & 1) {
			if (a.flags |= 2048, Ql(9, {
					destroy: void 0
				}, Wf.bind(null, a, i, n, e), null), je === null) throw Error(B(349));
			r || (Qa & 127) !== 0 || Jf(a, e, n)
		}
		return n
	}

	function Jf(t, e, n) {
		t.flags |= 16384, t = {
			getSnapshot: e,
			value: n
		}, e = Kt.updateQueue, e === null ? (e = Cr(), Kt.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t))
	}

	function Wf(t, e, n, a) {
		e.value = n, e.getSnapshot = a, kf(e) && $f(t)
	}

	function If(t, e, n) {
		return n(function() {
			kf(e) && $f(t)
		})
	}

	function kf(t) {
		var e = t.getSnapshot;
		t = t.value;
		try {
			var n = e();
			return !N(t, n)
		} catch {
			return !0
		}
	}

	function $f(t) {
		var e = Cn(t, 2);
		e !== null && Vn(e, t, 2)
	}

	function rc(t) {
		var e = On();
		if (typeof t == "function") {
			var n = t;
			if (t = n(), ol) {
				mt(!0);
				try {
					n()
				} finally {
					mt(!1)
				}
			}
		}
		return e.memoizedState = e.baseState = t, e.queue = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: Za,
			lastRenderedState: t
		}, e
	}

	function Pf(t, e, n, a) {
		return t.baseState = n, lc(t, ze, typeof a == "function" ? a : Za)
	}

	function Zd(t, e, n, a, i) {
		if (Ur(t)) throw Error(B(485));
		if (t = e.action, t !== null) {
			var r = {
				payload: i,
				action: t,
				next: null,
				isTransition: !0,
				status: "pending",
				value: null,
				reason: null,
				listeners: [],
				then: function(s) {
					r.listeners.push(s)
				}
			};
			_.T !== null ? n(!0) : r.isTransition = !1, a(r), n = e.pending, n === null ? (r.next = e.pending = r, ts(e, r)) : (r.next = n.next, e.pending = n.next = r)
		}
	}

	function ts(t, e) {
		var n = e.action,
			a = e.payload,
			i = t.state;
		if (e.isTransition) {
			var r = _.T,
				s = {};
			_.T = s;
			try {
				var v = n(i, a),
					b = _.S;
				b !== null && b(s, v), es(t, e, v)
			} catch (j) {
				oc(t, e, j)
			} finally {
				r !== null && s.types !== null && (r.types = s.types), _.T = r
			}
		} else try {
			r = n(i, a), es(t, e, r)
		} catch (j) {
			oc(t, e, j)
		}
	}

	function es(t, e, n) {
		n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(function(a) {
			ns(t, e, a)
		}, function(a) {
			return oc(t, e, a)
		}) : ns(t, e, n)
	}

	function ns(t, e, n) {
		e.status = "fulfilled", e.value = n, as(e), t.state = n, e = t.pending, e !== null && (n = e.next, n === e ? t.pending = null : (n = n.next, e.next = n, ts(t, n)))
	}

	function oc(t, e, n) {
		var a = t.pending;
		if (t.pending = null, a !== null) {
			a = a.next;
			do e.status = "rejected", e.reason = n, as(e), e = e.next; while (e !== a)
		}
		t.action = null
	}

	function as(t) {
		t = t.listeners;
		for (var e = 0; e < t.length; e++)(0, t[e])()
	}

	function is(t, e) {
		return e
	}

	function ls(t, e) {
		if (se) {
			var n = je.formState;
			if (n !== null) {
				t: {
					var a = Kt;
					if (se) {
						if (Ve) {
							e: {
								for (var i = Ve, r = ua; i.nodeType !== 8;) {
									if (!r) {
										i = null;
										break e
									}
									if (i = oa(i.nextSibling), i === null) {
										i = null;
										break e
									}
								}
								r = i.data,
								i = r === "F!" || r === "F" ? i : null
							}
							if (i) {
								Ve = oa(i.nextSibling), a = i.data === "F!";
								break t
							}
						}
						Ai(a)
					}
					a = !1
				}
				a && (e = n[0])
			}
		}
		return n = On(), n.memoizedState = n.baseState = e, a = {
			pending: null,
			lanes: 0,
			dispatch: null,
			lastRenderedReducer: is,
			lastRenderedState: e
		}, n.queue = a, n = Es.bind(null, Kt, a), a.dispatch = n, a = rc(!1), r = vc.bind(null, Kt, !1, a.queue), a = On(), i = {
			state: e,
			dispatch: null,
			action: t,
			pending: null
		}, a.queue = i, n = Zd.bind(null, Kt, i, r, n), i.dispatch = n, a.memoizedState = t, [e, n, !1]
	}

	function us(t) {
		var e = We();
		return rs(e, ze, t)
	}

	function rs(t, e, n) {
		if (e = lc(t, e, is)[0], t = Rr(Za)[0], typeof e == "object" && e !== null && typeof e.then == "function") try {
			var a = ju(e)
		} catch (s) {
			throw s === xl ? br : s
		} else a = e;
		e = We();
		var i = e.queue,
			r = i.dispatch;
		return n !== e.memoizedState && (Kt.flags |= 2048, Ql(9, {
			destroy: void 0
		}, Fd.bind(null, i, n), null)), [a, r, t]
	}

	function Fd(t, e) {
		t.action = e
	}

	function os(t) {
		var e = We(),
			n = ze;
		if (n !== null) return rs(e, n, t);
		We(), e = e.memoizedState, n = We();
		var a = n.queue.dispatch;
		return n.memoizedState = t, [e, a, !1]
	}

	function Ql(t, e, n, a) {
		return t = {
			tag: t,
			create: n,
			deps: a,
			inst: e,
			next: null
		}, e = Kt.updateQueue, e === null && (e = Cr(), Kt.updateQueue = e), n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (a = n.next, n.next = t, t.next = a, e.lastEffect = t), t
	}

	function cs() {
		return We().memoizedState
	}

	function zr(t, e, n, a) {
		var i = On();
		Kt.flags |= t, i.memoizedState = Ql(1 | e, {
			destroy: void 0
		}, n, a === void 0 ? null : a)
	}

	function Dr(t, e, n, a) {
		var i = We();
		a = a === void 0 ? null : a;
		var r = i.memoizedState.inst;
		ze !== null && a !== null && Po(a, ze.memoizedState.deps) ? i.memoizedState = Ql(e, r, n, a) : (Kt.flags |= t, i.memoizedState = Ql(1 | e, r, n, a))
	}

	function fs(t, e) {
		zr(8390656, 8, t, e)
	}

	function cc(t, e) {
		Dr(2048, 8, t, e)
	}

	function Kd(t) {
		Kt.flags |= 4;
		var e = Kt.updateQueue;
		if (e === null) e = Cr(), Kt.updateQueue = e, e.events = [t];
		else {
			var n = e.events;
			n === null ? e.events = [t] : n.push(t)
		}
	}

	function ss(t) {
		var e = We().memoizedState;
		return Kd({
				ref: e,
				nextImpl: t
			}),
			function() {
				if ((be & 2) !== 0) throw Error(B(440));
				return e.impl.apply(void 0, arguments)
			}
	}

	function hs(t, e) {
		return Dr(4, 2, t, e)
	}

	function ds(t, e) {
		return Dr(4, 4, t, e)
	}

	function vs(t, e) {
		if (typeof e == "function") {
			t = t();
			var n = e(t);
			return function() {
				typeof n == "function" ? n() : e(null)
			}
		}
		if (e != null) return t = t(), e.current = t,
			function() {
				e.current = null
			}
	}

	function ms(t, e, n) {
		n = n != null ? n.concat([t]) : null, Dr(4, 4, vs.bind(null, e, t), n)
	}

	function fc() {}

	function ps(t, e) {
		var n = We();
		e = e === void 0 ? null : e;
		var a = n.memoizedState;
		return e !== null && Po(e, a[1]) ? a[0] : (n.memoizedState = [t, e], t)
	}

	function ys(t, e) {
		var n = We();
		e = e === void 0 ? null : e;
		var a = n.memoizedState;
		if (e !== null && Po(e, a[1])) return a[0];
		if (a = t(), ol) {
			mt(!0);
			try {
				t()
			} finally {
				mt(!1)
			}
		}
		return n.memoizedState = [a, e], a
	}

	function sc(t, e, n) {
		return n === void 0 || (Qa & 1073741824) !== 0 && (ce & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = n, t = gh(), Kt.lanes |= t, zi |= t, n)
	}

	function gs(t, e, n, a) {
		return N(n, e) ? n : Xl.current !== null ? (t = sc(t, n, a), N(t, e) || ($e = !0), t) : (Qa & 42) === 0 || (Qa & 1073741824) !== 0 && (ce & 261930) === 0 ? ($e = !0, t.memoizedState = n) : (t = gh(), Kt.lanes |= t, zi |= t, e)
	}

	function bs(t, e, n, a, i) {
		var r = R.p;
		R.p = r !== 0 && 8 > r ? r : 8;
		var s = _.T,
			v = {};
		_.T = v, vc(t, !1, e, n);
		try {
			var b = i(),
				j = _.S;
			if (j !== null && j(v, b), b !== null && typeof b == "object" && typeof b.then == "function") {
				var Q = Gd(b, a);
				Lu(t, e, Q, Fn(t))
			} else Lu(t, e, a, Fn(t))
		} catch (J) {
			Lu(t, e, {
				then: function() {},
				status: "rejected",
				reason: J
			}, Fn())
		} finally {
			R.p = r, s !== null && v.types !== null && (s.types = v.types), _.T = s
		}
	}

	function Jd() {}

	function hc(t, e, n, a) {
		if (t.tag !== 5) throw Error(B(476));
		var i = _s(t).queue;
		bs(t, i, e, K, n === null ? Jd : function() {
			return As(t), n(a)
		})
	}

	function _s(t) {
		var e = t.memoizedState;
		if (e !== null) return e;
		e = {
			memoizedState: K,
			baseState: K,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Za,
				lastRenderedState: K
			},
			next: null
		};
		var n = {};
		return e.next = {
			memoizedState: n,
			baseState: n,
			baseQueue: null,
			queue: {
				pending: null,
				lanes: 0,
				dispatch: null,
				lastRenderedReducer: Za,
				lastRenderedState: n
			},
			next: null
		}, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e
	}

	function As(t) {
		var e = _s(t);
		e.next === null && (e = t.alternate.memoizedState), Lu(t, e.next.queue, {}, Fn())
	}

	function dc() {
		return mn(ku)
	}

	function Ss() {
		return We().memoizedState
	}

	function ws() {
		return We().memoizedState
	}

	function Wd(t) {
		for (var e = t.return; e !== null;) {
			switch (e.tag) {
				case 24:
				case 3:
					var n = Fn();
					t = Ei(n);
					var a = Mi(e, t, n);
					a !== null && (Vn(a, e, n), Ru(a, e, n)), e = {
						cache: Go()
					}, t.payload = e;
					return
			}
			e = e.return
		}
	}

	function Id(t, e, n) {
		var a = Fn();
		n = {
			lane: a,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		}, Ur(t) ? Ms(e, n) : (n = pa(t, e, n, a), n !== null && (Vn(n, t, a), Ts(n, e, a)))
	}

	function Es(t, e, n) {
		var a = Fn();
		Lu(t, e, n, a)
	}

	function Lu(t, e, n, a) {
		var i = {
			lane: a,
			revertLane: 0,
			gesture: null,
			action: n,
			hasEagerState: !1,
			eagerState: null,
			next: null
		};
		if (Ur(t)) Ms(e, i);
		else {
			var r = t.alternate;
			if (t.lanes === 0 && (r === null || r.lanes === 0) && (r = e.lastRenderedReducer, r !== null)) try {
				var s = e.lastRenderedState,
					v = r(s, n);
				if (i.hasEagerState = !0, i.eagerState = v, N(v, s)) return Ca(t, e, i, 0), je === null && Ta(), !1
			} catch {} finally {}
			if (n = pa(t, e, i, a), n !== null) return Vn(n, t, a), Ts(n, e, a), !0
		}
		return !1
	}

	function vc(t, e, n, a) {
		if (a = {
				lane: 2,
				revertLane: Fc(),
				gesture: null,
				action: a,
				hasEagerState: !1,
				eagerState: null,
				next: null
			}, Ur(t)) {
			if (e) throw Error(B(479))
		} else e = pa(t, n, a, 2), e !== null && Vn(e, t, 2)
	}

	function Ur(t) {
		var e = t.alternate;
		return t === Kt || e !== null && e === Kt
	}

	function Ms(t, e) {
		Gl = Mr = !0;
		var n = t.pending;
		n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e
	}

	function Ts(t, e, n) {
		if ((n & 4194048) !== 0) {
			var a = e.lanes;
			a &= t.pendingLanes, n |= a, e.lanes = n, ar(t, n)
		}
	}
	var Nu = {
		readContext: mn,
		use: Or,
		useCallback: Ge,
		useContext: Ge,
		useEffect: Ge,
		useImperativeHandle: Ge,
		useLayoutEffect: Ge,
		useInsertionEffect: Ge,
		useMemo: Ge,
		useReducer: Ge,
		useRef: Ge,
		useState: Ge,
		useDebugValue: Ge,
		useDeferredValue: Ge,
		useTransition: Ge,
		useSyncExternalStore: Ge,
		useId: Ge,
		useHostTransitionStatus: Ge,
		useFormState: Ge,
		useActionState: Ge,
		useOptimistic: Ge,
		useMemoCache: Ge,
		useCacheRefresh: Ge
	};
	Nu.useEffectEvent = Ge;
	var Cs = {
			readContext: mn,
			use: Or,
			useCallback: function(t, e) {
				return On().memoizedState = [t, e === void 0 ? null : e], t
			},
			useContext: mn,
			useEffect: fs,
			useImperativeHandle: function(t, e, n) {
				n = n != null ? n.concat([t]) : null, zr(4194308, 4, vs.bind(null, e, t), n)
			},
			useLayoutEffect: function(t, e) {
				return zr(4194308, 4, t, e)
			},
			useInsertionEffect: function(t, e) {
				zr(4, 2, t, e)
			},
			useMemo: function(t, e) {
				var n = On();
				e = e === void 0 ? null : e;
				var a = t();
				if (ol) {
					mt(!0);
					try {
						t()
					} finally {
						mt(!1)
					}
				}
				return n.memoizedState = [a, e], a
			},
			useReducer: function(t, e, n) {
				var a = On();
				if (n !== void 0) {
					var i = n(e);
					if (ol) {
						mt(!0);
						try {
							n(e)
						} finally {
							mt(!1)
						}
					}
				} else i = e;
				return a.memoizedState = a.baseState = i, t = {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: t,
					lastRenderedState: i
				}, a.queue = t, t = t.dispatch = Id.bind(null, Kt, t), [a.memoizedState, t]
			},
			useRef: function(t) {
				var e = On();
				return t = {
					current: t
				}, e.memoizedState = t
			},
			useState: function(t) {
				t = rc(t);
				var e = t.queue,
					n = Es.bind(null, Kt, e);
				return e.dispatch = n, [t.memoizedState, n]
			},
			useDebugValue: fc,
			useDeferredValue: function(t, e) {
				var n = On();
				return sc(n, t, e)
			},
			useTransition: function() {
				var t = rc(!1);
				return t = bs.bind(null, Kt, t.queue, !0, !1), On().memoizedState = t, [!1, t]
			},
			useSyncExternalStore: function(t, e, n) {
				var a = Kt,
					i = On();
				if (se) {
					if (n === void 0) throw Error(B(407));
					n = n()
				} else {
					if (n = e(), je === null) throw Error(B(349));
					(ce & 127) !== 0 || Jf(a, e, n)
				}
				i.memoizedState = n;
				var r = {
					value: n,
					getSnapshot: e
				};
				return i.queue = r, fs(If.bind(null, a, r, t), [t]), a.flags |= 2048, Ql(9, {
					destroy: void 0
				}, Wf.bind(null, a, r, n, e), null), n
			},
			useId: function() {
				var t = On(),
					e = je.identifierPrefix;
				if (se) {
					var n = Ra,
						a = Oa;
					n = (a & ~(1 << 32 - Tt(a) - 1)).toString(32) + n, e = "_" + e + "R_" + n, n = Tr++, 0 < n && (e += "H" + n.toString(32)), e += "_"
				} else n = qd++, e = "_" + e + "r_" + n.toString(32) + "_";
				return t.memoizedState = e
			},
			useHostTransitionStatus: dc,
			useFormState: ls,
			useActionState: ls,
			useOptimistic: function(t) {
				var e = On();
				e.memoizedState = e.baseState = t;
				var n = {
					pending: null,
					lanes: 0,
					dispatch: null,
					lastRenderedReducer: null,
					lastRenderedState: null
				};
				return e.queue = n, e = vc.bind(null, Kt, !0, n), n.dispatch = e, [t, e]
			},
			useMemoCache: ic,
			useCacheRefresh: function() {
				return On().memoizedState = Wd.bind(null, Kt)
			},
			useEffectEvent: function(t) {
				var e = On(),
					n = {
						impl: t
					};
				return e.memoizedState = n,
					function() {
						if ((be & 2) !== 0) throw Error(B(440));
						return n.impl.apply(void 0, arguments)
					}
			}
		},
		mc = {
			readContext: mn,
			use: Or,
			useCallback: ps,
			useContext: mn,
			useEffect: cc,
			useImperativeHandle: ms,
			useInsertionEffect: hs,
			useLayoutEffect: ds,
			useMemo: ys,
			useReducer: Rr,
			useRef: cs,
			useState: function() {
				return Rr(Za)
			},
			useDebugValue: fc,
			useDeferredValue: function(t, e) {
				var n = We();
				return gs(n, ze.memoizedState, t, e)
			},
			useTransition: function() {
				var t = Rr(Za)[0],
					e = We().memoizedState;
				return [typeof t == "boolean" ? t : ju(t), e]
			},
			useSyncExternalStore: Kf,
			useId: Ss,
			useHostTransitionStatus: dc,
			useFormState: us,
			useActionState: us,
			useOptimistic: function(t, e) {
				var n = We();
				return Pf(n, ze, t, e)
			},
			useMemoCache: ic,
			useCacheRefresh: ws
		};
	mc.useEffectEvent = ss;
	var Os = {
		readContext: mn,
		use: Or,
		useCallback: ps,
		useContext: mn,
		useEffect: cc,
		useImperativeHandle: ms,
		useInsertionEffect: hs,
		useLayoutEffect: ds,
		useMemo: ys,
		useReducer: uc,
		useRef: cs,
		useState: function() {
			return uc(Za)
		},
		useDebugValue: fc,
		useDeferredValue: function(t, e) {
			var n = We();
			return ze === null ? sc(n, t, e) : gs(n, ze.memoizedState, t, e)
		},
		useTransition: function() {
			var t = uc(Za)[0],
				e = We().memoizedState;
			return [typeof t == "boolean" ? t : ju(t), e]
		},
		useSyncExternalStore: Kf,
		useId: Ss,
		useHostTransitionStatus: dc,
		useFormState: os,
		useActionState: os,
		useOptimistic: function(t, e) {
			var n = We();
			return ze !== null ? Pf(n, ze, t, e) : (n.baseState = t, [t, n.queue.dispatch])
		},
		useMemoCache: ic,
		useCacheRefresh: ws
	};
	Os.useEffectEvent = ss;

	function pc(t, e, n, a) {
		e = t.memoizedState, n = n(a, e), n = n == null ? e : it({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n)
	}
	var yc = {
		enqueueSetState: function(t, e, n) {
			t = t._reactInternals;
			var a = Fn(),
				i = Ei(a);
			i.payload = e, n != null && (i.callback = n), e = Mi(t, i, a), e !== null && (Vn(e, t, a), Ru(e, t, a))
		},
		enqueueReplaceState: function(t, e, n) {
			t = t._reactInternals;
			var a = Fn(),
				i = Ei(a);
			i.tag = 1, i.payload = e, n != null && (i.callback = n), e = Mi(t, i, a), e !== null && (Vn(e, t, a), Ru(e, t, a))
		},
		enqueueForceUpdate: function(t, e) {
			t = t._reactInternals;
			var n = Fn(),
				a = Ei(n);
			a.tag = 2, e != null && (a.callback = e), e = Mi(t, a, n), e !== null && (Vn(e, t, n), Ru(e, t, n))
		}
	};

	function Rs(t, e, n, a, i, r, s) {
		return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(a, r, s) : e.prototype && e.prototype.isPureReactComponent ? !U(n, a) || !U(i, r) : !0
	}

	function zs(t, e, n, a) {
		t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, a), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, a), e.state !== t && yc.enqueueReplaceState(e, e.state, null)
	}

	function cl(t, e) {
		var n = e;
		if ("ref" in e) {
			n = {};
			for (var a in e) a !== "ref" && (n[a] = e[a])
		}
		if (t = t.defaultProps) {
			n === e && (n = it({}, n));
			for (var i in t) n[i] === void 0 && (n[i] = t[i])
		}
		return n
	}

	function Ds(t) {
		dn(t)
	}

	function Us(t) {
		console.error(t)
	}

	function js(t) {
		dn(t)
	}

	function jr(t, e) {
		try {
			var n = t.onUncaughtError;
			n(e.value, {
				componentStack: e.stack
			})
		} catch (a) {
			setTimeout(function() {
				throw a
			})
		}
	}

	function Ls(t, e, n) {
		try {
			var a = t.onCaughtError;
			a(n.value, {
				componentStack: n.stack,
				errorBoundary: e.tag === 1 ? e.stateNode : null
			})
		} catch (i) {
			setTimeout(function() {
				throw i
			})
		}
	}

	function gc(t, e, n) {
		return n = Ei(n), n.tag = 3, n.payload = {
			element: null
		}, n.callback = function() {
			jr(t, e)
		}, n
	}

	function Ns(t) {
		return t = Ei(t), t.tag = 3, t
	}

	function Bs(t, e, n, a) {
		var i = n.type.getDerivedStateFromError;
		if (typeof i == "function") {
			var r = a.value;
			t.payload = function() {
				return i(r)
			}, t.callback = function() {
				Ls(e, n, a)
			}
		}
		var s = n.stateNode;
		s !== null && typeof s.componentDidCatch == "function" && (t.callback = function() {
			Ls(e, n, a), typeof i != "function" && (Di === null ? Di = new Set([this]) : Di.add(this));
			var v = a.stack;
			this.componentDidCatch(a.value, {
				componentStack: v !== null ? v : ""
			})
		})
	}

	function kd(t, e, n, a, i) {
		if (n.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
			if (e = n.alternate, e !== null && Bl(e, n, i, !0), n = Gn.current, n !== null) {
				switch (n.tag) {
					case 31:
					case 13:
						return ra === null ? Zr() : n.alternate === null && qe === 0 && (qe = 3), n.flags &= -257, n.flags |= 65536, n.lanes = i, a === _r ? n.flags |= 16384 : (e = n.updateQueue, e === null ? n.updateQueue = new Set([a]) : e.add(a), qc(t, a, i)), !1;
					case 22:
						return n.flags |= 65536, a === _r ? n.flags |= 16384 : (e = n.updateQueue, e === null ? (e = {
							transitions: null,
							markerInstances: null,
							retryQueue: new Set([a])
						}, n.updateQueue = e) : (n = e.retryQueue, n === null ? e.retryQueue = new Set([a]) : n.add(a)), qc(t, a, i)), !1
				}
				throw Error(B(435, n.tag))
			}
			return qc(t, a, i), Zr(), !1
		}
		if (se) return e = Gn.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = i, a !== Ho && (t = Error(B(422), {
			cause: a
		}), Eu(aa(t, n)))) : (a !== Ho && (e = Error(B(423), {
			cause: a
		}), Eu(aa(e, n))), t = t.current.alternate, t.flags |= 65536, i &= -i, t.lanes |= i, a = aa(a, n), i = gc(t.stateNode, a, i), Jo(t, i), qe !== 4 && (qe = 2)), !1;
		var r = Error(B(520), {
			cause: a
		});
		if (r = aa(r, n), qu === null ? qu = [r] : qu.push(r), qe !== 4 && (qe = 2), e === null) return !0;
		a = aa(a, n), n = e;
		do {
			switch (n.tag) {
				case 3:
					return n.flags |= 65536, t = i & -i, n.lanes |= t, t = gc(n.stateNode, a, t), Jo(n, t), !1;
				case 1:
					if (e = n.type, r = n.stateNode, (n.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || r !== null && typeof r.componentDidCatch == "function" && (Di === null || !Di.has(r)))) return n.flags |= 65536, i &= -i, n.lanes |= i, i = Ns(i), Bs(i, t, n, a), Jo(n, i), !1
			}
			n = n.return
		} while (n !== null);
		return !1
	}
	var bc = Error(B(461)),
		$e = !1;

	function pn(t, e, n, a) {
		e.child = t === null ? Yf(e, null, n, a) : rl(e, t.child, n, a)
	}

	function Hs(t, e, n, a, i) {
		n = n.render;
		var r = e.ref;
		if ("ref" in a) {
			var s = {};
			for (var v in a) v !== "ref" && (s[v] = a[v])
		} else s = a;
		return al(e), a = tc(t, e, n, s, r, i), v = ec(), t !== null && !$e ? (nc(t, e, i), Fa(t, e, i)) : (se && v && No(e), e.flags |= 1, pn(t, e, a, i), e.child)
	}

	function Vs(t, e, n, a, i) {
		if (t === null) {
			var r = n.type;
			return typeof r == "function" && !Uo(r) && r.defaultProps === void 0 && n.compare === null ? (e.tag = 15, e.type = r, xs(t, e, r, a, i)) : (t = vr(n.type, null, a, e, e.mode, i), t.ref = e.ref, t.return = e, e.child = t)
		}
		if (r = t.child, !Cc(t, i)) {
			var s = r.memoizedProps;
			if (n = n.compare, n = n !== null ? n : U, n(s, a) && t.ref === e.ref) return Fa(t, e, i)
		}
		return e.flags |= 1, t = Ya(r, a), t.ref = e.ref, t.return = e, e.child = t
	}

	function xs(t, e, n, a, i) {
		if (t !== null) {
			var r = t.memoizedProps;
			if (U(r, a) && t.ref === e.ref)
				if ($e = !1, e.pendingProps = a = r, Cc(t, i))(t.flags & 131072) !== 0 && ($e = !0);
				else return e.lanes = t.lanes, Fa(t, e, i)
		}
		return _c(t, e, n, a, i)
	}

	function Ys(t, e, n, a) {
		var i = a.children,
			r = t !== null ? t.memoizedState : null;
		if (t === null && e.stateNode === null && (e.stateNode = {
				_visibility: 1,
				_pendingMarkers: null,
				_retryCache: null,
				_transitions: null
			}), a.mode === "hidden") {
			if ((e.flags & 128) !== 0) {
				if (r = r !== null ? r.baseLanes | n : n, t !== null) {
					for (a = e.child = t.child, i = 0; a !== null;) i = i | a.lanes | a.childLanes, a = a.sibling;
					a = i & ~r
				} else a = 0, e.child = null;
				return Xs(t, e, r, n, a)
			}
			if ((n & 536870912) !== 0) e.memoizedState = {
				baseLanes: 0,
				cachePool: null
			}, t !== null && gr(e, r !== null ? r.cachePool : null), r !== null ? qf(e, r) : Io(), Qf(e);
			else return a = e.lanes = 536870912, Xs(t, e, r !== null ? r.baseLanes | n : n, n, a)
		} else r !== null ? (gr(e, r.cachePool), qf(e, r), Ci(), e.memoizedState = null) : (t !== null && gr(e, null), Io(), Ci());
		return pn(t, e, i, n), e.child
	}

	function Bu(t, e) {
		return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
			_visibility: 1,
			_pendingMarkers: null,
			_retryCache: null,
			_transitions: null
		}), e.sibling
	}

	function Xs(t, e, n, a, i) {
		var r = Qo();
		return r = r === null ? null : {
			parent: Ie._currentValue,
			pool: r
		}, e.memoizedState = {
			baseLanes: n,
			cachePool: r
		}, t !== null && gr(e, null), Io(), Qf(e), t !== null && Bl(t, e, a, !0), e.childLanes = i, null
	}

	function Lr(t, e) {
		return e = Br({
			mode: e.mode,
			children: e.children
		}, t.mode), e.ref = t.ref, t.child = e, e.return = t, e
	}

	function Gs(t, e, n) {
		return rl(e, t.child, null, n), t = Lr(e, e.pendingProps), t.flags |= 2, qn(e), e.memoizedState = null, t
	}

	function $d(t, e, n) {
		var a = e.pendingProps,
			i = (e.flags & 128) !== 0;
		if (e.flags &= -129, t === null) {
			if (se) {
				if (a.mode === "hidden") return t = Lr(e, a), e.lanes = 536870912, Bu(null, t);
				if ($o(e), (t = Ve) ? (t = td(t, ua), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
						dehydrated: t,
						treeContext: bi !== null ? {
							id: Oa,
							overflow: Ra
						} : null,
						retryLane: 536870912,
						hydrationErrors: null
					}, n = Mf(t), n.return = e, e.child = n, vn = e, Ve = null)) : t = null, t === null) throw Ai(e);
				return e.lanes = 536870912, null
			}
			return Lr(e, a)
		}
		var r = t.memoizedState;
		if (r !== null) {
			var s = r.dehydrated;
			if ($o(e), i)
				if (e.flags & 256) e.flags &= -257, e = Gs(t, e, n);
				else if (e.memoizedState !== null) e.child = t.child, e.flags |= 128, e = null;
			else throw Error(B(558));
			else if ($e || Bl(t, e, n, !1), i = (n & t.childLanes) !== 0, $e || i) {
				if (a = je, a !== null && (s = ai(a, n), s !== 0 && s !== r.retryLane)) throw r.retryLane = s, Cn(t, s), Vn(a, t, s), bc;
				Zr(), e = Gs(t, e, n)
			} else t = r.treeContext, Ve = oa(s.nextSibling), vn = e, se = !0, _i = null, ua = !1, t !== null && Of(e, t), e = Lr(e, a), e.flags |= 4096;
			return e
		}
		return t = Ya(t.child, {
			mode: a.mode,
			children: a.children
		}), t.ref = e.ref, e.child = t, t.return = e, t
	}

	function Nr(t, e) {
		var n = e.ref;
		if (n === null) t !== null && t.ref !== null && (e.flags |= 4194816);
		else {
			if (typeof n != "function" && typeof n != "object") throw Error(B(284));
			(t === null || t.ref !== n) && (e.flags |= 4194816)
		}
	}

	function _c(t, e, n, a, i) {
		return al(e), n = tc(t, e, n, a, void 0, i), a = ec(), t !== null && !$e ? (nc(t, e, i), Fa(t, e, i)) : (se && a && No(e), e.flags |= 1, pn(t, e, n, i), e.child)
	}

	function qs(t, e, n, a, i, r) {
		return al(e), e.updateQueue = null, n = Ff(e, a, n, i), Zf(t), a = ec(), t !== null && !$e ? (nc(t, e, r), Fa(t, e, r)) : (se && a && No(e), e.flags |= 1, pn(t, e, n, r), e.child)
	}

	function Qs(t, e, n, a, i) {
		if (al(e), e.stateNode === null) {
			var r = Xn,
				s = n.contextType;
			typeof s == "object" && s !== null && (r = mn(s)), r = new n(a, r), e.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = yc, e.stateNode = r, r._reactInternals = e, r = e.stateNode, r.props = a, r.state = e.memoizedState, r.refs = {}, Fo(e), s = n.contextType, r.context = typeof s == "object" && s !== null ? mn(s) : Xn, r.state = e.memoizedState, s = n.getDerivedStateFromProps, typeof s == "function" && (pc(e, n, s, a), r.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof r.getSnapshotBeforeUpdate == "function" || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (s = r.state, typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount(), s !== r.state && yc.enqueueReplaceState(r, r.state, null), Du(e, a, r, i), zu(), r.state = e.memoizedState), typeof r.componentDidMount == "function" && (e.flags |= 4194308), a = !0
		} else if (t === null) {
			r = e.stateNode;
			var v = e.memoizedProps,
				b = cl(n, v);
			r.props = b;
			var j = r.context,
				Q = n.contextType;
			s = Xn, typeof Q == "object" && Q !== null && (s = mn(Q));
			var J = n.getDerivedStateFromProps;
			Q = typeof J == "function" || typeof r.getSnapshotBeforeUpdate == "function", v = e.pendingProps !== v, Q || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (v || j !== s) && zs(e, r, a, s), wi = !1;
			var H = e.memoizedState;
			r.state = H, Du(e, a, r, i), zu(), j = e.memoizedState, v || H !== j || wi ? (typeof J == "function" && (pc(e, n, J, a), j = e.memoizedState), (b = wi || Rs(e, n, b, a, H, j, s)) ? (Q || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount()), typeof r.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof r.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = a, e.memoizedState = j), r.props = a, r.state = j, r.context = s, a = b) : (typeof r.componentDidMount == "function" && (e.flags |= 4194308), a = !1)
		} else {
			r = e.stateNode, Ko(t, e), s = e.memoizedProps, Q = cl(n, s), r.props = Q, J = e.pendingProps, H = r.context, j = n.contextType, b = Xn, typeof j == "object" && j !== null && (b = mn(j)), v = n.getDerivedStateFromProps, (j = typeof v == "function" || typeof r.getSnapshotBeforeUpdate == "function") || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (s !== J || H !== b) && zs(e, r, a, b), wi = !1, H = e.memoizedState, r.state = H, Du(e, a, r, i), zu();
			var X = e.memoizedState;
			s !== J || H !== X || wi || t !== null && t.dependencies !== null && pr(t.dependencies) ? (typeof v == "function" && (pc(e, n, v, a), X = e.memoizedState), (Q = wi || Rs(e, n, Q, a, H, X, b) || t !== null && t.dependencies !== null && pr(t.dependencies)) ? (j || typeof r.UNSAFE_componentWillUpdate != "function" && typeof r.componentWillUpdate != "function" || (typeof r.componentWillUpdate == "function" && r.componentWillUpdate(a, X, b), typeof r.UNSAFE_componentWillUpdate == "function" && r.UNSAFE_componentWillUpdate(a, X, b)), typeof r.componentDidUpdate == "function" && (e.flags |= 4), typeof r.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof r.componentDidUpdate != "function" || s === t.memoizedProps && H === t.memoizedState || (e.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || s === t.memoizedProps && H === t.memoizedState || (e.flags |= 1024), e.memoizedProps = a, e.memoizedState = X), r.props = a, r.state = X, r.context = b, a = Q) : (typeof r.componentDidUpdate != "function" || s === t.memoizedProps && H === t.memoizedState || (e.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || s === t.memoizedProps && H === t.memoizedState || (e.flags |= 1024), a = !1)
		}
		return r = a, Nr(t, e), a = (e.flags & 128) !== 0, r || a ? (r = e.stateNode, n = a && typeof n.getDerivedStateFromError != "function" ? null : r.render(), e.flags |= 1, t !== null && a ? (e.child = rl(e, t.child, null, i), e.child = rl(e, null, n, i)) : pn(t, e, n, i), e.memoizedState = r.state, t = e.child) : t = Fa(t, e, i), t
	}

	function Zs(t, e, n, a) {
		return el(), e.flags |= 256, pn(t, e, n, a), e.child
	}
	var Ac = {
		dehydrated: null,
		treeContext: null,
		retryLane: 0,
		hydrationErrors: null
	};

	function Sc(t) {
		return {
			baseLanes: t,
			cachePool: Lf()
		}
	}

	function wc(t, e, n) {
		return t = t !== null ? t.childLanes & ~n : 0, e && (t |= Zn), t
	}

	function Fs(t, e, n) {
		var a = e.pendingProps,
			i = !1,
			r = (e.flags & 128) !== 0,
			s;
		if ((s = r) || (s = t !== null && t.memoizedState === null ? !1 : (Je.current & 2) !== 0), s && (i = !0, e.flags &= -129), s = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
			if (se) {
				if (i ? Ti(e) : Ci(), (t = Ve) ? (t = td(t, ua), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
						dehydrated: t,
						treeContext: bi !== null ? {
							id: Oa,
							overflow: Ra
						} : null,
						retryLane: 536870912,
						hydrationErrors: null
					}, n = Mf(t), n.return = e, e.child = n, vn = e, Ve = null)) : t = null, t === null) throw Ai(e);
				return uf(t) ? e.lanes = 32 : e.lanes = 536870912, null
			}
			var v = a.children;
			return a = a.fallback, i ? (Ci(), i = e.mode, v = Br({
				mode: "hidden",
				children: v
			}, i), a = tl(a, i, n, null), v.return = e, a.return = e, v.sibling = a, e.child = v, a = e.child, a.memoizedState = Sc(n), a.childLanes = wc(t, s, n), e.memoizedState = Ac, Bu(null, a)) : (Ti(e), Ec(e, v))
		}
		var b = t.memoizedState;
		if (b !== null && (v = b.dehydrated, v !== null)) {
			if (r) e.flags & 256 ? (Ti(e), e.flags &= -257, e = Mc(t, e, n)) : e.memoizedState !== null ? (Ci(), e.child = t.child, e.flags |= 128, e = null) : (Ci(), v = a.fallback, i = e.mode, a = Br({
				mode: "visible",
				children: a.children
			}, i), v = tl(v, i, n, null), v.flags |= 2, a.return = e, v.return = e, a.sibling = v, e.child = a, rl(e, t.child, null, n), a = e.child, a.memoizedState = Sc(n), a.childLanes = wc(t, s, n), e.memoizedState = Ac, e = Bu(null, a));
			else if (Ti(e), uf(v)) {
				if (s = v.nextSibling && v.nextSibling.dataset, s) var j = s.dgst;
				s = j, a = Error(B(419)), a.stack = "", a.digest = s, Eu({
					value: a,
					source: null,
					stack: null
				}), e = Mc(t, e, n)
			} else if ($e || Bl(t, e, n, !1), s = (n & t.childLanes) !== 0, $e || s) {
				if (s = je, s !== null && (a = ai(s, n), a !== 0 && a !== b.retryLane)) throw b.retryLane = a, Cn(t, a), Vn(s, t, a), bc;
				lf(v) || Zr(), e = Mc(t, e, n)
			} else lf(v) ? (e.flags |= 192, e.child = t.child, e = null) : (t = b.treeContext, Ve = oa(v.nextSibling), vn = e, se = !0, _i = null, ua = !1, t !== null && Of(e, t), e = Ec(e, a.children), e.flags |= 4096);
			return e
		}
		return i ? (Ci(), v = a.fallback, i = e.mode, b = t.child, j = b.sibling, a = Ya(b, {
			mode: "hidden",
			children: a.children
		}), a.subtreeFlags = b.subtreeFlags & 65011712, j !== null ? v = Ya(j, v) : (v = tl(v, i, n, null), v.flags |= 2), v.return = e, a.return = e, a.sibling = v, e.child = a, Bu(null, a), a = e.child, v = t.child.memoizedState, v === null ? v = Sc(n) : (i = v.cachePool, i !== null ? (b = Ie._currentValue, i = i.parent !== b ? {
			parent: b,
			pool: b
		} : i) : i = Lf(), v = {
			baseLanes: v.baseLanes | n,
			cachePool: i
		}), a.memoizedState = v, a.childLanes = wc(t, s, n), e.memoizedState = Ac, Bu(t.child, a)) : (Ti(e), n = t.child, t = n.sibling, n = Ya(n, {
			mode: "visible",
			children: a.children
		}), n.return = e, n.sibling = null, t !== null && (s = e.deletions, s === null ? (e.deletions = [t], e.flags |= 16) : s.push(t)), e.child = n, e.memoizedState = null, n)
	}

	function Ec(t, e) {
		return e = Br({
			mode: "visible",
			children: e
		}, t.mode), e.return = t, t.child = e
	}

	function Br(t, e) {
		return t = wn(22, t, null, e), t.lanes = 0, t
	}

	function Mc(t, e, n) {
		return rl(e, t.child, null, n), t = Ec(e, e.pendingProps.children), t.flags |= 2, e.memoizedState = null, t
	}

	function Ks(t, e, n) {
		t.lanes |= e;
		var a = t.alternate;
		a !== null && (a.lanes |= e), Yo(t.return, e, n)
	}

	function Tc(t, e, n, a, i, r) {
		var s = t.memoizedState;
		s === null ? t.memoizedState = {
			isBackwards: e,
			rendering: null,
			renderingStartTime: 0,
			last: a,
			tail: n,
			tailMode: i,
			treeForkCount: r
		} : (s.isBackwards = e, s.rendering = null, s.renderingStartTime = 0, s.last = a, s.tail = n, s.tailMode = i, s.treeForkCount = r)
	}

	function Js(t, e, n) {
		var a = e.pendingProps,
			i = a.revealOrder,
			r = a.tail;
		a = a.children;
		var s = Je.current,
			v = (s & 2) !== 0;
		if (v ? (s = s & 1 | 2, e.flags |= 128) : s &= 1, k(Je, s), pn(t, e, a, n), a = se ? wu : 0, !v && t !== null && (t.flags & 128) !== 0) t: for (t = e.child; t !== null;) {
			if (t.tag === 13) t.memoizedState !== null && Ks(t, n, e);
			else if (t.tag === 19) Ks(t, n, e);
			else if (t.child !== null) {
				t.child.return = t, t = t.child;
				continue
			}
			if (t === e) break t;
			for (; t.sibling === null;) {
				if (t.return === null || t.return === e) break t;
				t = t.return
			}
			t.sibling.return = t.return, t = t.sibling
		}
		switch (i) {
			case "forwards":
				for (n = e.child, i = null; n !== null;) t = n.alternate, t !== null && Er(t) === null && (i = n), n = n.sibling;
				n = i, n === null ? (i = e.child, e.child = null) : (i = n.sibling, n.sibling = null), Tc(e, !1, i, n, r, a);
				break;
			case "backwards":
			case "unstable_legacy-backwards":
				for (n = null, i = e.child, e.child = null; i !== null;) {
					if (t = i.alternate, t !== null && Er(t) === null) {
						e.child = i;
						break
					}
					t = i.sibling, i.sibling = n, n = i, i = t
				}
				Tc(e, !0, n, null, r, a);
				break;
			case "together":
				Tc(e, !1, null, null, void 0, a);
				break;
			default:
				e.memoizedState = null
		}
		return e.child
	}

	function Fa(t, e, n) {
		if (t !== null && (e.dependencies = t.dependencies), zi |= e.lanes, (n & e.childLanes) === 0)
			if (t !== null) {
				if (Bl(t, e, n, !1), (n & e.childLanes) === 0) return null
			} else return null;
		if (t !== null && e.child !== t.child) throw Error(B(153));
		if (e.child !== null) {
			for (t = e.child, n = Ya(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null;) t = t.sibling, n = n.sibling = Ya(t, t.pendingProps), n.return = e;
			n.sibling = null
		}
		return e.child
	}

	function Cc(t, e) {
		return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && pr(t)))
	}

	function Pd(t, e, n) {
		switch (e.tag) {
			case 3:
				Bt(e, e.stateNode.containerInfo), Si(e, Ie, t.memoizedState.cache), el();
				break;
			case 27:
			case 5:
				te(e);
				break;
			case 4:
				Bt(e, e.stateNode.containerInfo);
				break;
			case 10:
				Si(e, e.type, e.memoizedProps.value);
				break;
			case 31:
				if (e.memoizedState !== null) return e.flags |= 128, $o(e), null;
				break;
			case 13:
				var a = e.memoizedState;
				if (a !== null) return a.dehydrated !== null ? (Ti(e), e.flags |= 128, null) : (n & e.child.childLanes) !== 0 ? Fs(t, e, n) : (Ti(e), t = Fa(t, e, n), t !== null ? t.sibling : null);
				Ti(e);
				break;
			case 19:
				var i = (t.flags & 128) !== 0;
				if (a = (n & e.childLanes) !== 0, a || (Bl(t, e, n, !1), a = (n & e.childLanes) !== 0), i) {
					if (a) return Js(t, e, n);
					e.flags |= 128
				}
				if (i = e.memoizedState, i !== null && (i.rendering = null, i.tail = null, i.lastEffect = null), k(Je, Je.current), a) break;
				return null;
			case 22:
				return e.lanes = 0, Ys(t, e, n, e.pendingProps);
			case 24:
				Si(e, Ie, t.memoizedState.cache)
		}
		return Fa(t, e, n)
	}

	function Ws(t, e, n) {
		if (t !== null)
			if (t.memoizedProps !== e.pendingProps) $e = !0;
			else {
				if (!Cc(t, n) && (e.flags & 128) === 0) return $e = !1, Pd(t, e, n);
				$e = (t.flags & 131072) !== 0
			}
		else $e = !1, se && (e.flags & 1048576) !== 0 && Cf(e, wu, e.index);
		switch (e.lanes = 0, e.tag) {
			case 16:
				t: {
					var a = e.pendingProps;
					if (t = ll(e.elementType), e.type = t, typeof t == "function") Uo(t) ? (a = cl(t, a), e.tag = 1, e = Qs(null, e, t, a, n)) : (e.tag = 0, e = _c(null, e, t, a, n));
					else {
						if (t != null) {
							var i = t.$$typeof;
							if (i === Dt) {
								e.tag = 11, e = Hs(null, e, t, a, n);
								break t
							} else if (i === Ut) {
								e.tag = 14, e = Vs(null, e, t, a, n);
								break t
							}
						}
						throw e = z(t) || t, Error(B(306, e, ""))
					}
				}
				return e;
			case 0:
				return _c(t, e, e.type, e.pendingProps, n);
			case 1:
				return a = e.type, i = cl(a, e.pendingProps), Qs(t, e, a, i, n);
			case 3:
				t: {
					if (Bt(e, e.stateNode.containerInfo), t === null) throw Error(B(387));a = e.pendingProps;
					var r = e.memoizedState;i = r.element,
					Ko(t, e),
					Du(e, a, null, n);
					var s = e.memoizedState;
					if (a = s.cache, Si(e, Ie, a), a !== r.cache && Xo(e, [Ie], n, !0), zu(), a = s.element, r.isDehydrated)
						if (r = {
								element: a,
								isDehydrated: !1,
								cache: s.cache
							}, e.updateQueue.baseState = r, e.memoizedState = r, e.flags & 256) {
							e = Zs(t, e, a, n);
							break t
						} else if (a !== i) {
						i = aa(Error(B(424)), e), Eu(i), e = Zs(t, e, a, n);
						break t
					} else {
						switch (t = e.stateNode.containerInfo, t.nodeType) {
							case 9:
								t = t.body;
								break;
							default:
								t = t.nodeName === "HTML" ? t.ownerDocument.body : t
						}
						for (Ve = oa(t.firstChild), vn = e, se = !0, _i = null, ua = !0, n = Yf(e, null, a, n), e.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling
					} else {
						if (el(), a === i) {
							e = Fa(t, e, n);
							break t
						}
						pn(t, e, a, n)
					}
					e = e.child
				}
				return e;
			case 26:
				return Nr(t, e), t === null ? (n = ud(e.type, null, e.pendingProps, null)) ? e.memoizedState = n : se || (n = e.type, t = e.pendingProps, a = $r(gt.current).createElement(n), a[Be] = e, a[sn] = t, yn(a, n, t), Fe(a), e.stateNode = a) : e.memoizedState = ud(e.type, t.memoizedProps, e.pendingProps, t.memoizedState), null;
			case 27:
				return te(e), t === null && se && (a = e.stateNode = ad(e.type, e.pendingProps, gt.current), vn = e, ua = !0, i = Ve, Ni(e.type) ? (rf = i, Ve = oa(a.firstChild)) : Ve = i), pn(t, e, e.pendingProps.children, n), Nr(t, e), t === null && (e.flags |= 4194304), e.child;
			case 5:
				return t === null && se && ((i = a = Ve) && (a = Rv(a, e.type, e.pendingProps, ua), a !== null ? (e.stateNode = a, vn = e, Ve = oa(a.firstChild), ua = !1, i = !0) : i = !1), i || Ai(e)), te(e), i = e.type, r = e.pendingProps, s = t !== null ? t.memoizedProps : null, a = r.children, ef(i, r) ? a = null : s !== null && ef(i, s) && (e.flags |= 32), e.memoizedState !== null && (i = tc(t, e, Qd, null, null, n), ku._currentValue = i), Nr(t, e), pn(t, e, a, n), e.child;
			case 6:
				return t === null && se && ((t = n = Ve) && (n = zv(n, e.pendingProps, ua), n !== null ? (e.stateNode = n, vn = e, Ve = null, t = !0) : t = !1), t || Ai(e)), null;
			case 13:
				return Fs(t, e, n);
			case 4:
				return Bt(e, e.stateNode.containerInfo), a = e.pendingProps, t === null ? e.child = rl(e, null, a, n) : pn(t, e, a, n), e.child;
			case 11:
				return Hs(t, e, e.type, e.pendingProps, n);
			case 7:
				return pn(t, e, e.pendingProps, n), e.child;
			case 8:
				return pn(t, e, e.pendingProps.children, n), e.child;
			case 12:
				return pn(t, e, e.pendingProps.children, n), e.child;
			case 10:
				return a = e.pendingProps, Si(e, e.type, a.value), pn(t, e, a.children, n), e.child;
			case 9:
				return i = e.type._context, a = e.pendingProps.children, al(e), i = mn(i), a = a(i), e.flags |= 1, pn(t, e, a, n), e.child;
			case 14:
				return Vs(t, e, e.type, e.pendingProps, n);
			case 15:
				return xs(t, e, e.type, e.pendingProps, n);
			case 19:
				return Js(t, e, n);
			case 31:
				return $d(t, e, n);
			case 22:
				return Ys(t, e, n, e.pendingProps);
			case 24:
				return al(e), a = mn(Ie), t === null ? (i = Qo(), i === null && (i = je, r = Go(), i.pooledCache = r, r.refCount++, r !== null && (i.pooledCacheLanes |= n), i = r), e.memoizedState = {
					parent: a,
					cache: i
				}, Fo(e), Si(e, Ie, i)) : ((t.lanes & n) !== 0 && (Ko(t, e), Du(e, null, null, n), zu()), i = t.memoizedState, r = e.memoizedState, i.parent !== a ? (i = {
					parent: a,
					cache: a
				}, e.memoizedState = i, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = i), Si(e, Ie, a)) : (a = r.cache, Si(e, Ie, a), a !== i.cache && Xo(e, [Ie], n, !0))), pn(t, e, e.pendingProps.children, n), e.child;
			case 29:
				throw e.pendingProps
		}
		throw Error(B(156, e.tag))
	}

	function Ka(t) {
		t.flags |= 4
	}

	function Oc(t, e, n, a, i) {
		if ((e = (t.mode & 32) !== 0) && (e = !1), e) {
			if (t.flags |= 16777216, (i & 335544128) === i)
				if (t.stateNode.complete) t.flags |= 8192;
				else if (Sh()) t.flags |= 8192;
			else throw ul = _r, Zo
		} else t.flags &= -16777217
	}

	function Is(t, e) {
		if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0) t.flags &= -16777217;
		else if (t.flags |= 16777216, !sd(e))
			if (Sh()) t.flags |= 8192;
			else throw ul = _r, Zo
	}

	function Hr(t, e) {
		e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Vt() : 536870912, t.lanes |= e, Jl |= e)
	}

	function Hu(t, e) {
		if (!se) switch (t.tailMode) {
			case "hidden":
				e = t.tail;
				for (var n = null; e !== null;) e.alternate !== null && (n = e), e = e.sibling;
				n === null ? t.tail = null : n.sibling = null;
				break;
			case "collapsed":
				n = t.tail;
				for (var a = null; n !== null;) n.alternate !== null && (a = n), n = n.sibling;
				a === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : a.sibling = null
		}
	}

	function xe(t) {
		var e = t.alternate !== null && t.alternate.child === t.child,
			n = 0,
			a = 0;
		if (e)
			for (var i = t.child; i !== null;) n |= i.lanes | i.childLanes, a |= i.subtreeFlags & 65011712, a |= i.flags & 65011712, i.return = t, i = i.sibling;
		else
			for (i = t.child; i !== null;) n |= i.lanes | i.childLanes, a |= i.subtreeFlags, a |= i.flags, i.return = t, i = i.sibling;
		return t.subtreeFlags |= a, t.childLanes = n, e
	}

	function tv(t, e, n) {
		var a = e.pendingProps;
		switch (Bo(e), e.tag) {
			case 16:
			case 15:
			case 0:
			case 11:
			case 7:
			case 8:
			case 12:
			case 9:
			case 14:
				return xe(e), null;
			case 1:
				return xe(e), null;
			case 3:
				return n = e.stateNode, a = null, t !== null && (a = t.memoizedState.cache), e.memoizedState.cache !== a && (e.flags |= 2048), qa(Ie), Zt(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (t === null || t.child === null) && (Nl(e) ? Ka(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, Vo())), xe(e), null;
			case 26:
				var i = e.type,
					r = e.memoizedState;
				return t === null ? (Ka(e), r !== null ? (xe(e), Is(e, r)) : (xe(e), Oc(e, i, null, a, n))) : r ? r !== t.memoizedState ? (Ka(e), xe(e), Is(e, r)) : (xe(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== a && Ka(e), xe(e), Oc(e, i, t, a, n)), null;
			case 27:
				if (Le(e), n = gt.current, i = e.type, t !== null && e.stateNode != null) t.memoizedProps !== a && Ka(e);
				else {
					if (!a) {
						if (e.stateNode === null) throw Error(B(166));
						return xe(e), null
					}
					t = W.current, Nl(e) ? Rf(e) : (t = ad(i, a, n), e.stateNode = t, Ka(e))
				}
				return xe(e), null;
			case 5:
				if (Le(e), i = e.type, t !== null && e.stateNode != null) t.memoizedProps !== a && Ka(e);
				else {
					if (!a) {
						if (e.stateNode === null) throw Error(B(166));
						return xe(e), null
					}
					if (r = W.current, Nl(e)) Rf(e);
					else {
						var s = $r(gt.current);
						switch (r) {
							case 1:
								r = s.createElementNS("http://www.w3.org/2000/svg", i);
								break;
							case 2:
								r = s.createElementNS("http://www.w3.org/1998/Math/MathML", i);
								break;
							default:
								switch (i) {
									case "svg":
										r = s.createElementNS("http://www.w3.org/2000/svg", i);
										break;
									case "math":
										r = s.createElementNS("http://www.w3.org/1998/Math/MathML", i);
										break;
									case "script":
										r = s.createElement("div"), r.innerHTML = "<script><\/script>", r = r.removeChild(r.firstChild);
										break;
									case "select":
										r = typeof a.is == "string" ? s.createElement("select", {
											is: a.is
										}) : s.createElement("select"), a.multiple ? r.multiple = !0 : a.size && (r.size = a.size);
										break;
									default:
										r = typeof a.is == "string" ? s.createElement(i, {
											is: a.is
										}) : s.createElement(i)
								}
						}
						r[Be] = e, r[sn] = a;
						t: for (s = e.child; s !== null;) {
							if (s.tag === 5 || s.tag === 6) r.appendChild(s.stateNode);
							else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
								s.child.return = s, s = s.child;
								continue
							}
							if (s === e) break t;
							for (; s.sibling === null;) {
								if (s.return === null || s.return === e) break t;
								s = s.return
							}
							s.sibling.return = s.return, s = s.sibling
						}
						e.stateNode = r;
						t: switch (yn(r, i, a), i) {
							case "button":
							case "input":
							case "select":
							case "textarea":
								a = !!a.autoFocus;
								break t;
							case "img":
								a = !0;
								break t;
							default:
								a = !1
						}
						a && Ka(e)
					}
				}
				return xe(e), Oc(e, e.type, t === null ? null : t.memoizedProps, e.pendingProps, n), null;
			case 6:
				if (t && e.stateNode != null) t.memoizedProps !== a && Ka(e);
				else {
					if (typeof a != "string" && e.stateNode === null) throw Error(B(166));
					if (t = gt.current, Nl(e)) {
						if (t = e.stateNode, n = e.memoizedProps, a = null, i = vn, i !== null) switch (i.tag) {
							case 27:
							case 5:
								a = i.memoizedProps
						}
						t[Be] = e, t = !!(t.nodeValue === n || a !== null && a.suppressHydrationWarning === !0 || Fh(t.nodeValue, n)), t || Ai(e, !0)
					} else t = $r(t).createTextNode(a), t[Be] = e, e.stateNode = t
				}
				return xe(e), null;
			case 31:
				if (n = e.memoizedState, t === null || t.memoizedState !== null) {
					if (a = Nl(e), n !== null) {
						if (t === null) {
							if (!a) throw Error(B(318));
							if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(B(557));
							t[Be] = e
						} else el(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
						xe(e), t = !1
					} else n = Vo(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), t = !0;
					if (!t) return e.flags & 256 ? (qn(e), e) : (qn(e), null);
					if ((e.flags & 128) !== 0) throw Error(B(558))
				}
				return xe(e), null;
			case 13:
				if (a = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
					if (i = Nl(e), a !== null && a.dehydrated !== null) {
						if (t === null) {
							if (!i) throw Error(B(318));
							if (i = e.memoizedState, i = i !== null ? i.dehydrated : null, !i) throw Error(B(317));
							i[Be] = e
						} else el(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
						xe(e), i = !1
					} else i = Vo(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = i), i = !0;
					if (!i) return e.flags & 256 ? (qn(e), e) : (qn(e), null)
				}
				return qn(e), (e.flags & 128) !== 0 ? (e.lanes = n, e) : (n = a !== null, t = t !== null && t.memoizedState !== null, n && (a = e.child, i = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (i = a.alternate.memoizedState.cachePool.pool), r = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (r = a.memoizedState.cachePool.pool), r !== i && (a.flags |= 2048)), n !== t && n && (e.child.flags |= 8192), Hr(e, e.updateQueue), xe(e), null);
			case 4:
				return Zt(), t === null && Ic(e.stateNode.containerInfo), xe(e), null;
			case 10:
				return qa(e.type), xe(e), null;
			case 19:
				if (L(Je), a = e.memoizedState, a === null) return xe(e), null;
				if (i = (e.flags & 128) !== 0, r = a.rendering, r === null)
					if (i) Hu(a, !1);
					else {
						if (qe !== 0 || t !== null && (t.flags & 128) !== 0)
							for (t = e.child; t !== null;) {
								if (r = Er(t), r !== null) {
									for (e.flags |= 128, Hu(a, !1), t = r.updateQueue, e.updateQueue = t, Hr(e, t), e.subtreeFlags = 0, t = n, n = e.child; n !== null;) Ef(n, t), n = n.sibling;
									return k(Je, Je.current & 1 | 2), se && Xa(e, a.treeForkCount), e.child
								}
								t = t.sibling
							}
						a.tail !== null && Ae() > Gr && (e.flags |= 128, i = !0, Hu(a, !1), e.lanes = 4194304)
					}
				else {
					if (!i)
						if (t = Er(r), t !== null) {
							if (e.flags |= 128, i = !0, t = t.updateQueue, e.updateQueue = t, Hr(e, t), Hu(a, !0), a.tail === null && a.tailMode === "hidden" && !r.alternate && !se) return xe(e), null
						} else 2 * Ae() - a.renderingStartTime > Gr && n !== 536870912 && (e.flags |= 128, i = !0, Hu(a, !1), e.lanes = 4194304);
					a.isBackwards ? (r.sibling = e.child, e.child = r) : (t = a.last, t !== null ? t.sibling = r : e.child = r, a.last = r)
				}
				return a.tail !== null ? (t = a.tail, a.rendering = t, a.tail = t.sibling, a.renderingStartTime = Ae(), t.sibling = null, n = Je.current, k(Je, i ? n & 1 | 2 : n & 1), se && Xa(e, a.treeForkCount), t) : (xe(e), null);
			case 22:
			case 23:
				return qn(e), ko(), a = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== a && (e.flags |= 8192) : a && (e.flags |= 8192), a ? (n & 536870912) !== 0 && (e.flags & 128) === 0 && (xe(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : xe(e), n = e.updateQueue, n !== null && Hr(e, n.retryQueue), n = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), a = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (a = e.memoizedState.cachePool.pool), a !== n && (e.flags |= 2048), t !== null && L(il), null;
			case 24:
				return n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), qa(Ie), xe(e), null;
			case 25:
				return null;
			case 30:
				return null
		}
		throw Error(B(156, e.tag))
	}

	function ev(t, e) {
		switch (Bo(e), e.tag) {
			case 1:
				return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
			case 3:
				return qa(Ie), Zt(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
			case 26:
			case 27:
			case 5:
				return Le(e), null;
			case 31:
				if (e.memoizedState !== null) {
					if (qn(e), e.alternate === null) throw Error(B(340));
					el()
				}
				return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
			case 13:
				if (qn(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
					if (e.alternate === null) throw Error(B(340));
					el()
				}
				return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
			case 19:
				return L(Je), null;
			case 4:
				return Zt(), null;
			case 10:
				return qa(e.type), null;
			case 22:
			case 23:
				return qn(e), ko(), t !== null && L(il), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
			case 24:
				return qa(Ie), null;
			case 25:
				return null;
			default:
				return null
		}
	}

	function ks(t, e) {
		switch (Bo(e), e.tag) {
			case 3:
				qa(Ie), Zt();
				break;
			case 26:
			case 27:
			case 5:
				Le(e);
				break;
			case 4:
				Zt();
				break;
			case 31:
				e.memoizedState !== null && qn(e);
				break;
			case 13:
				qn(e);
				break;
			case 19:
				L(Je);
				break;
			case 10:
				qa(e.type);
				break;
			case 22:
			case 23:
				qn(e), ko(), t !== null && L(il);
				break;
			case 24:
				qa(Ie)
		}
	}

	function Vu(t, e) {
		try {
			var n = e.updateQueue,
				a = n !== null ? n.lastEffect : null;
			if (a !== null) {
				var i = a.next;
				n = i;
				do {
					if ((n.tag & t) === t) {
						a = void 0;
						var r = n.create,
							s = n.inst;
						a = r(), s.destroy = a
					}
					n = n.next
				} while (n !== i)
			}
		} catch (v) {
			Ce(e, e.return, v)
		}
	}

	function Oi(t, e, n) {
		try {
			var a = e.updateQueue,
				i = a !== null ? a.lastEffect : null;
			if (i !== null) {
				var r = i.next;
				a = r;
				do {
					if ((a.tag & t) === t) {
						var s = a.inst,
							v = s.destroy;
						if (v !== void 0) {
							s.destroy = void 0, i = e;
							var b = n,
								j = v;
							try {
								j()
							} catch (Q) {
								Ce(i, b, Q)
							}
						}
					}
					a = a.next
				} while (a !== r)
			}
		} catch (Q) {
			Ce(e, e.return, Q)
		}
	}

	function $s(t) {
		var e = t.updateQueue;
		if (e !== null) {
			var n = t.stateNode;
			try {
				Gf(e, n)
			} catch (a) {
				Ce(t, t.return, a)
			}
		}
	}

	function Ps(t, e, n) {
		n.props = cl(t.type, t.memoizedProps), n.state = t.memoizedState;
		try {
			n.componentWillUnmount()
		} catch (a) {
			Ce(t, e, a)
		}
	}

	function xu(t, e) {
		try {
			var n = t.ref;
			if (n !== null) {
				switch (t.tag) {
					case 26:
					case 27:
					case 5:
						var a = t.stateNode;
						break;
					case 30:
						a = t.stateNode;
						break;
					default:
						a = t.stateNode
				}
				typeof n == "function" ? t.refCleanup = n(a) : n.current = a
			}
		} catch (i) {
			Ce(t, e, i)
		}
	}

	function za(t, e) {
		var n = t.ref,
			a = t.refCleanup;
		if (n !== null)
			if (typeof a == "function") try {
				a()
			} catch (i) {
				Ce(t, e, i)
			} finally {
				t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null)
			} else if (typeof n == "function") try {
				n(null)
			} catch (i) {
				Ce(t, e, i)
			} else n.current = null
	}

	function th(t) {
		var e = t.type,
			n = t.memoizedProps,
			a = t.stateNode;
		try {
			t: switch (e) {
				case "button":
				case "input":
				case "select":
				case "textarea":
					n.autoFocus && a.focus();
					break t;
				case "img":
					n.src ? a.src = n.src : n.srcSet && (a.srcset = n.srcSet)
			}
		}
		catch (i) {
			Ce(t, t.return, i)
		}
	}

	function Rc(t, e, n) {
		try {
			var a = t.stateNode;
			wv(a, t.type, n, e), a[sn] = e
		} catch (i) {
			Ce(t, t.return, i)
		}
	}

	function eh(t) {
		return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && Ni(t.type) || t.tag === 4
	}

	function zc(t) {
		t: for (;;) {
			for (; t.sibling === null;) {
				if (t.return === null || eh(t.return)) return null;
				t = t.return
			}
			for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18;) {
				if (t.tag === 27 && Ni(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
				t.child.return = t, t = t.child
			}
			if (!(t.flags & 2)) return t.stateNode
		}
	}

	function Dc(t, e, n) {
		var a = t.tag;
		if (a === 5 || a === 6) t = t.stateNode, e ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(t, e) : (e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, e.appendChild(t), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = ta));
		else if (a !== 4 && (a === 27 && Ni(t.type) && (n = t.stateNode, e = null), t = t.child, t !== null))
			for (Dc(t, e, n), t = t.sibling; t !== null;) Dc(t, e, n), t = t.sibling
	}

	function Vr(t, e, n) {
		var a = t.tag;
		if (a === 5 || a === 6) t = t.stateNode, e ? n.insertBefore(t, e) : n.appendChild(t);
		else if (a !== 4 && (a === 27 && Ni(t.type) && (n = t.stateNode), t = t.child, t !== null))
			for (Vr(t, e, n), t = t.sibling; t !== null;) Vr(t, e, n), t = t.sibling
	}

	function nh(t) {
		var e = t.stateNode,
			n = t.memoizedProps;
		try {
			for (var a = t.type, i = e.attributes; i.length;) e.removeAttributeNode(i[0]);
			yn(e, a, n), e[Be] = t, e[sn] = n
		} catch (r) {
			Ce(t, t.return, r)
		}
	}
	var Ja = !1,
		Pe = !1,
		Uc = !1,
		ah = typeof WeakSet == "function" ? WeakSet : Set,
		rn = null;

	function nv(t, e) {
		if (t = t.containerInfo, Pc = lo, t = C(t), lt(t)) {
			if ("selectionStart" in t) var n = {
				start: t.selectionStart,
				end: t.selectionEnd
			};
			else t: {
				n = (n = t.ownerDocument) && n.defaultView || window;
				var a = n.getSelection && n.getSelection();
				if (a && a.rangeCount !== 0) {
					n = a.anchorNode;
					var i = a.anchorOffset,
						r = a.focusNode;
					a = a.focusOffset;
					try {
						n.nodeType, r.nodeType
					} catch {
						n = null;
						break t
					}
					var s = 0,
						v = -1,
						b = -1,
						j = 0,
						Q = 0,
						J = t,
						H = null;
					e: for (;;) {
						for (var X; J !== n || i !== 0 && J.nodeType !== 3 || (v = s + i), J !== r || a !== 0 && J.nodeType !== 3 || (b = s + a), J.nodeType === 3 && (s += J.nodeValue.length), (X = J.firstChild) !== null;) H = J, J = X;
						for (;;) {
							if (J === t) break e;
							if (H === n && ++j === i && (v = s), H === r && ++Q === a && (b = s), (X = J.nextSibling) !== null) break;
							J = H, H = J.parentNode
						}
						J = X
					}
					n = v === -1 || b === -1 ? null : {
						start: v,
						end: b
					}
				} else n = null
			}
			n = n || {
				start: 0,
				end: 0
			}
		} else n = null;
		for (tf = {
				focusedElem: t,
				selectionRange: n
			}, lo = !1, rn = e; rn !== null;)
			if (e = rn, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null) t.return = e, rn = t;
			else
				for (; rn !== null;) {
					switch (e = rn, r = e.alternate, t = e.flags, e.tag) {
						case 0:
							if ((t & 4) !== 0 && (t = e.updateQueue, t = t !== null ? t.events : null, t !== null))
								for (n = 0; n < t.length; n++) i = t[n], i.ref.impl = i.nextImpl;
							break;
						case 11:
						case 15:
							break;
						case 1:
							if ((t & 1024) !== 0 && r !== null) {
								t = void 0, n = e, i = r.memoizedProps, r = r.memoizedState, a = n.stateNode;
								try {
									var At = cl(n.type, i);
									t = a.getSnapshotBeforeUpdate(At, r), a.__reactInternalSnapshotBeforeUpdate = t
								} catch (Lt) {
									Ce(n, n.return, Lt)
								}
							}
							break;
						case 3:
							if ((t & 1024) !== 0) {
								if (t = e.stateNode.containerInfo, n = t.nodeType, n === 9) af(t);
								else if (n === 1) switch (t.nodeName) {
									case "HEAD":
									case "HTML":
									case "BODY":
										af(t);
										break;
									default:
										t.textContent = ""
								}
							}
							break;
						case 5:
						case 26:
						case 27:
						case 6:
						case 4:
						case 17:
							break;
						default:
							if ((t & 1024) !== 0) throw Error(B(163))
					}
					if (t = e.sibling, t !== null) {
						t.return = e.return, rn = t;
						break
					}
					rn = e.return
				}
	}

	function ih(t, e, n) {
		var a = n.flags;
		switch (n.tag) {
			case 0:
			case 11:
			case 15:
				Ia(t, n), a & 4 && Vu(5, n);
				break;
			case 1:
				if (Ia(t, n), a & 4)
					if (t = n.stateNode, e === null) try {
						t.componentDidMount()
					} catch (s) {
						Ce(n, n.return, s)
					} else {
						var i = cl(n.type, e.memoizedProps);
						e = e.memoizedState;
						try {
							t.componentDidUpdate(i, e, t.__reactInternalSnapshotBeforeUpdate)
						} catch (s) {
							Ce(n, n.return, s)
						}
					}
				a & 64 && $s(n), a & 512 && xu(n, n.return);
				break;
			case 3:
				if (Ia(t, n), a & 64 && (t = n.updateQueue, t !== null)) {
					if (e = null, n.child !== null) switch (n.child.tag) {
						case 27:
						case 5:
							e = n.child.stateNode;
							break;
						case 1:
							e = n.child.stateNode
					}
					try {
						Gf(t, e)
					} catch (s) {
						Ce(n, n.return, s)
					}
				}
				break;
			case 27:
				e === null && a & 4 && nh(n);
			case 26:
			case 5:
				Ia(t, n), e === null && a & 4 && th(n), a & 512 && xu(n, n.return);
				break;
			case 12:
				Ia(t, n);
				break;
			case 31:
				Ia(t, n), a & 4 && rh(t, n);
				break;
			case 13:
				Ia(t, n), a & 4 && oh(t, n), a & 64 && (t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null && (n = sv.bind(null, n), Dv(t, n))));
				break;
			case 22:
				if (a = n.memoizedState !== null || Ja, !a) {
					e = e !== null && e.memoizedState !== null || Pe, i = Ja;
					var r = Pe;
					Ja = a, (Pe = e) && !r ? ka(t, n, (n.subtreeFlags & 8772) !== 0) : Ia(t, n), Ja = i, Pe = r
				}
				break;
			case 30:
				break;
			default:
				Ia(t, n)
		}
	}

	function lh(t) {
		var e = t.alternate;
		e !== null && (t.alternate = null, lh(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Jn(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null
	}
	var Ye = null,
		Ln = !1;

	function Wa(t, e, n) {
		for (n = n.child; n !== null;) uh(t, e, n), n = n.sibling
	}

	function uh(t, e, n) {
		if (Et && typeof Et.onCommitFiberUnmount == "function") try {
			Et.onCommitFiberUnmount(St, n)
		} catch {}
		switch (n.tag) {
			case 26:
				Pe || za(n, e), Wa(t, e, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
				break;
			case 27:
				Pe || za(n, e);
				var a = Ye,
					i = Ln;
				Ni(n.type) && (Ye = n.stateNode, Ln = !1), Wa(t, e, n), Ju(n.stateNode), Ye = a, Ln = i;
				break;
			case 5:
				Pe || za(n, e);
			case 6:
				if (a = Ye, i = Ln, Ye = null, Wa(t, e, n), Ye = a, Ln = i, Ye !== null)
					if (Ln) try {
						(Ye.nodeType === 9 ? Ye.body : Ye.nodeName === "HTML" ? Ye.ownerDocument.body : Ye).removeChild(n.stateNode)
					} catch (r) {
						Ce(n, e, r)
					} else try {
						Ye.removeChild(n.stateNode)
					} catch (r) {
						Ce(n, e, r)
					}
				break;
			case 18:
				Ye !== null && (Ln ? (t = Ye, $h(t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, n.stateNode), nu(t)) : $h(Ye, n.stateNode));
				break;
			case 4:
				a = Ye, i = Ln, Ye = n.stateNode.containerInfo, Ln = !0, Wa(t, e, n), Ye = a, Ln = i;
				break;
			case 0:
			case 11:
			case 14:
			case 15:
				Oi(2, n, e), Pe || Oi(4, n, e), Wa(t, e, n);
				break;
			case 1:
				Pe || (za(n, e), a = n.stateNode, typeof a.componentWillUnmount == "function" && Ps(n, e, a)), Wa(t, e, n);
				break;
			case 21:
				Wa(t, e, n);
				break;
			case 22:
				Pe = (a = Pe) || n.memoizedState !== null, Wa(t, e, n), Pe = a;
				break;
			default:
				Wa(t, e, n)
		}
	}

	function rh(t, e) {
		if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
			t = t.dehydrated;
			try {
				nu(t)
			} catch (n) {
				Ce(e, e.return, n)
			}
		}
	}

	function oh(t, e) {
		if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null)))) try {
			nu(t)
		} catch (n) {
			Ce(e, e.return, n)
		}
	}

	function av(t) {
		switch (t.tag) {
			case 31:
			case 13:
			case 19:
				var e = t.stateNode;
				return e === null && (e = t.stateNode = new ah), e;
			case 22:
				return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new ah), e;
			default:
				throw Error(B(435, t.tag))
		}
	}

	function xr(t, e) {
		var n = av(t);
		e.forEach(function(a) {
			if (!n.has(a)) {
				n.add(a);
				var i = hv.bind(null, t, a);
				a.then(i, i)
			}
		})
	}

	function Nn(t, e) {
		var n = e.deletions;
		if (n !== null)
			for (var a = 0; a < n.length; a++) {
				var i = n[a],
					r = t,
					s = e,
					v = s;
				t: for (; v !== null;) {
					switch (v.tag) {
						case 27:
							if (Ni(v.type)) {
								Ye = v.stateNode, Ln = !1;
								break t
							}
							break;
						case 5:
							Ye = v.stateNode, Ln = !1;
							break t;
						case 3:
						case 4:
							Ye = v.stateNode.containerInfo, Ln = !0;
							break t
					}
					v = v.return
				}
				if (Ye === null) throw Error(B(160));
				uh(r, s, i), Ye = null, Ln = !1, r = i.alternate, r !== null && (r.return = null), i.return = null
			}
		if (e.subtreeFlags & 13886)
			for (e = e.child; e !== null;) ch(e, t), e = e.sibling
	}
	var ya = null;

	function ch(t, e) {
		var n = t.alternate,
			a = t.flags;
		switch (t.tag) {
			case 0:
			case 11:
			case 14:
			case 15:
				Nn(e, t), Bn(t), a & 4 && (Oi(3, t, t.return), Vu(3, t), Oi(5, t, t.return));
				break;
			case 1:
				Nn(e, t), Bn(t), a & 512 && (Pe || n === null || za(n, n.return)), a & 64 && Ja && (t = t.updateQueue, t !== null && (a = t.callbacks, a !== null && (n = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = n === null ? a : n.concat(a))));
				break;
			case 26:
				var i = ya;
				if (Nn(e, t), Bn(t), a & 512 && (Pe || n === null || za(n, n.return)), a & 4) {
					var r = n !== null ? n.memoizedState : null;
					if (a = t.memoizedState, n === null)
						if (a === null)
							if (t.stateNode === null) {
								t: {
									a = t.type,
									n = t.memoizedProps,
									i = i.ownerDocument || i;e: switch (a) {
										case "title":
											r = i.getElementsByTagName("title")[0], (!r || r[li] || r[Be] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = i.createElement(a), i.head.insertBefore(r, i.querySelector("head > title"))), yn(r, a, n), r[Be] = t, Fe(r), a = r;
											break t;
										case "link":
											var s = cd("link", "href", i).get(a + (n.href || ""));
											if (s) {
												for (var v = 0; v < s.length; v++)
													if (r = s[v], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
														s.splice(v, 1);
														break e
													}
											}
											r = i.createElement(a), yn(r, a, n), i.head.appendChild(r);
											break;
										case "meta":
											if (s = cd("meta", "content", i).get(a + (n.content || ""))) {
												for (v = 0; v < s.length; v++)
													if (r = s[v], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
														s.splice(v, 1);
														break e
													}
											}
											r = i.createElement(a), yn(r, a, n), i.head.appendChild(r);
											break;
										default:
											throw Error(B(468, a))
									}
									r[Be] = t,
									Fe(r),
									a = r
								}
								t.stateNode = a
							}
					else fd(i, t.type, t.stateNode);
					else t.stateNode = od(i, a, t.memoizedProps);
					else r !== a ? (r === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : r.count--, a === null ? fd(i, t.type, t.stateNode) : od(i, a, t.memoizedProps)) : a === null && t.stateNode !== null && Rc(t, t.memoizedProps, n.memoizedProps)
				}
				break;
			case 27:
				Nn(e, t), Bn(t), a & 512 && (Pe || n === null || za(n, n.return)), n !== null && a & 4 && Rc(t, t.memoizedProps, n.memoizedProps);
				break;
			case 5:
				if (Nn(e, t), Bn(t), a & 512 && (Pe || n === null || za(n, n.return)), t.flags & 32) {
					i = t.stateNode;
					try {
						Pn(i, "")
					} catch (At) {
						Ce(t, t.return, At)
					}
				}
				a & 4 && t.stateNode != null && (i = t.memoizedProps, Rc(t, i, n !== null ? n.memoizedProps : i)), a & 1024 && (Uc = !0);
				break;
			case 6:
				if (Nn(e, t), Bn(t), a & 4) {
					if (t.stateNode === null) throw Error(B(162));
					a = t.memoizedProps, n = t.stateNode;
					try {
						n.nodeValue = a
					} catch (At) {
						Ce(t, t.return, At)
					}
				}
				break;
			case 3:
				if (eo = null, i = ya, ya = Pr(e.containerInfo), Nn(e, t), ya = i, Bn(t), a & 4 && n !== null && n.memoizedState.isDehydrated) try {
					nu(e.containerInfo)
				} catch (At) {
					Ce(t, t.return, At)
				}
				Uc && (Uc = !1, fh(t));
				break;
			case 4:
				a = ya, ya = Pr(t.stateNode.containerInfo), Nn(e, t), Bn(t), ya = a;
				break;
			case 12:
				Nn(e, t), Bn(t);
				break;
			case 31:
				Nn(e, t), Bn(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, xr(t, a)));
				break;
			case 13:
				Nn(e, t), Bn(t), t.child.flags & 8192 && t.memoizedState !== null != (n !== null && n.memoizedState !== null) && (Xr = Ae()), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, xr(t, a)));
				break;
			case 22:
				i = t.memoizedState !== null;
				var b = n !== null && n.memoizedState !== null,
					j = Ja,
					Q = Pe;
				if (Ja = j || i, Pe = Q || b, Nn(e, t), Pe = Q, Ja = j, Bn(t), a & 8192) t: for (e = t.stateNode, e._visibility = i ? e._visibility & -2 : e._visibility | 1, i && (n === null || b || Ja || Pe || fl(t)), n = null, e = t;;) {
					if (e.tag === 5 || e.tag === 26) {
						if (n === null) {
							b = n = e;
							try {
								if (r = b.stateNode, i) s = r.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
								else {
									v = b.stateNode;
									var J = b.memoizedProps.style,
										H = J != null && J.hasOwnProperty("display") ? J.display : null;
									v.style.display = H == null || typeof H == "boolean" ? "" : ("" + H).trim()
								}
							} catch (At) {
								Ce(b, b.return, At)
							}
						}
					} else if (e.tag === 6) {
						if (n === null) {
							b = e;
							try {
								b.stateNode.nodeValue = i ? "" : b.memoizedProps
							} catch (At) {
								Ce(b, b.return, At)
							}
						}
					} else if (e.tag === 18) {
						if (n === null) {
							b = e;
							try {
								var X = b.stateNode;
								i ? Ph(X, !0) : Ph(b.stateNode, !1)
							} catch (At) {
								Ce(b, b.return, At)
							}
						}
					} else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === t) && e.child !== null) {
						e.child.return = e, e = e.child;
						continue
					}
					if (e === t) break t;
					for (; e.sibling === null;) {
						if (e.return === null || e.return === t) break t;
						n === e && (n = null), e = e.return
					}
					n === e && (n = null), e.sibling.return = e.return, e = e.sibling
				}
				a & 4 && (a = t.updateQueue, a !== null && (n = a.retryQueue, n !== null && (a.retryQueue = null, xr(t, n))));
				break;
			case 19:
				Nn(e, t), Bn(t), a & 4 && (a = t.updateQueue, a !== null && (t.updateQueue = null, xr(t, a)));
				break;
			case 30:
				break;
			case 21:
				break;
			default:
				Nn(e, t), Bn(t)
		}
	}

	function Bn(t) {
		var e = t.flags;
		if (e & 2) {
			try {
				for (var n, a = t.return; a !== null;) {
					if (eh(a)) {
						n = a;
						break
					}
					a = a.return
				}
				if (n == null) throw Error(B(160));
				switch (n.tag) {
					case 27:
						var i = n.stateNode,
							r = zc(t);
						Vr(t, r, i);
						break;
					case 5:
						var s = n.stateNode;
						n.flags & 32 && (Pn(s, ""), n.flags &= -33);
						var v = zc(t);
						Vr(t, v, s);
						break;
					case 3:
					case 4:
						var b = n.stateNode.containerInfo,
							j = zc(t);
						Dc(t, j, b);
						break;
					default:
						throw Error(B(161))
				}
			} catch (Q) {
				Ce(t, t.return, Q)
			}
			t.flags &= -3
		}
		e & 4096 && (t.flags &= -4097)
	}

	function fh(t) {
		if (t.subtreeFlags & 1024)
			for (t = t.child; t !== null;) {
				var e = t;
				fh(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling
			}
	}

	function Ia(t, e) {
		if (e.subtreeFlags & 8772)
			for (e = e.child; e !== null;) ih(t, e.alternate, e), e = e.sibling
	}

	function fl(t) {
		for (t = t.child; t !== null;) {
			var e = t;
			switch (e.tag) {
				case 0:
				case 11:
				case 14:
				case 15:
					Oi(4, e, e.return), fl(e);
					break;
				case 1:
					za(e, e.return);
					var n = e.stateNode;
					typeof n.componentWillUnmount == "function" && Ps(e, e.return, n), fl(e);
					break;
				case 27:
					Ju(e.stateNode);
				case 26:
				case 5:
					za(e, e.return), fl(e);
					break;
				case 22:
					e.memoizedState === null && fl(e);
					break;
				case 30:
					fl(e);
					break;
				default:
					fl(e)
			}
			t = t.sibling
		}
	}

	function ka(t, e, n) {
		for (n = n && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null;) {
			var a = e.alternate,
				i = t,
				r = e,
				s = r.flags;
			switch (r.tag) {
				case 0:
				case 11:
				case 15:
					ka(i, r, n), Vu(4, r);
					break;
				case 1:
					if (ka(i, r, n), a = r, i = a.stateNode, typeof i.componentDidMount == "function") try {
						i.componentDidMount()
					} catch (j) {
						Ce(a, a.return, j)
					}
					if (a = r, i = a.updateQueue, i !== null) {
						var v = a.stateNode;
						try {
							var b = i.shared.hiddenCallbacks;
							if (b !== null)
								for (i.shared.hiddenCallbacks = null, i = 0; i < b.length; i++) Xf(b[i], v)
						} catch (j) {
							Ce(a, a.return, j)
						}
					}
					n && s & 64 && $s(r), xu(r, r.return);
					break;
				case 27:
					nh(r);
				case 26:
				case 5:
					ka(i, r, n), n && a === null && s & 4 && th(r), xu(r, r.return);
					break;
				case 12:
					ka(i, r, n);
					break;
				case 31:
					ka(i, r, n), n && s & 4 && rh(i, r);
					break;
				case 13:
					ka(i, r, n), n && s & 4 && oh(i, r);
					break;
				case 22:
					r.memoizedState === null && ka(i, r, n), xu(r, r.return);
					break;
				case 30:
					break;
				default:
					ka(i, r, n)
			}
			e = e.sibling
		}
	}

	function jc(t, e) {
		var n = null;
		t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== n && (t != null && t.refCount++, n != null && Mu(n))
	}

	function Lc(t, e) {
		t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Mu(t))
	}

	function ga(t, e, n, a) {
		if (e.subtreeFlags & 10256)
			for (e = e.child; e !== null;) sh(t, e, n, a), e = e.sibling
	}

	function sh(t, e, n, a) {
		var i = e.flags;
		switch (e.tag) {
			case 0:
			case 11:
			case 15:
				ga(t, e, n, a), i & 2048 && Vu(9, e);
				break;
			case 1:
				ga(t, e, n, a);
				break;
			case 3:
				ga(t, e, n, a), i & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Mu(t)));
				break;
			case 12:
				if (i & 2048) {
					ga(t, e, n, a), t = e.stateNode;
					try {
						var r = e.memoizedProps,
							s = r.id,
							v = r.onPostCommit;
						typeof v == "function" && v(s, e.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0)
					} catch (b) {
						Ce(e, e.return, b)
					}
				} else ga(t, e, n, a);
				break;
			case 31:
				ga(t, e, n, a);
				break;
			case 13:
				ga(t, e, n, a);
				break;
			case 23:
				break;
			case 22:
				r = e.stateNode, s = e.alternate, e.memoizedState !== null ? r._visibility & 2 ? ga(t, e, n, a) : Yu(t, e) : r._visibility & 2 ? ga(t, e, n, a) : (r._visibility |= 2, Zl(t, e, n, a, (e.subtreeFlags & 10256) !== 0 || !1)), i & 2048 && jc(s, e);
				break;
			case 24:
				ga(t, e, n, a), i & 2048 && Lc(e.alternate, e);
				break;
			default:
				ga(t, e, n, a)
		}
	}

	function Zl(t, e, n, a, i) {
		for (i = i && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null;) {
			var r = t,
				s = e,
				v = n,
				b = a,
				j = s.flags;
			switch (s.tag) {
				case 0:
				case 11:
				case 15:
					Zl(r, s, v, b, i), Vu(8, s);
					break;
				case 23:
					break;
				case 22:
					var Q = s.stateNode;
					s.memoizedState !== null ? Q._visibility & 2 ? Zl(r, s, v, b, i) : Yu(r, s) : (Q._visibility |= 2, Zl(r, s, v, b, i)), i && j & 2048 && jc(s.alternate, s);
					break;
				case 24:
					Zl(r, s, v, b, i), i && j & 2048 && Lc(s.alternate, s);
					break;
				default:
					Zl(r, s, v, b, i)
			}
			e = e.sibling
		}
	}

	function Yu(t, e) {
		if (e.subtreeFlags & 10256)
			for (e = e.child; e !== null;) {
				var n = t,
					a = e,
					i = a.flags;
				switch (a.tag) {
					case 22:
						Yu(n, a), i & 2048 && jc(a.alternate, a);
						break;
					case 24:
						Yu(n, a), i & 2048 && Lc(a.alternate, a);
						break;
					default:
						Yu(n, a)
				}
				e = e.sibling
			}
	}
	var Xu = 8192;

	function Fl(t, e, n) {
		if (t.subtreeFlags & Xu)
			for (t = t.child; t !== null;) hh(t, e, n), t = t.sibling
	}

	function hh(t, e, n) {
		switch (t.tag) {
			case 26:
				Fl(t, e, n), t.flags & Xu && t.memoizedState !== null && qv(n, ya, t.memoizedState, t.memoizedProps);
				break;
			case 5:
				Fl(t, e, n);
				break;
			case 3:
			case 4:
				var a = ya;
				ya = Pr(t.stateNode.containerInfo), Fl(t, e, n), ya = a;
				break;
			case 22:
				t.memoizedState === null && (a = t.alternate, a !== null && a.memoizedState !== null ? (a = Xu, Xu = 16777216, Fl(t, e, n), Xu = a) : Fl(t, e, n));
				break;
			default:
				Fl(t, e, n)
		}
	}

	function dh(t) {
		var e = t.alternate;
		if (e !== null && (t = e.child, t !== null)) {
			e.child = null;
			do e = t.sibling, t.sibling = null, t = e; while (t !== null)
		}
	}

	function Gu(t) {
		var e = t.deletions;
		if ((t.flags & 16) !== 0) {
			if (e !== null)
				for (var n = 0; n < e.length; n++) {
					var a = e[n];
					rn = a, mh(a, t)
				}
			dh(t)
		}
		if (t.subtreeFlags & 10256)
			for (t = t.child; t !== null;) vh(t), t = t.sibling
	}

	function vh(t) {
		switch (t.tag) {
			case 0:
			case 11:
			case 15:
				Gu(t), t.flags & 2048 && Oi(9, t, t.return);
				break;
			case 3:
				Gu(t);
				break;
			case 12:
				Gu(t);
				break;
			case 22:
				var e = t.stateNode;
				t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, Yr(t)) : Gu(t);
				break;
			default:
				Gu(t)
		}
	}

	function Yr(t) {
		var e = t.deletions;
		if ((t.flags & 16) !== 0) {
			if (e !== null)
				for (var n = 0; n < e.length; n++) {
					var a = e[n];
					rn = a, mh(a, t)
				}
			dh(t)
		}
		for (t = t.child; t !== null;) {
			switch (e = t, e.tag) {
				case 0:
				case 11:
				case 15:
					Oi(8, e, e.return), Yr(e);
					break;
				case 22:
					n = e.stateNode, n._visibility & 2 && (n._visibility &= -3, Yr(e));
					break;
				default:
					Yr(e)
			}
			t = t.sibling
		}
	}

	function mh(t, e) {
		for (; rn !== null;) {
			var n = rn;
			switch (n.tag) {
				case 0:
				case 11:
				case 15:
					Oi(8, n, e);
					break;
				case 23:
				case 22:
					if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
						var a = n.memoizedState.cachePool.pool;
						a != null && a.refCount++
					}
					break;
				case 24:
					Mu(n.memoizedState.cache)
			}
			if (a = n.child, a !== null) a.return = n, rn = a;
			else t: for (n = t; rn !== null;) {
				a = rn;
				var i = a.sibling,
					r = a.return;
				if (lh(a), a === n) {
					rn = null;
					break t
				}
				if (i !== null) {
					i.return = r, rn = i;
					break t
				}
				rn = r
			}
		}
	}
	var iv = {
			getCacheForType: function(t) {
				var e = mn(Ie),
					n = e.data.get(t);
				return n === void 0 && (n = t(), e.data.set(t, n)), n
			},
			cacheSignal: function() {
				return mn(Ie).controller.signal
			}
		},
		lv = typeof WeakMap == "function" ? WeakMap : Map,
		be = 0,
		je = null,
		le = null,
		ce = 0,
		Te = 0,
		Qn = null,
		Ri = !1,
		Kl = !1,
		Nc = !1,
		$a = 0,
		qe = 0,
		zi = 0,
		sl = 0,
		Bc = 0,
		Zn = 0,
		Jl = 0,
		qu = null,
		Hn = null,
		Hc = !1,
		Xr = 0,
		ph = 0,
		Gr = 1 / 0,
		qr = null,
		Di = null,
		ln = 0,
		Ui = null,
		Wl = null,
		Pa = 0,
		Vc = 0,
		xc = null,
		yh = null,
		Qu = 0,
		Yc = null;

	function Fn() {
		return (be & 2) !== 0 && ce !== 0 ? ce & -ce : _.T !== null ? Fc() : vl()
	}

	function gh() {
		if (Zn === 0)
			if ((ce & 536870912) === 0 || se) {
				var t = cn;
				cn <<= 1, (cn & 3932160) === 0 && (cn = 262144), Zn = t
			} else Zn = 536870912;
		return t = Gn.current, t !== null && (t.flags |= 32), Zn
	}

	function Vn(t, e, n) {
		(t === je && (Te === 2 || Te === 9) || t.cancelPendingCommit !== null) && (Il(t, 0), ji(t, ce, Zn, !1)), Jt(t, n), ((be & 2) === 0 || t !== je) && (t === je && ((be & 2) === 0 && (sl |= n), qe === 4 && ji(t, ce, Zn, !1)), Da(t))
	}

	function bh(t, e, n) {
		if ((be & 6) !== 0) throw Error(B(327));
		var a = !n && (e & 127) === 0 && (e & t.expiredLanes) === 0 || zn(t, e),
			i = a ? ov(t, e) : Gc(t, e, !0),
			r = a;
		do {
			if (i === 0) {
				Kl && !a && ji(t, e, 0, !1);
				break
			} else {
				if (n = t.current.alternate, r && !uv(n)) {
					i = Gc(t, e, !1), r = !1;
					continue
				}
				if (i === 2) {
					if (r = e, t.errorRecoveryDisabledLanes & r) var s = 0;
					else s = t.pendingLanes & -536870913, s = s !== 0 ? s : s & 536870912 ? 536870912 : 0;
					if (s !== 0) {
						e = s;
						t: {
							var v = t;i = qu;
							var b = v.current.memoizedState.isDehydrated;
							if (b && (Il(v, s).flags |= 256), s = Gc(v, s, !1), s !== 2) {
								if (Nc && !b) {
									v.errorRecoveryDisabledLanes |= r, sl |= r, i = 4;
									break t
								}
								r = Hn, Hn = i, r !== null && (Hn === null ? Hn = r : Hn.push.apply(Hn, r))
							}
							i = s
						}
						if (r = !1, i !== 2) continue
					}
				}
				if (i === 1) {
					Il(t, 0), ji(t, e, 0, !0);
					break
				}
				t: {
					switch (a = t, r = i, r) {
						case 0:
						case 1:
							throw Error(B(345));
						case 4:
							if ((e & 4194048) !== e) break;
						case 6:
							ji(a, e, Zn, !Ri);
							break t;
						case 2:
							Hn = null;
							break;
						case 3:
						case 5:
							break;
						default:
							throw Error(B(329))
					}
					if ((e & 62914560) === e && (i = Xr + 300 - Ae(), 10 < i)) {
						if (ji(a, e, Zn, !Ri), fn(a, 0, !0) !== 0) break t;
						Pa = e, a.timeoutHandle = Ih(_h.bind(null, a, n, Hn, qr, Hc, e, Zn, sl, Jl, Ri, r, "Throttled", -0, 0), i);
						break t
					}
					_h(a, n, Hn, qr, Hc, e, Zn, sl, Jl, Ri, r, null, -0, 0)
				}
			}
			break
		} while (!0);
		Da(t)
	}

	function _h(t, e, n, a, i, r, s, v, b, j, Q, J, H, X) {
		if (t.timeoutHandle = -1, J = e.subtreeFlags, J & 8192 || (J & 16785408) === 16785408) {
			J = {
				stylesheets: null,
				count: 0,
				imgCount: 0,
				imgBytes: 0,
				suspenseyImages: [],
				waitingForImages: !0,
				waitingForViewTransition: !1,
				unsuspend: ta
			}, hh(e, r, J);
			var At = (r & 62914560) === r ? Xr - Ae() : (r & 4194048) === r ? ph - Ae() : 0;
			if (At = Qv(J, At), At !== null) {
				Pa = r, t.cancelPendingCommit = At(Oh.bind(null, t, e, r, n, a, i, s, v, b, Q, J, null, H, X)), ji(t, r, s, !j);
				return
			}
		}
		Oh(t, e, r, n, a, i, s, v, b)
	}

	function uv(t) {
		for (var e = t;;) {
			var n = e.tag;
			if ((n === 0 || n === 11 || n === 15) && e.flags & 16384 && (n = e.updateQueue, n !== null && (n = n.stores, n !== null)))
				for (var a = 0; a < n.length; a++) {
					var i = n[a],
						r = i.getSnapshot;
					i = i.value;
					try {
						if (!N(r(), i)) return !1
					} catch {
						return !1
					}
				}
			if (n = e.child, e.subtreeFlags & 16384 && n !== null) n.return = e, e = n;
			else {
				if (e === t) break;
				for (; e.sibling === null;) {
					if (e.return === null || e.return === t) return !0;
					e = e.return
				}
				e.sibling.return = e.return, e = e.sibling
			}
		}
		return !0
	}

	function ji(t, e, n, a) {
		e &= ~Bc, e &= ~sl, t.suspendedLanes |= e, t.pingedLanes &= ~e, a && (t.warmLanes |= e), a = t.expirationTimes;
		for (var i = e; 0 < i;) {
			var r = 31 - Tt(i),
				s = 1 << r;
			a[r] = -1, i &= ~s
		}
		n !== 0 && ni(t, n, e)
	}

	function Qr() {
		return (be & 6) === 0 ? (Zu(0), !1) : !0
	}

	function Xc() {
		if (le !== null) {
			if (Te === 0) var t = le.return;
			else t = le, Ga = nl = null, ac(t), Yl = null, Cu = 0, t = le;
			for (; t !== null;) ks(t.alternate, t), t = t.return;
			le = null
		}
	}

	function Il(t, e) {
		var n = t.timeoutHandle;
		n !== -1 && (t.timeoutHandle = -1, Tv(n)), n = t.cancelPendingCommit, n !== null && (t.cancelPendingCommit = null, n()), Pa = 0, Xc(), je = t, le = n = Ya(t.current, null), ce = e, Te = 0, Qn = null, Ri = !1, Kl = zn(t, e), Nc = !1, Jl = Zn = Bc = sl = zi = qe = 0, Hn = qu = null, Hc = !1, (e & 8) !== 0 && (e |= e & 32);
		var a = t.entangledLanes;
		if (a !== 0)
			for (t = t.entanglements, a &= e; 0 < a;) {
				var i = 31 - Tt(a),
					r = 1 << i;
				e |= t[i], a &= ~r
			}
		return $a = e, Ta(), n
	}

	function Ah(t, e) {
		Kt = null, _.H = Nu, e === xl || e === br ? (e = Hf(), Te = 3) : e === Zo ? (e = Hf(), Te = 4) : Te = e === bc ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, Qn = e, le === null && (qe = 1, jr(t, aa(e, t.current)))
	}

	function Sh() {
		var t = Gn.current;
		return t === null ? !0 : (ce & 4194048) === ce ? ra === null : (ce & 62914560) === ce || (ce & 536870912) !== 0 ? t === ra : !1
	}

	function wh() {
		var t = _.H;
		return _.H = Nu, t === null ? Nu : t
	}

	function Eh() {
		var t = _.A;
		return _.A = iv, t
	}

	function Zr() {
		qe = 4, Ri || (ce & 4194048) !== ce && Gn.current !== null || (Kl = !0), (zi & 134217727) === 0 && (sl & 134217727) === 0 || je === null || ji(je, ce, Zn, !1)
	}

	function Gc(t, e, n) {
		var a = be;
		be |= 2;
		var i = wh(),
			r = Eh();
		(je !== t || ce !== e) && (qr = null, Il(t, e)), e = !1;
		var s = qe;
		t: do try {
				if (Te !== 0 && le !== null) {
					var v = le,
						b = Qn;
					switch (Te) {
						case 8:
							Xc(), s = 6;
							break t;
						case 3:
						case 2:
						case 9:
						case 6:
							Gn.current === null && (e = !0);
							var j = Te;
							if (Te = 0, Qn = null, kl(t, v, b, j), n && Kl) {
								s = 0;
								break t
							}
							break;
						default:
							j = Te, Te = 0, Qn = null, kl(t, v, b, j)
					}
				}
				rv(), s = qe;
				break
			} catch (Q) {
				Ah(t, Q)
			}
			while (!0);
			return e && t.shellSuspendCounter++, Ga = nl = null, be = a, _.H = i, _.A = r, le === null && (je = null, ce = 0, Ta()), s
	}

	function rv() {
		for (; le !== null;) Mh(le)
	}

	function ov(t, e) {
		var n = be;
		be |= 2;
		var a = wh(),
			i = Eh();
		je !== t || ce !== e ? (qr = null, Gr = Ae() + 500, Il(t, e)) : Kl = zn(t, e);
		t: do try {
				if (Te !== 0 && le !== null) {
					e = le;
					var r = Qn;
					e: switch (Te) {
						case 1:
							Te = 0, Qn = null, kl(t, e, r, 1);
							break;
						case 2:
						case 9:
							if (Nf(r)) {
								Te = 0, Qn = null, Th(e);
								break
							}
							e = function() {
								Te !== 2 && Te !== 9 || je !== t || (Te = 7), Da(t)
							}, r.then(e, e);
							break t;
						case 3:
							Te = 7;
							break t;
						case 4:
							Te = 5;
							break t;
						case 7:
							Nf(r) ? (Te = 0, Qn = null, Th(e)) : (Te = 0, Qn = null, kl(t, e, r, 7));
							break;
						case 5:
							var s = null;
							switch (le.tag) {
								case 26:
									s = le.memoizedState;
								case 5:
								case 27:
									var v = le;
									if (s ? sd(s) : v.stateNode.complete) {
										Te = 0, Qn = null;
										var b = v.sibling;
										if (b !== null) le = b;
										else {
											var j = v.return;
											j !== null ? (le = j, Fr(j)) : le = null
										}
										break e
									}
							}
							Te = 0, Qn = null, kl(t, e, r, 5);
							break;
						case 6:
							Te = 0, Qn = null, kl(t, e, r, 6);
							break;
						case 8:
							Xc(), qe = 6;
							break t;
						default:
							throw Error(B(462))
					}
				}
				cv();
				break
			} catch (Q) {
				Ah(t, Q)
			}
			while (!0);
			return Ga = nl = null, _.H = a, _.A = i, be = n, le !== null ? 0 : (je = null, ce = 0, Ta(), qe)
	}

	function cv() {
		for (; le !== null && !Ua();) Mh(le)
	}

	function Mh(t) {
		var e = Ws(t.alternate, t, $a);
		t.memoizedProps = t.pendingProps, e === null ? Fr(t) : le = e
	}

	function Th(t) {
		var e = t,
			n = e.alternate;
		switch (e.tag) {
			case 15:
			case 0:
				e = qs(n, e, e.pendingProps, e.type, void 0, ce);
				break;
			case 11:
				e = qs(n, e, e.pendingProps, e.type.render, e.ref, ce);
				break;
			case 5:
				ac(e);
			default:
				ks(n, e), e = le = Ef(e, $a), e = Ws(n, e, $a)
		}
		t.memoizedProps = t.pendingProps, e === null ? Fr(t) : le = e
	}

	function kl(t, e, n, a) {
		Ga = nl = null, ac(e), Yl = null, Cu = 0;
		var i = e.return;
		try {
			if (kd(t, i, e, n, ce)) {
				qe = 1, jr(t, aa(n, t.current)), le = null;
				return
			}
		} catch (r) {
			if (i !== null) throw le = i, r;
			qe = 1, jr(t, aa(n, t.current)), le = null;
			return
		}
		e.flags & 32768 ? (se || a === 1 ? t = !0 : Kl || (ce & 536870912) !== 0 ? t = !1 : (Ri = t = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Gn.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Ch(e, t)) : Fr(e)
	}

	function Fr(t) {
		var e = t;
		do {
			if ((e.flags & 32768) !== 0) {
				Ch(e, Ri);
				return
			}
			t = e.return;
			var n = tv(e.alternate, e, $a);
			if (n !== null) {
				le = n;
				return
			}
			if (e = e.sibling, e !== null) {
				le = e;
				return
			}
			le = e = t
		} while (e !== null);
		qe === 0 && (qe = 5)
	}

	function Ch(t, e) {
		do {
			var n = ev(t.alternate, t);
			if (n !== null) {
				n.flags &= 32767, le = n;
				return
			}
			if (n = t.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !e && (t = t.sibling, t !== null)) {
				le = t;
				return
			}
			le = t = n
		} while (t !== null);
		qe = 6, le = null
	}

	function Oh(t, e, n, a, i, r, s, v, b) {
		t.cancelPendingCommit = null;
		do Kr(); while (ln !== 0);
		if ((be & 6) !== 0) throw Error(B(327));
		if (e !== null) {
			if (e === t.current) throw Error(B(177));
			if (r = e.lanes | e.childLanes, r |= Ul, sa(t, n, r, s, v, b), t === je && (le = je = null, ce = 0), Wl = e, Ui = t, Pa = n, Vc = r, xc = i, yh = a, (e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, dv(f, function() {
					return jh(), null
				})) : (t.callbackNode = null, t.callbackPriority = 0), a = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || a) {
				a = _.T, _.T = null, i = R.p, R.p = 2, s = be, be |= 4;
				try {
					nv(t, e, n)
				} finally {
					be = s, R.p = i, _.T = a
				}
			}
			ln = 1, Rh(), zh(), Dh()
		}
	}

	function Rh() {
		if (ln === 1) {
			ln = 0;
			var t = Ui,
				e = Wl,
				n = (e.flags & 13878) !== 0;
			if ((e.subtreeFlags & 13878) !== 0 || n) {
				n = _.T, _.T = null;
				var a = R.p;
				R.p = 2;
				var i = be;
				be |= 4;
				try {
					ch(e, t);
					var r = tf,
						s = C(t.containerInfo),
						v = r.focusedElem,
						b = r.selectionRange;
					if (s !== v && v && v.ownerDocument && _t(v.ownerDocument.documentElement, v)) {
						if (b !== null && lt(v)) {
							var j = b.start,
								Q = b.end;
							if (Q === void 0 && (Q = j), "selectionStart" in v) v.selectionStart = j, v.selectionEnd = Math.min(Q, v.value.length);
							else {
								var J = v.ownerDocument || document,
									H = J && J.defaultView || window;
								if (H.getSelection) {
									var X = H.getSelection(),
										At = v.textContent.length,
										Lt = Math.min(b.start, At),
										Ue = b.end === void 0 ? Lt : Math.min(b.end, At);
									!X.extend && Lt > Ue && (s = Ue, Ue = Lt, Lt = s);
									var O = ht(v, Lt),
										A = ht(v, Ue);
									if (O && A && (X.rangeCount !== 1 || X.anchorNode !== O.node || X.anchorOffset !== O.offset || X.focusNode !== A.node || X.focusOffset !== A.offset)) {
										var D = J.createRange();
										D.setStart(O.node, O.offset), X.removeAllRanges(), Lt > Ue ? (X.addRange(D), X.extend(A.node, A.offset)) : (D.setEnd(A.node, A.offset), X.addRange(D))
									}
								}
							}
						}
						for (J = [], X = v; X = X.parentNode;) X.nodeType === 1 && J.push({
							element: X,
							left: X.scrollLeft,
							top: X.scrollTop
						});
						for (typeof v.focus == "function" && v.focus(), v = 0; v < J.length; v++) {
							var F = J[v];
							F.element.scrollLeft = F.left, F.element.scrollTop = F.top
						}
					}
					lo = !!Pc, tf = Pc = null
				} finally {
					be = i, R.p = a, _.T = n
				}
			}
			t.current = e, ln = 2
		}
	}

	function zh() {
		if (ln === 2) {
			ln = 0;
			var t = Ui,
				e = Wl,
				n = (e.flags & 8772) !== 0;
			if ((e.subtreeFlags & 8772) !== 0 || n) {
				n = _.T, _.T = null;
				var a = R.p;
				R.p = 2;
				var i = be;
				be |= 4;
				try {
					ih(t, e.alternate, e)
				} finally {
					be = i, R.p = a, _.T = n
				}
			}
			ln = 3
		}
	}

	function Dh() {
		if (ln === 4 || ln === 3) {
			ln = 0, gn();
			var t = Ui,
				e = Wl,
				n = Pa,
				a = yh;
			(e.subtreeFlags & 10256) !== 0 || (e.flags & 10256) !== 0 ? ln = 5 : (ln = 0, Wl = Ui = null, Uh(t, t.pendingLanes));
			var i = t.pendingLanes;
			if (i === 0 && (Di = null), bt(n), e = e.stateNode, Et && typeof Et.onCommitFiberRoot == "function") try {
				Et.onCommitFiberRoot(St, e, void 0, (e.current.flags & 128) === 128)
			} catch {}
			if (a !== null) {
				e = _.T, i = R.p, R.p = 2, _.T = null;
				try {
					for (var r = t.onRecoverableError, s = 0; s < a.length; s++) {
						var v = a[s];
						r(v.value, {
							componentStack: v.stack
						})
					}
				} finally {
					_.T = e, R.p = i
				}
			}(Pa & 3) !== 0 && Kr(), Da(t), i = t.pendingLanes, (n & 261930) !== 0 && (i & 42) !== 0 ? t === Yc ? Qu++ : (Qu = 0, Yc = t) : Qu = 0, Zu(0)
		}
	}

	function Uh(t, e) {
		(t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, Mu(e)))
	}

	function Kr() {
		return Rh(), zh(), Dh(), jh()
	}

	function jh() {
		if (ln !== 5) return !1;
		var t = Ui,
			e = Vc;
		Vc = 0;
		var n = bt(Pa),
			a = _.T,
			i = R.p;
		try {
			R.p = 32 > n ? 32 : n, _.T = null, n = xc, xc = null;
			var r = Ui,
				s = Pa;
			if (ln = 0, Wl = Ui = null, Pa = 0, (be & 6) !== 0) throw Error(B(331));
			var v = be;
			if (be |= 4, vh(r.current), sh(r, r.current, s, n), be = v, Zu(0, !1), Et && typeof Et.onPostCommitFiberRoot == "function") try {
				Et.onPostCommitFiberRoot(St, r)
			} catch {}
			return !0
		} finally {
			R.p = i, _.T = a, Uh(t, e)
		}
	}

	function Lh(t, e, n) {
		e = aa(n, e), e = gc(t.stateNode, e, 2), t = Mi(t, e, 2), t !== null && (Jt(t, 2), Da(t))
	}

	function Ce(t, e, n) {
		if (t.tag === 3) Lh(t, t, n);
		else
			for (; e !== null;) {
				if (e.tag === 3) {
					Lh(e, t, n);
					break
				} else if (e.tag === 1) {
					var a = e.stateNode;
					if (typeof e.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Di === null || !Di.has(a))) {
						t = aa(n, t), n = Ns(2), a = Mi(e, n, 2), a !== null && (Bs(n, a, e, t), Jt(a, 2), Da(a));
						break
					}
				}
				e = e.return
			}
	}

	function qc(t, e, n) {
		var a = t.pingCache;
		if (a === null) {
			a = t.pingCache = new lv;
			var i = new Set;
			a.set(e, i)
		} else i = a.get(e), i === void 0 && (i = new Set, a.set(e, i));
		i.has(n) || (Nc = !0, i.add(n), t = fv.bind(null, t, e, n), e.then(t, t))
	}

	function fv(t, e, n) {
		var a = t.pingCache;
		a !== null && a.delete(e), t.pingedLanes |= t.suspendedLanes & n, t.warmLanes &= ~n, je === t && (ce & n) === n && (qe === 4 || qe === 3 && (ce & 62914560) === ce && 300 > Ae() - Xr ? (be & 2) === 0 && Il(t, 0) : Bc |= n, Jl === ce && (Jl = 0)), Da(t)
	}

	function Nh(t, e) {
		e === 0 && (e = Vt()), t = Cn(t, e), t !== null && (Jt(t, e), Da(t))
	}

	function sv(t) {
		var e = t.memoizedState,
			n = 0;
		e !== null && (n = e.retryLane), Nh(t, n)
	}

	function hv(t, e) {
		var n = 0;
		switch (t.tag) {
			case 31:
			case 13:
				var a = t.stateNode,
					i = t.memoizedState;
				i !== null && (n = i.retryLane);
				break;
			case 19:
				a = t.stateNode;
				break;
			case 22:
				a = t.stateNode._retryCache;
				break;
			default:
				throw Error(B(314))
		}
		a !== null && a.delete(e), Nh(t, n)
	}

	function dv(t, e) {
		return xn(t, e)
	}
	var Jr = null,
		$l = null,
		Qc = !1,
		Wr = !1,
		Zc = !1,
		Li = 0;

	function Da(t) {
		t !== $l && t.next === null && ($l === null ? Jr = $l = t : $l = $l.next = t), Wr = !0, Qc || (Qc = !0, mv())
	}

	function Zu(t, e) {
		if (!Zc && Wr) {
			Zc = !0;
			do
				for (var n = !1, a = Jr; a !== null;) {
					if (t !== 0) {
						var i = a.pendingLanes;
						if (i === 0) var r = 0;
						else {
							var s = a.suspendedLanes,
								v = a.pingedLanes;
							r = (1 << 31 - Tt(42 | t) + 1) - 1, r &= i & ~(s & ~v), r = r & 201326741 ? r & 201326741 | 1 : r ? r | 2 : 0
						}
						r !== 0 && (n = !0, xh(a, r))
					} else r = ce, r = fn(a, a === je ? r : 0, a.cancelPendingCommit !== null || a.timeoutHandle !== -1), (r & 3) === 0 || zn(a, r) || (n = !0, xh(a, r));
					a = a.next
				}
			while (n);
			Zc = !1
		}
	}

	function vv() {
		Bh()
	}

	function Bh() {
		Wr = Qc = !1;
		var t = 0;
		Li !== 0 && Mv() && (t = Li);
		for (var e = Ae(), n = null, a = Jr; a !== null;) {
			var i = a.next,
				r = Hh(a, e);
			r === 0 ? (a.next = null, n === null ? Jr = i : n.next = i, i === null && ($l = n)) : (n = a, (t !== 0 || (r & 3) !== 0) && (Wr = !0)), a = i
		}
		ln !== 0 && ln !== 5 || Zu(t), Li !== 0 && (Li = 0)
	}

	function Hh(t, e) {
		for (var n = t.suspendedLanes, a = t.pingedLanes, i = t.expirationTimes, r = t.pendingLanes & -62914561; 0 < r;) {
			var s = 31 - Tt(r),
				v = 1 << s,
				b = i[s];
			b === -1 ? ((v & n) === 0 || (v & a) !== 0) && (i[s] = fa(v, e)) : b <= e && (t.expiredLanes |= v), r &= ~v
		}
		if (e = je, n = ce, n = fn(t, t === e ? n : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), a = t.callbackNode, n === 0 || t === e && (Te === 2 || Te === 9) || t.cancelPendingCommit !== null) return a !== null && a !== null && Qe(a), t.callbackNode = null, t.callbackPriority = 0;
		if ((n & 3) === 0 || zn(t, n)) {
			if (e = n & -n, e === t.callbackPriority) return e;
			switch (a !== null && Qe(a), bt(n)) {
				case 2:
				case 8:
					n = o;
					break;
				case 32:
					n = f;
					break;
				case 268435456:
					n = M;
					break;
				default:
					n = f
			}
			return a = Vh.bind(null, t), n = xn(n, a), t.callbackPriority = e, t.callbackNode = n, e
		}
		return a !== null && a !== null && Qe(a), t.callbackPriority = 2, t.callbackNode = null, 2
	}

	function Vh(t, e) {
		if (ln !== 0 && ln !== 5) return t.callbackNode = null, t.callbackPriority = 0, null;
		var n = t.callbackNode;
		if (Kr() && t.callbackNode !== n) return null;
		var a = ce;
		return a = fn(t, t === je ? a : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), a === 0 ? null : (bh(t, a, e), Hh(t, Ae()), t.callbackNode != null && t.callbackNode === n ? Vh.bind(null, t) : null)
	}

	function xh(t, e) {
		if (Kr()) return null;
		bh(t, e, !0)
	}

	function mv() {
		Cv(function() {
			(be & 6) !== 0 ? xn(d, vv) : Bh()
		})
	}

	function Fc() {
		if (Li === 0) {
			var t = Hl;
			t === 0 && (t = bn, bn <<= 1, (bn & 261888) === 0 && (bn = 256)), Li = t
		}
		return Li
	}

	function Yh(t) {
		return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : fi("" + t)
	}

	function Xh(t, e) {
		var n = e.ownerDocument.createElement("input");
		return n.name = e.name, n.value = e.value, t.id && n.setAttribute("form", t.id), e.parentNode.insertBefore(n, e), t = new FormData(t), n.parentNode.removeChild(n), t
	}

	function pv(t, e, n, a, i) {
		if (e === "submit" && n && n.stateNode === i) {
			var r = Yh((i[sn] || null).action),
				s = a.submitter;
			s && (e = (e = s[sn] || null) ? Yh(e.formAction) : s.getAttribute("formAction"), e !== null && (r = e, s = null));
			var v = new wl("action", "action", null, a, i);
			t.push({
				event: v,
				listeners: [{
					instance: null,
					listener: function() {
						if (a.defaultPrevented) {
							if (Li !== 0) {
								var b = s ? Xh(i, s) : new FormData(i);
								hc(n, {
									pending: !0,
									data: b,
									method: i.method,
									action: r
								}, null, b)
							}
						} else typeof r == "function" && (v.preventDefault(), b = s ? Xh(i, s) : new FormData(i), hc(n, {
							pending: !0,
							data: b,
							method: i.method,
							action: r
						}, r, b))
					},
					currentTarget: i
				}]
			})
		}
	}
	for (var Kc = 0; Kc < Tn.length; Kc++) {
		var Jc = Tn[Kc],
			yv = Jc.toLowerCase(),
			gv = Jc[0].toUpperCase() + Jc.slice(1);
		Ee(yv, "on" + gv)
	}
	Ee($, "onAnimationEnd"), Ee(st, "onAnimationIteration"), Ee($t, "onAnimationStart"), Ee("dblclick", "onDoubleClick"), Ee("focusin", "onFocus"), Ee("focusout", "onBlur"), Ee(oe, "onTransitionRun"), Ee(Ft, "onTransitionStart"), Ee(ie, "onTransitionCancel"), Ee(he, "onTransitionEnd"), Aa("onMouseEnter", ["mouseout", "mouseover"]), Aa("onMouseLeave", ["mouseout", "mouseover"]), Aa("onPointerEnter", ["pointerout", "pointerover"]), Aa("onPointerLeave", ["pointerout", "pointerover"]), In("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), In("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), In("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), In("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), In("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), In("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
	var Fu = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
		bv = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Fu));

	function Gh(t, e) {
		e = (e & 4) !== 0;
		for (var n = 0; n < t.length; n++) {
			var a = t[n],
				i = a.event;
			a = a.listeners;
			t: {
				var r = void 0;
				if (e)
					for (var s = a.length - 1; 0 <= s; s--) {
						var v = a[s],
							b = v.instance,
							j = v.currentTarget;
						if (v = v.listener, b !== r && i.isPropagationStopped()) break t;
						r = v, i.currentTarget = j;
						try {
							r(i)
						} catch (Q) {
							dn(Q)
						}
						i.currentTarget = null, r = b
					} else
						for (s = 0; s < a.length; s++) {
							if (v = a[s], b = v.instance, j = v.currentTarget, v = v.listener, b !== r && i.isPropagationStopped()) break t;
							r = v, i.currentTarget = j;
							try {
								r(i)
							} catch (Q) {
								dn(Q)
							}
							i.currentTarget = null, r = b
						}
			}
		}
	}

	function ue(t, e) {
		var n = e[ii];
		n === void 0 && (n = e[ii] = new Set);
		var a = t + "__bubble";
		n.has(a) || (qh(e, t, 2, !1), n.add(a))
	}

	function Wc(t, e, n) {
		var a = 0;
		e && (a |= 4), qh(n, t, a, e)
	}
	var Ir = "_reactListening" + Math.random().toString(36).slice(2);

	function Ic(t) {
		if (!t[Ir]) {
			t[Ir] = !0, ml.forEach(function(n) {
				n !== "selectionchange" && (bv.has(n) || Wc(n, !1, t), Wc(n, !0, t))
			});
			var e = t.nodeType === 9 ? t : t.ownerDocument;
			e === null || e[Ir] || (e[Ir] = !0, Wc("selectionchange", !1, e))
		}
	}

	function qh(t, e, n, a) {
		switch (gd(e)) {
			case 2:
				var i = Kv;
				break;
			case 8:
				i = Jv;
				break;
			default:
				i = hf
		}
		n = i.bind(null, e, n, t), i = void 0, !di || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (i = !0), a ? i !== void 0 ? t.addEventListener(e, n, {
			capture: !0,
			passive: i
		}) : t.addEventListener(e, n, !0) : i !== void 0 ? t.addEventListener(e, n, {
			passive: i
		}) : t.addEventListener(e, n, !1)
	}

	function kc(t, e, n, a, i) {
		var r = a;
		if ((e & 1) === 0 && (e & 2) === 0 && a !== null) t: for (;;) {
			if (a === null) return;
			var s = a.tag;
			if (s === 3 || s === 4) {
				var v = a.stateNode.containerInfo;
				if (v === i) break;
				if (s === 4)
					for (s = a.return; s !== null;) {
						var b = s.tag;
						if ((b === 3 || b === 4) && s.stateNode.containerInfo === i) return;
						s = s.return
					}
				for (; v !== null;) {
					if (s = La(v), s === null) return;
					if (b = s.tag, b === 5 || b === 6 || b === 26 || b === 27) {
						a = r = s;
						continue t
					}
					v = v.parentNode
				}
			}
			a = a.return
		}
		hi(function() {
			var j = r,
				Q = uu(n),
				J = [];
			t: {
				var H = de.get(t);
				if (H !== void 0) {
					var X = wl,
						At = t;
					switch (t) {
						case "keypress":
							if (mi(n) === 0) break t;
						case "keydown":
						case "keyup":
							X = cr;
							break;
						case "focusin":
							At = "focus", X = Ml;
							break;
						case "focusout":
							At = "blur", X = Ml;
							break;
						case "beforeblur":
						case "afterblur":
							X = Ml;
							break;
						case "click":
							if (n.button === 2) break t;
						case "auxclick":
						case "dblclick":
						case "mousedown":
						case "mousemove":
						case "mouseup":
						case "mouseout":
						case "mouseover":
						case "contextmenu":
							X = ru;
							break;
						case "drag":
						case "dragend":
						case "dragenter":
						case "dragexit":
						case "dragleave":
						case "dragover":
						case "dragstart":
						case "drop":
							X = go;
							break;
						case "touchcancel":
						case "touchend":
						case "touchmove":
						case "touchstart":
							X = Mo;
							break;
						case $:
						case st:
						case $t:
							X = bo;
							break;
						case he:
							X = Co;
							break;
						case "scroll":
						case "scrollend":
							X = po;
							break;
						case "wheel":
							X = Oo;
							break;
						case "copy":
						case "cut":
						case "paste":
							X = Cl;
							break;
						case "gotpointercapture":
						case "lostpointercapture":
						case "pointercancel":
						case "pointerdown":
						case "pointermove":
						case "pointerout":
						case "pointerover":
						case "pointerup":
							X = fr;
							break;
						case "toggle":
						case "beforetoggle":
							X = vu
					}
					var Lt = (e & 4) !== 0,
						Ue = !Lt && (t === "scroll" || t === "scrollend"),
						O = Lt ? H !== null ? H + "Capture" : null : H;
					Lt = [];
					for (var A = j, D; A !== null;) {
						var F = A;
						if (D = F.stateNode, F = F.tag, F !== 5 && F !== 26 && F !== 27 || D === null || O === null || (F = va(A, O), F != null && Lt.push(Ku(A, F, D))), Ue) break;
						A = A.return
					}
					0 < Lt.length && (H = new X(H, At, null, n, Q), J.push({
						event: H,
						listeners: Lt
					}))
				}
			}
			if ((e & 7) === 0) {
				t: {
					if (H = t === "mouseover" || t === "pointerover", X = t === "mouseout" || t === "pointerout", H && n !== Sl && (At = n.relatedTarget || n.fromElement) && (La(At) || At[ja])) break t;
					if ((X || H) && (H = Q.window === Q ? Q : (H = Q.ownerDocument) ? H.defaultView || H.parentWindow : window, X ? (At = n.relatedTarget || n.toElement, X = j, At = At ? La(At) : null, At !== null && (Ue = Ht(At), Lt = At.tag, At !== Ue || Lt !== 5 && Lt !== 27 && Lt !== 6) && (At = null)) : (X = null, At = j), X !== At)) {
						if (Lt = ru, F = "onMouseLeave", O = "onMouseEnter", A = "mouse", (t === "pointerout" || t === "pointerover") && (Lt = fr, F = "onPointerLeave", O = "onPointerEnter", A = "pointer"), Ue = X == null ? H : Gi(X), D = At == null ? H : Gi(At), H = new Lt(F, A + "leave", X, n, Q), H.target = Ue, H.relatedTarget = D, F = null, La(Q) === j && (Lt = new Lt(O, A + "enter", At, n, Q), Lt.target = D, Lt.relatedTarget = Ue, F = Lt), Ue = F, X && At) e: {
							for (Lt = _v, O = X, A = At, D = 0, F = O; F; F = Lt(F)) D++;F = 0;
							for (var Ot = A; Ot; Ot = Lt(Ot)) F++;
							for (; 0 < D - F;) O = Lt(O),
							D--;
							for (; 0 < F - D;) A = Lt(A),
							F--;
							for (; D--;) {
								if (O === A || A !== null && O === A.alternate) {
									Lt = O;
									break e
								}
								O = Lt(O), A = Lt(A)
							}
							Lt = null
						}
						else Lt = null;
						X !== null && Qh(J, H, X, Lt, !1), At !== null && Ue !== null && Qh(J, Ue, At, Lt, !0)
					}
				}
				t: {
					if (H = j ? Gi(j) : window, X = H.nodeName && H.nodeName.toLowerCase(), X === "select" || X === "input" && H.type === "file") var pe = _u;
					else if (bu(H))
						if (Au) pe = w;
						else {
							pe = m;
							var wt = h
						}
					else X = H.nodeName,
					!X || X.toLowerCase() !== "input" || H.type !== "checkbox" && H.type !== "radio" ? j && _l(j.elementType) && (pe = _u) : pe = g;
					if (pe && (pe = pe(t, j))) {
						He(J, pe, n, Q);
						break t
					}
					wt && wt(t, H, j),
					t === "focusout" && j && H.type === "number" && j.memoizedProps.value != null && yl(H, "number", H.value)
				}
				switch (wt = j ? Gi(j) : window, t) {
					case "focusin":
						(bu(wt) || wt.contentEditable === "true") && (ut = wt, me = j, dt = null);
						break;
					case "focusout":
						dt = me = ut = null;
						break;
					case "mousedown":
						kt = !0;
						break;
					case "contextmenu":
					case "mouseup":
					case "dragend":
						kt = !1, we(J, n, Q);
						break;
					case "selectionchange":
						if (pt) break;
					case "keydown":
					case "keyup":
						we(J, n, Q)
				}
				var Wt;
				if (mu) t: {
					switch (t) {
						case "compositionstart":
							var fe = "onCompositionStart";
							break t;
						case "compositionend":
							fe = "onCompositionEnd";
							break t;
						case "compositionupdate":
							fe = "onCompositionUpdate";
							break t
					}
					fe = void 0
				}
				else Ba ? ki(t, n) && (fe = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (fe = "onCompositionStart");fe && (Ol && n.locale !== "ko" && (Ba || fe !== "onCompositionStart" ? fe === "onCompositionEnd" && Ba && (Wt = Ki()) : (Ea = Q, Un = "value" in Ea ? Ea.value : Ea.textContent, Ba = !0)), wt = kr(j, fe), 0 < wt.length && (fe = new cu(fe, t, null, n, Q), J.push({
					event: fe,
					listeners: wt
				}), Wt ? fe.data = Wt : (Wt = gu(n), Wt !== null && (fe.data = Wt)))),
				(Wt = pu ? zo(t, n) : hr(t, n)) && (fe = kr(j, "onBeforeInput"), 0 < fe.length && (wt = new cu("onBeforeInput", "beforeinput", null, n, Q), J.push({
					event: wt,
					listeners: fe
				}), wt.data = Wt)),
				pv(J, t, j, n, Q)
			}
			Gh(J, e)
		})
	}

	function Ku(t, e, n) {
		return {
			instance: t,
			listener: e,
			currentTarget: n
		}
	}

	function kr(t, e) {
		for (var n = e + "Capture", a = []; t !== null;) {
			var i = t,
				r = i.stateNode;
			if (i = i.tag, i !== 5 && i !== 26 && i !== 27 || r === null || (i = va(t, n), i != null && a.unshift(Ku(t, i, r)), i = va(t, e), i != null && a.push(Ku(t, i, r))), t.tag === 3) return a;
			t = t.return
		}
		return []
	}

	function _v(t) {
		if (t === null) return null;
		do t = t.return; while (t && t.tag !== 5 && t.tag !== 27);
		return t || null
	}

	function Qh(t, e, n, a, i) {
		for (var r = e._reactName, s = []; n !== null && n !== a;) {
			var v = n,
				b = v.alternate,
				j = v.stateNode;
			if (v = v.tag, b !== null && b === a) break;
			v !== 5 && v !== 26 && v !== 27 || j === null || (b = j, i ? (j = va(n, r), j != null && s.unshift(Ku(n, j, b))) : i || (j = va(n, r), j != null && s.push(Ku(n, j, b)))), n = n.return
		}
		s.length !== 0 && t.push({
			event: e,
			listeners: s
		})
	}
	var Av = /\r\n?/g,
		Sv = /\u0000|\uFFFD/g;

	function Zh(t) {
		return (typeof t == "string" ? t : "" + t).replace(Av, `
`).replace(Sv, "")
	}

	function Fh(t, e) {
		return e = Zh(e), Zh(t) === e
	}

	function De(t, e, n, a, i, r) {
		switch (n) {
			case "children":
				typeof a == "string" ? e === "body" || e === "textarea" && a === "" || Pn(t, a) : (typeof a == "number" || typeof a == "bigint") && e !== "body" && Pn(t, "" + a);
				break;
			case "className":
				Qi(t, "class", a);
				break;
			case "tabIndex":
				Qi(t, "tabindex", a);
				break;
			case "dir":
			case "role":
			case "viewBox":
			case "width":
			case "height":
				Qi(t, n, a);
				break;
			case "style":
				wa(t, a, r);
				break;
			case "data":
				if (e !== "object") {
					Qi(t, "data", a);
					break
				}
			case "src":
			case "href":
				if (a === "" && (e !== "a" || n !== "href")) {
					t.removeAttribute(n);
					break
				}
				if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
					t.removeAttribute(n);
					break
				}
				a = fi("" + a), t.setAttribute(n, a);
				break;
			case "action":
			case "formAction":
				if (typeof a == "function") {
					t.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
					break
				} else typeof r == "function" && (n === "formAction" ? (e !== "input" && De(t, e, "name", i.name, i, null), De(t, e, "formEncType", i.formEncType, i, null), De(t, e, "formMethod", i.formMethod, i, null), De(t, e, "formTarget", i.formTarget, i, null)) : (De(t, e, "encType", i.encType, i, null), De(t, e, "method", i.method, i, null), De(t, e, "target", i.target, i, null)));
				if (a == null || typeof a == "symbol" || typeof a == "boolean") {
					t.removeAttribute(n);
					break
				}
				a = fi("" + a), t.setAttribute(n, a);
				break;
			case "onClick":
				a != null && (t.onclick = ta);
				break;
			case "onScroll":
				a != null && ue("scroll", t);
				break;
			case "onScrollEnd":
				a != null && ue("scrollend", t);
				break;
			case "dangerouslySetInnerHTML":
				if (a != null) {
					if (typeof a != "object" || !("__html" in a)) throw Error(B(61));
					if (n = a.__html, n != null) {
						if (i.children != null) throw Error(B(60));
						t.innerHTML = n
					}
				}
				break;
			case "multiple":
				t.multiple = a && typeof a != "function" && typeof a != "symbol";
				break;
			case "muted":
				t.muted = a && typeof a != "function" && typeof a != "symbol";
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "defaultValue":
			case "defaultChecked":
			case "innerHTML":
			case "ref":
				break;
			case "autoFocus":
				break;
			case "xlinkHref":
				if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
					t.removeAttribute("xlink:href");
					break
				}
				n = fi("" + a), t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
				break;
			case "contentEditable":
			case "spellCheck":
			case "draggable":
			case "value":
			case "autoReverse":
			case "externalResourcesRequired":
			case "focusable":
			case "preserveAlpha":
				a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(n, "" + a) : t.removeAttribute(n);
				break;
			case "inert":
			case "allowFullScreen":
			case "async":
			case "autoPlay":
			case "controls":
			case "default":
			case "defer":
			case "disabled":
			case "disablePictureInPicture":
			case "disableRemotePlayback":
			case "formNoValidate":
			case "hidden":
			case "loop":
			case "noModule":
			case "noValidate":
			case "open":
			case "playsInline":
			case "readOnly":
			case "required":
			case "reversed":
			case "scoped":
			case "seamless":
			case "itemScope":
				a && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
				break;
			case "capture":
			case "download":
				a === !0 ? t.setAttribute(n, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? t.setAttribute(n, a) : t.removeAttribute(n);
				break;
			case "cols":
			case "rows":
			case "size":
			case "span":
				a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? t.setAttribute(n, a) : t.removeAttribute(n);
				break;
			case "rowSpan":
			case "start":
				a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? t.removeAttribute(n) : t.setAttribute(n, a);
				break;
			case "popover":
				ue("beforetoggle", t), ue("toggle", t), Sa(t, "popover", a);
				break;
			case "xlinkActuate":
				hn(t, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
				break;
			case "xlinkArcrole":
				hn(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
				break;
			case "xlinkRole":
				hn(t, "http://www.w3.org/1999/xlink", "xlink:role", a);
				break;
			case "xlinkShow":
				hn(t, "http://www.w3.org/1999/xlink", "xlink:show", a);
				break;
			case "xlinkTitle":
				hn(t, "http://www.w3.org/1999/xlink", "xlink:title", a);
				break;
			case "xlinkType":
				hn(t, "http://www.w3.org/1999/xlink", "xlink:type", a);
				break;
			case "xmlBase":
				hn(t, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
				break;
			case "xmlLang":
				hn(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
				break;
			case "xmlSpace":
				hn(t, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
				break;
			case "is":
				Sa(t, "is", a);
				break;
			case "innerText":
			case "textContent":
				break;
			default:
				(!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = Fi.get(n) || n, Sa(t, n, a))
		}
	}

	function $c(t, e, n, a, i, r) {
		switch (n) {
			case "style":
				wa(t, a, r);
				break;
			case "dangerouslySetInnerHTML":
				if (a != null) {
					if (typeof a != "object" || !("__html" in a)) throw Error(B(61));
					if (n = a.__html, n != null) {
						if (i.children != null) throw Error(B(60));
						t.innerHTML = n
					}
				}
				break;
			case "children":
				typeof a == "string" ? Pn(t, a) : (typeof a == "number" || typeof a == "bigint") && Pn(t, "" + a);
				break;
			case "onScroll":
				a != null && ue("scroll", t);
				break;
			case "onScrollEnd":
				a != null && ue("scrollend", t);
				break;
			case "onClick":
				a != null && (t.onclick = ta);
				break;
			case "suppressContentEditableWarning":
			case "suppressHydrationWarning":
			case "innerHTML":
			case "ref":
				break;
			case "innerText":
			case "textContent":
				break;
			default:
				if (!Wn.hasOwnProperty(n)) t: {
					if (n[0] === "o" && n[1] === "n" && (i = n.endsWith("Capture"), e = n.slice(2, i ? n.length - 7 : void 0), r = t[sn] || null, r = r != null ? r[n] : null, typeof r == "function" && t.removeEventListener(e, r, i), typeof a == "function")) {
						typeof r != "function" && r !== null && (n in t ? t[n] = null : t.hasAttribute(n) && t.removeAttribute(n)), t.addEventListener(e, a, i);
						break t
					}
					n in t ? t[n] = a : a === !0 ? t.setAttribute(n, "") : Sa(t, n, a)
				}
		}
	}

	function yn(t, e, n) {
		switch (e) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li":
				break;
			case "img":
				ue("error", t), ue("load", t);
				var a = !1,
					i = !1,
					r;
				for (r in n)
					if (n.hasOwnProperty(r)) {
						var s = n[r];
						if (s != null) switch (r) {
							case "src":
								a = !0;
								break;
							case "srcSet":
								i = !0;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								throw Error(B(137, e));
							default:
								De(t, e, r, s, n, null)
						}
					} i && De(t, e, "srcSet", n.srcSet, n, null), a && De(t, e, "src", n.src, n, null);
				return;
			case "input":
				ue("invalid", t);
				var v = r = s = i = null,
					b = null,
					j = null;
				for (a in n)
					if (n.hasOwnProperty(a)) {
						var Q = n[a];
						if (Q != null) switch (a) {
							case "name":
								i = Q;
								break;
							case "type":
								s = Q;
								break;
							case "checked":
								b = Q;
								break;
							case "defaultChecked":
								j = Q;
								break;
							case "value":
								r = Q;
								break;
							case "defaultValue":
								v = Q;
								break;
							case "children":
							case "dangerouslySetInnerHTML":
								if (Q != null) throw Error(B(137, e));
								break;
							default:
								De(t, e, a, Q, n, null)
						}
					} lu(t, r, v, b, j, s, i, !1);
				return;
			case "select":
				ue("invalid", t), a = s = r = null;
				for (i in n)
					if (n.hasOwnProperty(i) && (v = n[i], v != null)) switch (i) {
						case "value":
							r = v;
							break;
						case "defaultValue":
							s = v;
							break;
						case "multiple":
							a = v;
						default:
							De(t, e, i, v, n, null)
					}
				e = r, n = s, t.multiple = !!a, e != null ? Re(t, !!a, e, !1) : n != null && Re(t, !!a, n, !0);
				return;
			case "textarea":
				ue("invalid", t), r = i = a = null;
				for (s in n)
					if (n.hasOwnProperty(s) && (v = n[s], v != null)) switch (s) {
						case "value":
							a = v;
							break;
						case "defaultValue":
							i = v;
							break;
						case "children":
							r = v;
							break;
						case "dangerouslySetInnerHTML":
							if (v != null) throw Error(B(91));
							break;
						default:
							De(t, e, s, v, n, null)
					}
				gl(t, a, i, r);
				return;
			case "option":
				for (b in n)
					if (n.hasOwnProperty(b) && (a = n[b], a != null)) switch (b) {
						case "selected":
							t.selected = a && typeof a != "function" && typeof a != "symbol";
							break;
						default:
							De(t, e, b, a, n, null)
					}
				return;
			case "dialog":
				ue("beforetoggle", t), ue("toggle", t), ue("cancel", t), ue("close", t);
				break;
			case "iframe":
			case "object":
				ue("load", t);
				break;
			case "video":
			case "audio":
				for (a = 0; a < Fu.length; a++) ue(Fu[a], t);
				break;
			case "image":
				ue("error", t), ue("load", t);
				break;
			case "details":
				ue("toggle", t);
				break;
			case "embed":
			case "source":
			case "link":
				ue("error", t), ue("load", t);
			case "area":
			case "base":
			case "br":
			case "col":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "track":
			case "wbr":
			case "menuitem":
				for (j in n)
					if (n.hasOwnProperty(j) && (a = n[j], a != null)) switch (j) {
						case "children":
						case "dangerouslySetInnerHTML":
							throw Error(B(137, e));
						default:
							De(t, e, j, a, n, null)
					}
				return;
			default:
				if (_l(e)) {
					for (Q in n) n.hasOwnProperty(Q) && (a = n[Q], a !== void 0 && $c(t, e, Q, a, n, void 0));
					return
				}
		}
		for (v in n) n.hasOwnProperty(v) && (a = n[v], a != null && De(t, e, v, a, n, null))
	}

	function wv(t, e, n, a) {
		switch (e) {
			case "div":
			case "span":
			case "svg":
			case "path":
			case "a":
			case "g":
			case "p":
			case "li":
				break;
			case "input":
				var i = null,
					r = null,
					s = null,
					v = null,
					b = null,
					j = null,
					Q = null;
				for (X in n) {
					var J = n[X];
					if (n.hasOwnProperty(X) && J != null) switch (X) {
						case "checked":
							break;
						case "value":
							break;
						case "defaultValue":
							b = J;
						default:
							a.hasOwnProperty(X) || De(t, e, X, null, a, J)
					}
				}
				for (var H in a) {
					var X = a[H];
					if (J = n[H], a.hasOwnProperty(H) && (X != null || J != null)) switch (H) {
						case "type":
							r = X;
							break;
						case "name":
							i = X;
							break;
						case "checked":
							j = X;
							break;
						case "defaultChecked":
							Q = X;
							break;
						case "value":
							s = X;
							break;
						case "defaultValue":
							v = X;
							break;
						case "children":
						case "dangerouslySetInnerHTML":
							if (X != null) throw Error(B(137, e));
							break;
						default:
							X !== J && De(t, e, H, X, a, J)
					}
				}
				pl(t, s, v, b, j, Q, r, i);
				return;
			case "select":
				X = s = v = H = null;
				for (r in n)
					if (b = n[r], n.hasOwnProperty(r) && b != null) switch (r) {
						case "value":
							break;
						case "multiple":
							X = b;
						default:
							a.hasOwnProperty(r) || De(t, e, r, null, a, b)
					}
				for (i in a)
					if (r = a[i], b = n[i], a.hasOwnProperty(i) && (r != null || b != null)) switch (i) {
						case "value":
							H = r;
							break;
						case "defaultValue":
							v = r;
							break;
						case "multiple":
							s = r;
						default:
							r !== b && De(t, e, i, r, a, b)
					}
				e = v, n = s, a = X, H != null ? Re(t, !!n, H, !1) : !!a != !!n && (e != null ? Re(t, !!n, e, !0) : Re(t, !!n, n ? [] : "", !1));
				return;
			case "textarea":
				X = H = null;
				for (v in n)
					if (i = n[v], n.hasOwnProperty(v) && i != null && !a.hasOwnProperty(v)) switch (v) {
						case "value":
							break;
						case "children":
							break;
						default:
							De(t, e, v, null, a, i)
					}
				for (s in a)
					if (i = a[s], r = n[s], a.hasOwnProperty(s) && (i != null || r != null)) switch (s) {
						case "value":
							H = i;
							break;
						case "defaultValue":
							X = i;
							break;
						case "children":
							break;
						case "dangerouslySetInnerHTML":
							if (i != null) throw Error(B(91));
							break;
						default:
							i !== r && De(t, e, s, i, a, r)
					}
				ci(t, H, X);
				return;
			case "option":
				for (var At in n)
					if (H = n[At], n.hasOwnProperty(At) && H != null && !a.hasOwnProperty(At)) switch (At) {
						case "selected":
							t.selected = !1;
							break;
						default:
							De(t, e, At, null, a, H)
					}
				for (b in a)
					if (H = a[b], X = n[b], a.hasOwnProperty(b) && H !== X && (H != null || X != null)) switch (b) {
						case "selected":
							t.selected = H && typeof H != "function" && typeof H != "symbol";
							break;
						default:
							De(t, e, b, H, a, X)
					}
				return;
			case "img":
			case "link":
			case "area":
			case "base":
			case "br":
			case "col":
			case "embed":
			case "hr":
			case "keygen":
			case "meta":
			case "param":
			case "source":
			case "track":
			case "wbr":
			case "menuitem":
				for (var Lt in n) H = n[Lt], n.hasOwnProperty(Lt) && H != null && !a.hasOwnProperty(Lt) && De(t, e, Lt, null, a, H);
				for (j in a)
					if (H = a[j], X = n[j], a.hasOwnProperty(j) && H !== X && (H != null || X != null)) switch (j) {
						case "children":
						case "dangerouslySetInnerHTML":
							if (H != null) throw Error(B(137, e));
							break;
						default:
							De(t, e, j, H, a, X)
					}
				return;
			default:
				if (_l(e)) {
					for (var Ue in n) H = n[Ue], n.hasOwnProperty(Ue) && H !== void 0 && !a.hasOwnProperty(Ue) && $c(t, e, Ue, void 0, a, H);
					for (Q in a) H = a[Q], X = n[Q], !a.hasOwnProperty(Q) || H === X || H === void 0 && X === void 0 || $c(t, e, Q, H, a, X);
					return
				}
		}
		for (var O in n) H = n[O], n.hasOwnProperty(O) && H != null && !a.hasOwnProperty(O) && De(t, e, O, null, a, H);
		for (J in a) H = a[J], X = n[J], !a.hasOwnProperty(J) || H === X || H == null && X == null || De(t, e, J, H, a, X)
	}

	function Kh(t) {
		switch (t) {
			case "css":
			case "script":
			case "font":
			case "img":
			case "image":
			case "input":
			case "link":
				return !0;
			default:
				return !1
		}
	}

	function Ev() {
		if (typeof performance.getEntriesByType == "function") {
			for (var t = 0, e = 0, n = performance.getEntriesByType("resource"), a = 0; a < n.length; a++) {
				var i = n[a],
					r = i.transferSize,
					s = i.initiatorType,
					v = i.duration;
				if (r && v && Kh(s)) {
					for (s = 0, v = i.responseEnd, a += 1; a < n.length; a++) {
						var b = n[a],
							j = b.startTime;
						if (j > v) break;
						var Q = b.transferSize,
							J = b.initiatorType;
						Q && Kh(J) && (b = b.responseEnd, s += Q * (b < v ? 1 : (v - j) / (b - j)))
					}
					if (--a, e += 8 * (r + s) / (i.duration / 1e3), t++, 10 < t) break
				}
			}
			if (0 < t) return e / t / 1e6
		}
		return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5
	}
	var Pc = null,
		tf = null;

	function $r(t) {
		return t.nodeType === 9 ? t : t.ownerDocument
	}

	function Jh(t) {
		switch (t) {
			case "http://www.w3.org/2000/svg":
				return 1;
			case "http://www.w3.org/1998/Math/MathML":
				return 2;
			default:
				return 0
		}
	}

	function Wh(t, e) {
		if (t === 0) switch (e) {
			case "svg":
				return 1;
			case "math":
				return 2;
			default:
				return 0
		}
		return t === 1 && e === "foreignObject" ? 0 : t
	}

	function ef(t, e) {
		return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null
	}
	var nf = null;

	function Mv() {
		var t = window.event;
		return t && t.type === "popstate" ? t === nf ? !1 : (nf = t, !0) : (nf = null, !1)
	}
	var Ih = typeof setTimeout == "function" ? setTimeout : void 0,
		Tv = typeof clearTimeout == "function" ? clearTimeout : void 0,
		kh = typeof Promise == "function" ? Promise : void 0,
		Cv = typeof queueMicrotask == "function" ? queueMicrotask : typeof kh < "u" ? function(t) {
			return kh.resolve(null).then(t).catch(Ov)
		} : Ih;

	function Ov(t) {
		setTimeout(function() {
			throw t
		})
	}

	function Ni(t) {
		return t === "head"
	}

	function $h(t, e) {
		var n = e,
			a = 0;
		do {
			var i = n.nextSibling;
			if (t.removeChild(n), i && i.nodeType === 8)
				if (n = i.data, n === "/$" || n === "/&") {
					if (a === 0) {
						t.removeChild(i), nu(e);
						return
					}
					a--
				} else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") a++;
			else if (n === "html") Ju(t.ownerDocument.documentElement);
			else if (n === "head") {
				n = t.ownerDocument.head, Ju(n);
				for (var r = n.firstChild; r;) {
					var s = r.nextSibling,
						v = r.nodeName;
					r[li] || v === "SCRIPT" || v === "STYLE" || v === "LINK" && r.rel.toLowerCase() === "stylesheet" || n.removeChild(r), r = s
				}
			} else n === "body" && Ju(t.ownerDocument.body);
			n = i
		} while (n);
		nu(e)
	}

	function Ph(t, e) {
		var n = t;
		t = 0;
		do {
			var a = n.nextSibling;
			if (n.nodeType === 1 ? e ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (e ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), a && a.nodeType === 8)
				if (n = a.data, n === "/$") {
					if (t === 0) break;
					t--
				} else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || t++;
			n = a
		} while (n)
	}

	function af(t) {
		var e = t.firstChild;
		for (e && e.nodeType === 10 && (e = e.nextSibling); e;) {
			var n = e;
			switch (e = e.nextSibling, n.nodeName) {
				case "HTML":
				case "HEAD":
				case "BODY":
					af(n), Jn(n);
					continue;
				case "SCRIPT":
				case "STYLE":
					continue;
				case "LINK":
					if (n.rel.toLowerCase() === "stylesheet") continue
			}
			t.removeChild(n)
		}
	}

	function Rv(t, e, n, a) {
		for (; t.nodeType === 1;) {
			var i = n;
			if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
				if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden")) break
			} else if (a) {
				if (!t[li]) switch (e) {
					case "meta":
						if (!t.hasAttribute("itemprop")) break;
						return t;
					case "link":
						if (r = t.getAttribute("rel"), r === "stylesheet" && t.hasAttribute("data-precedence")) break;
						if (r !== i.rel || t.getAttribute("href") !== (i.href == null || i.href === "" ? null : i.href) || t.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin) || t.getAttribute("title") !== (i.title == null ? null : i.title)) break;
						return t;
					case "style":
						if (t.hasAttribute("data-precedence")) break;
						return t;
					case "script":
						if (r = t.getAttribute("src"), (r !== (i.src == null ? null : i.src) || t.getAttribute("type") !== (i.type == null ? null : i.type) || t.getAttribute("crossorigin") !== (i.crossOrigin == null ? null : i.crossOrigin)) && r && t.hasAttribute("async") && !t.hasAttribute("itemprop")) break;
						return t;
					default:
						return t
				}
			} else if (e === "input" && t.type === "hidden") {
				var r = i.name == null ? null : "" + i.name;
				if (i.type === "hidden" && t.getAttribute("name") === r) return t
			} else return t;
			if (t = oa(t.nextSibling), t === null) break
		}
		return null
	}

	function zv(t, e, n) {
		if (e === "") return null;
		for (; t.nodeType !== 3;)
			if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n || (t = oa(t.nextSibling), t === null)) return null;
		return t
	}

	function td(t, e) {
		for (; t.nodeType !== 8;)
			if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = oa(t.nextSibling), t === null)) return null;
		return t
	}

	function lf(t) {
		return t.data === "$?" || t.data === "$~"
	}

	function uf(t) {
		return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading"
	}

	function Dv(t, e) {
		var n = t.ownerDocument;
		if (t.data === "$~") t._reactRetry = e;
		else if (t.data !== "$?" || n.readyState !== "loading") e();
		else {
			var a = function() {
				e(), n.removeEventListener("DOMContentLoaded", a)
			};
			n.addEventListener("DOMContentLoaded", a), t._reactRetry = a
		}
	}

	function oa(t) {
		for (; t != null; t = t.nextSibling) {
			var e = t.nodeType;
			if (e === 1 || e === 3) break;
			if (e === 8) {
				if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F") break;
				if (e === "/$" || e === "/&") return null
			}
		}
		return t
	}
	var rf = null;

	function ed(t) {
		t = t.nextSibling;
		for (var e = 0; t;) {
			if (t.nodeType === 8) {
				var n = t.data;
				if (n === "/$" || n === "/&") {
					if (e === 0) return oa(t.nextSibling);
					e--
				} else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || e++
			}
			t = t.nextSibling
		}
		return null
	}

	function nd(t) {
		t = t.previousSibling;
		for (var e = 0; t;) {
			if (t.nodeType === 8) {
				var n = t.data;
				if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
					if (e === 0) return t;
					e--
				} else n !== "/$" && n !== "/&" || e++
			}
			t = t.previousSibling
		}
		return null
	}

	function ad(t, e, n) {
		switch (e = $r(n), t) {
			case "html":
				if (t = e.documentElement, !t) throw Error(B(452));
				return t;
			case "head":
				if (t = e.head, !t) throw Error(B(453));
				return t;
			case "body":
				if (t = e.body, !t) throw Error(B(454));
				return t;
			default:
				throw Error(B(451))
		}
	}

	function Ju(t) {
		for (var e = t.attributes; e.length;) t.removeAttributeNode(e[0]);
		Jn(t)
	}
	var ca = new Map,
		id = new Set;

	function Pr(t) {
		return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument
	}
	var ti = R.d;
	R.d = {
		f: Uv,
		r: jv,
		D: Lv,
		C: Nv,
		L: Bv,
		m: Hv,
		X: xv,
		S: Vv,
		M: Yv
	};

	function Uv() {
		var t = ti.f(),
			e = Qr();
		return t || e
	}

	function jv(t) {
		var e = ui(t);
		e !== null && e.tag === 5 && e.type === "form" ? As(e) : ti.r(t)
	}
	var Pl = typeof document > "u" ? null : document;

	function ld(t, e, n) {
		var a = Pl;
		if (a && typeof e == "string" && e) {
			var i = Xe(e);
			i = 'link[rel="' + t + '"][href="' + i + '"]', typeof n == "string" && (i += '[crossorigin="' + n + '"]'), id.has(i) || (id.add(i), t = {
				rel: t,
				crossOrigin: n,
				href: e
			}, a.querySelector(i) === null && (e = a.createElement("link"), yn(e, "link", t), Fe(e), a.head.appendChild(e)))
		}
	}

	function Lv(t) {
		ti.D(t), ld("dns-prefetch", t, null)
	}

	function Nv(t, e) {
		ti.C(t, e), ld("preconnect", t, e)
	}

	function Bv(t, e, n) {
		ti.L(t, e, n);
		var a = Pl;
		if (a && t && e) {
			var i = 'link[rel="preload"][as="' + Xe(e) + '"]';
			e === "image" && n && n.imageSrcSet ? (i += '[imagesrcset="' + Xe(n.imageSrcSet) + '"]', typeof n.imageSizes == "string" && (i += '[imagesizes="' + Xe(n.imageSizes) + '"]')) : i += '[href="' + Xe(t) + '"]';
			var r = i;
			switch (e) {
				case "style":
					r = tu(t);
					break;
				case "script":
					r = eu(t)
			}
			ca.has(r) || (t = it({
				rel: "preload",
				href: e === "image" && n && n.imageSrcSet ? void 0 : t,
				as: e
			}, n), ca.set(r, t), a.querySelector(i) !== null || e === "style" && a.querySelector(Wu(r)) || e === "script" && a.querySelector(Iu(r)) || (e = a.createElement("link"), yn(e, "link", t), Fe(e), a.head.appendChild(e)))
		}
	}

	function Hv(t, e) {
		ti.m(t, e);
		var n = Pl;
		if (n && t) {
			var a = e && typeof e.as == "string" ? e.as : "script",
				i = 'link[rel="modulepreload"][as="' + Xe(a) + '"][href="' + Xe(t) + '"]',
				r = i;
			switch (a) {
				case "audioworklet":
				case "paintworklet":
				case "serviceworker":
				case "sharedworker":
				case "worker":
				case "script":
					r = eu(t)
			}
			if (!ca.has(r) && (t = it({
					rel: "modulepreload",
					href: t
				}, e), ca.set(r, t), n.querySelector(i) === null)) {
				switch (a) {
					case "audioworklet":
					case "paintworklet":
					case "serviceworker":
					case "sharedworker":
					case "worker":
					case "script":
						if (n.querySelector(Iu(r))) return
				}
				a = n.createElement("link"), yn(a, "link", t), Fe(a), n.head.appendChild(a)
			}
		}
	}

	function Vv(t, e, n) {
		ti.S(t, e, n);
		var a = Pl;
		if (a && t) {
			var i = _a(a).hoistableStyles,
				r = tu(t);
			e = e || "default";
			var s = i.get(r);
			if (!s) {
				var v = {
					loading: 0,
					preload: null
				};
				if (s = a.querySelector(Wu(r))) v.loading = 5;
				else {
					t = it({
						rel: "stylesheet",
						href: t,
						"data-precedence": e
					}, n), (n = ca.get(r)) && of(t, n);
					var b = s = a.createElement("link");
					Fe(b), yn(b, "link", t), b._p = new Promise(function(j, Q) {
						b.onload = j, b.onerror = Q
					}), b.addEventListener("load", function() {
						v.loading |= 1
					}), b.addEventListener("error", function() {
						v.loading |= 2
					}), v.loading |= 4, to(s, e, a)
				}
				s = {
					type: "stylesheet",
					instance: s,
					count: 1,
					state: v
				}, i.set(r, s)
			}
		}
	}

	function xv(t, e) {
		ti.X(t, e);
		var n = Pl;
		if (n && t) {
			var a = _a(n).hoistableScripts,
				i = eu(t),
				r = a.get(i);
			r || (r = n.querySelector(Iu(i)), r || (t = it({
				src: t,
				async: !0
			}, e), (e = ca.get(i)) && cf(t, e), r = n.createElement("script"), Fe(r), yn(r, "link", t), n.head.appendChild(r)), r = {
				type: "script",
				instance: r,
				count: 1,
				state: null
			}, a.set(i, r))
		}
	}

	function Yv(t, e) {
		ti.M(t, e);
		var n = Pl;
		if (n && t) {
			var a = _a(n).hoistableScripts,
				i = eu(t),
				r = a.get(i);
			r || (r = n.querySelector(Iu(i)), r || (t = it({
				src: t,
				async: !0,
				type: "module"
			}, e), (e = ca.get(i)) && cf(t, e), r = n.createElement("script"), Fe(r), yn(r, "link", t), n.head.appendChild(r)), r = {
				type: "script",
				instance: r,
				count: 1,
				state: null
			}, a.set(i, r))
		}
	}

	function ud(t, e, n, a) {
		var i = (i = gt.current) ? Pr(i) : null;
		if (!i) throw Error(B(446));
		switch (t) {
			case "meta":
			case "title":
				return null;
			case "style":
				return typeof n.precedence == "string" && typeof n.href == "string" ? (e = tu(n.href), n = _a(i).hoistableStyles, a = n.get(e), a || (a = {
					type: "style",
					instance: null,
					count: 0,
					state: null
				}, n.set(e, a)), a) : {
					type: "void",
					instance: null,
					count: 0,
					state: null
				};
			case "link":
				if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
					t = tu(n.href);
					var r = _a(i).hoistableStyles,
						s = r.get(t);
					if (s || (i = i.ownerDocument || i, s = {
							type: "stylesheet",
							instance: null,
							count: 0,
							state: {
								loading: 0,
								preload: null
							}
						}, r.set(t, s), (r = i.querySelector(Wu(t))) && !r._p && (s.instance = r, s.state.loading = 5), ca.has(t) || (n = {
							rel: "preload",
							as: "style",
							href: n.href,
							crossOrigin: n.crossOrigin,
							integrity: n.integrity,
							media: n.media,
							hrefLang: n.hrefLang,
							referrerPolicy: n.referrerPolicy
						}, ca.set(t, n), r || Xv(i, t, n, s.state))), e && a === null) throw Error(B(528, ""));
					return s
				}
				if (e && a !== null) throw Error(B(529, ""));
				return null;
			case "script":
				return e = n.async, n = n.src, typeof n == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = eu(n), n = _a(i).hoistableScripts, a = n.get(e), a || (a = {
					type: "script",
					instance: null,
					count: 0,
					state: null
				}, n.set(e, a)), a) : {
					type: "void",
					instance: null,
					count: 0,
					state: null
				};
			default:
				throw Error(B(444, t))
		}
	}

	function tu(t) {
		return 'href="' + Xe(t) + '"'
	}

	function Wu(t) {
		return 'link[rel="stylesheet"][' + t + "]"
	}

	function rd(t) {
		return it({}, t, {
			"data-precedence": t.precedence,
			precedence: null
		})
	}

	function Xv(t, e, n, a) {
		t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? a.loading = 1 : (e = t.createElement("link"), a.preload = e, e.addEventListener("load", function() {
			return a.loading |= 1
		}), e.addEventListener("error", function() {
			return a.loading |= 2
		}), yn(e, "link", n), Fe(e), t.head.appendChild(e))
	}

	function eu(t) {
		return '[src="' + Xe(t) + '"]'
	}

	function Iu(t) {
		return "script[async]" + t
	}

	function od(t, e, n) {
		if (e.count++, e.instance === null) switch (e.type) {
			case "style":
				var a = t.querySelector('style[data-href~="' + Xe(n.href) + '"]');
				if (a) return e.instance = a, Fe(a), a;
				var i = it({}, n, {
					"data-href": n.href,
					"data-precedence": n.precedence,
					href: null,
					precedence: null
				});
				return a = (t.ownerDocument || t).createElement("style"), Fe(a), yn(a, "style", i), to(a, n.precedence, t), e.instance = a;
			case "stylesheet":
				i = tu(n.href);
				var r = t.querySelector(Wu(i));
				if (r) return e.state.loading |= 4, e.instance = r, Fe(r), r;
				a = rd(n), (i = ca.get(i)) && of(a, i), r = (t.ownerDocument || t).createElement("link"), Fe(r);
				var s = r;
				return s._p = new Promise(function(v, b) {
					s.onload = v, s.onerror = b
				}), yn(r, "link", a), e.state.loading |= 4, to(r, n.precedence, t), e.instance = r;
			case "script":
				return r = eu(n.src), (i = t.querySelector(Iu(r))) ? (e.instance = i, Fe(i), i) : (a = n, (i = ca.get(r)) && (a = it({}, n), cf(a, i)), t = t.ownerDocument || t, i = t.createElement("script"), Fe(i), yn(i, "link", a), t.head.appendChild(i), e.instance = i);
			case "void":
				return null;
			default:
				throw Error(B(443, e.type))
		} else e.type === "stylesheet" && (e.state.loading & 4) === 0 && (a = e.instance, e.state.loading |= 4, to(a, n.precedence, t));
		return e.instance
	}

	function to(t, e, n) {
		for (var a = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), i = a.length ? a[a.length - 1] : null, r = i, s = 0; s < a.length; s++) {
			var v = a[s];
			if (v.dataset.precedence === e) r = v;
			else if (r !== i) break
		}
		r ? r.parentNode.insertBefore(t, r.nextSibling) : (e = n.nodeType === 9 ? n.head : n, e.insertBefore(t, e.firstChild))
	}

	function of(t, e) {
		t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title)
	}

	function cf(t, e) {
		t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity)
	}
	var eo = null;

	function cd(t, e, n) {
		if (eo === null) {
			var a = new Map,
				i = eo = new Map;
			i.set(n, a)
		} else i = eo, a = i.get(n), a || (a = new Map, i.set(n, a));
		if (a.has(t)) return a;
		for (a.set(t, null), n = n.getElementsByTagName(t), i = 0; i < n.length; i++) {
			var r = n[i];
			if (!(r[li] || r[Be] || t === "link" && r.getAttribute("rel") === "stylesheet") && r.namespaceURI !== "http://www.w3.org/2000/svg") {
				var s = r.getAttribute(e) || "";
				s = t + s;
				var v = a.get(s);
				v ? v.push(r) : a.set(s, [r])
			}
		}
		return a
	}

	function fd(t, e, n) {
		t = t.ownerDocument || t, t.head.insertBefore(n, e === "title" ? t.querySelector("head > title") : null)
	}

	function Gv(t, e, n) {
		if (n === 1 || e.itemProp != null) return !1;
		switch (t) {
			case "meta":
			case "title":
				return !0;
			case "style":
				if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") break;
				return !0;
			case "link":
				if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError) break;
				switch (e.rel) {
					case "stylesheet":
						return t = e.disabled, typeof e.precedence == "string" && t == null;
					default:
						return !0
				}
			case "script":
				if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string") return !0
		}
		return !1
	}

	function sd(t) {
		return !(t.type === "stylesheet" && (t.state.loading & 3) === 0)
	}

	function qv(t, e, n, a) {
		if (n.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (n.state.loading & 4) === 0) {
			if (n.instance === null) {
				var i = tu(a.href),
					r = e.querySelector(Wu(i));
				if (r) {
					e = r._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = no.bind(t), e.then(t, t)), n.state.loading |= 4, n.instance = r, Fe(r);
					return
				}
				r = e.ownerDocument || e, a = rd(a), (i = ca.get(i)) && of(a, i), r = r.createElement("link"), Fe(r);
				var s = r;
				s._p = new Promise(function(v, b) {
					s.onload = v, s.onerror = b
				}), yn(r, "link", a), n.instance = r
			}
			t.stylesheets === null && (t.stylesheets = new Map), t.stylesheets.set(n, e), (e = n.state.preload) && (n.state.loading & 3) === 0 && (t.count++, n = no.bind(t), e.addEventListener("load", n), e.addEventListener("error", n))
		}
	}
	var ff = 0;

	function Qv(t, e) {
		return t.stylesheets && t.count === 0 && io(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(n) {
			var a = setTimeout(function() {
				if (t.stylesheets && io(t, t.stylesheets), t.unsuspend) {
					var r = t.unsuspend;
					t.unsuspend = null, r()
				}
			}, 6e4 + e);
			0 < t.imgBytes && ff === 0 && (ff = 62500 * Ev());
			var i = setTimeout(function() {
				if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && io(t, t.stylesheets), t.unsuspend)) {
					var r = t.unsuspend;
					t.unsuspend = null, r()
				}
			}, (t.imgBytes > ff ? 50 : 800) + e);
			return t.unsuspend = n,
				function() {
					t.unsuspend = null, clearTimeout(a), clearTimeout(i)
				}
		} : null
	}

	function no() {
		if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
			if (this.stylesheets) io(this, this.stylesheets);
			else if (this.unsuspend) {
				var t = this.unsuspend;
				this.unsuspend = null, t()
			}
		}
	}
	var ao = null;

	function io(t, e) {
		t.stylesheets = null, t.unsuspend !== null && (t.count++, ao = new Map, e.forEach(Zv, t), ao = null, no.call(t))
	}

	function Zv(t, e) {
		if (!(e.state.loading & 4)) {
			var n = ao.get(t);
			if (n) var a = n.get(null);
			else {
				n = new Map, ao.set(t, n);
				for (var i = t.querySelectorAll("link[data-precedence],style[data-precedence]"), r = 0; r < i.length; r++) {
					var s = i[r];
					(s.nodeName === "LINK" || s.getAttribute("media") !== "not all") && (n.set(s.dataset.precedence, s), a = s)
				}
				a && n.set(null, a)
			}
			i = e.instance, s = i.getAttribute("data-precedence"), r = n.get(s) || a, r === a && n.set(null, i), n.set(s, i), this.count++, a = no.bind(this), i.addEventListener("load", a), i.addEventListener("error", a), r ? r.parentNode.insertBefore(i, r.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(i, t.firstChild)), e.state.loading |= 4
		}
	}
	var ku = {
		$$typeof: Gt,
		Provider: null,
		Consumer: null,
		_currentValue: K,
		_currentValue2: K,
		_threadCount: 0
	};

	function Fv(t, e, n, a, i, r, s, v, b) {
		this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Dn(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Dn(0), this.hiddenUpdates = Dn(null), this.identifierPrefix = a, this.onUncaughtError = i, this.onCaughtError = r, this.onRecoverableError = s, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = b, this.incompleteTransitions = new Map
	}

	function hd(t, e, n, a, i, r, s, v, b, j, Q, J) {
		return t = new Fv(t, e, n, s, b, j, Q, J, v), e = 1, r === !0 && (e |= 24), r = wn(3, null, null, e), t.current = r, r.stateNode = t, e = Go(), e.refCount++, t.pooledCache = e, e.refCount++, r.memoizedState = {
			element: a,
			isDehydrated: n,
			cache: e
		}, Fo(r), t
	}

	function dd(t) {
		return t ? (t = Xn, t) : Xn
	}

	function vd(t, e, n, a, i, r) {
		i = dd(i), a.context === null ? a.context = i : a.pendingContext = i, a = Ei(e), a.payload = {
			element: n
		}, r = r === void 0 ? null : r, r !== null && (a.callback = r), n = Mi(t, a, e), n !== null && (Vn(n, t, e), Ru(n, t, e))
	}

	function md(t, e) {
		if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
			var n = t.retryLane;
			t.retryLane = n !== 0 && n < e ? n : e
		}
	}

	function sf(t, e) {
		md(t, e), (t = t.alternate) && md(t, e)
	}

	function pd(t) {
		if (t.tag === 13 || t.tag === 31) {
			var e = Cn(t, 67108864);
			e !== null && Vn(e, t, 67108864), sf(t, 67108864)
		}
	}

	function yd(t) {
		if (t.tag === 13 || t.tag === 31) {
			var e = Fn();
			e = dl(e);
			var n = Cn(t, e);
			n !== null && Vn(n, t, e), sf(t, e)
		}
	}
	var lo = !0;

	function Kv(t, e, n, a) {
		var i = _.T;
		_.T = null;
		var r = R.p;
		try {
			R.p = 2, hf(t, e, n, a)
		} finally {
			R.p = r, _.T = i
		}
	}

	function Jv(t, e, n, a) {
		var i = _.T;
		_.T = null;
		var r = R.p;
		try {
			R.p = 8, hf(t, e, n, a)
		} finally {
			R.p = r, _.T = i
		}
	}

	function hf(t, e, n, a) {
		if (lo) {
			var i = df(a);
			if (i === null) kc(t, e, a, uo, n), bd(t, a);
			else if (Iv(i, t, e, n, a)) a.stopPropagation();
			else if (bd(t, a), e & 4 && -1 < Wv.indexOf(t)) {
				for (; i !== null;) {
					var r = ui(i);
					if (r !== null) switch (r.tag) {
						case 3:
							if (r = r.stateNode, r.current.memoizedState.isDehydrated) {
								var s = Ze(r.pendingLanes);
								if (s !== 0) {
									var v = r;
									for (v.pendingLanes |= 2, v.entangledLanes |= 2; s;) {
										var b = 1 << 31 - Tt(s);
										v.entanglements[1] |= b, s &= ~b
									}
									Da(r), (be & 6) === 0 && (Gr = Ae() + 500, Zu(0))
								}
							}
							break;
						case 31:
						case 13:
							v = Cn(r, 2), v !== null && Vn(v, r, 2), Qr(), sf(r, 2)
					}
					if (r = df(a), r === null && kc(t, e, a, uo, n), r === i) break;
					i = r
				}
				i !== null && a.stopPropagation()
			} else kc(t, e, a, null, n)
		}
	}

	function df(t) {
		return t = uu(t), vf(t)
	}
	var uo = null;

	function vf(t) {
		if (uo = null, t = La(t), t !== null) {
			var e = Ht(t);
			if (e === null) t = null;
			else {
				var n = e.tag;
				if (n === 13) {
					if (t = Nt(e), t !== null) return t;
					t = null
				} else if (n === 31) {
					if (t = Ct(e), t !== null) return t;
					t = null
				} else if (n === 3) {
					if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
					t = null
				} else e !== t && (t = null)
			}
		}
		return uo = t, null
	}

	function gd(t) {
		switch (t) {
			case "beforetoggle":
			case "cancel":
			case "click":
			case "close":
			case "contextmenu":
			case "copy":
			case "cut":
			case "auxclick":
			case "dblclick":
			case "dragend":
			case "dragstart":
			case "drop":
			case "focusin":
			case "focusout":
			case "input":
			case "invalid":
			case "keydown":
			case "keypress":
			case "keyup":
			case "mousedown":
			case "mouseup":
			case "paste":
			case "pause":
			case "play":
			case "pointercancel":
			case "pointerdown":
			case "pointerup":
			case "ratechange":
			case "reset":
			case "resize":
			case "seeked":
			case "submit":
			case "toggle":
			case "touchcancel":
			case "touchend":
			case "touchstart":
			case "volumechange":
			case "change":
			case "selectionchange":
			case "textInput":
			case "compositionstart":
			case "compositionend":
			case "compositionupdate":
			case "beforeblur":
			case "afterblur":
			case "beforeinput":
			case "blur":
			case "fullscreenchange":
			case "focus":
			case "hashchange":
			case "popstate":
			case "select":
			case "selectstart":
				return 2;
			case "drag":
			case "dragenter":
			case "dragexit":
			case "dragleave":
			case "dragover":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "pointermove":
			case "pointerout":
			case "pointerover":
			case "scroll":
			case "touchmove":
			case "wheel":
			case "mouseenter":
			case "mouseleave":
			case "pointerenter":
			case "pointerleave":
				return 8;
			case "message":
				switch (tn()) {
					case d:
						return 2;
					case o:
						return 8;
					case f:
					case p:
						return 32;
					case M:
						return 268435456;
					default:
						return 32
				}
			default:
				return 32
		}
	}
	var mf = !1,
		Bi = null,
		Hi = null,
		Vi = null,
		$u = new Map,
		Pu = new Map,
		xi = [],
		Wv = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");

	function bd(t, e) {
		switch (t) {
			case "focusin":
			case "focusout":
				Bi = null;
				break;
			case "dragenter":
			case "dragleave":
				Hi = null;
				break;
			case "mouseover":
			case "mouseout":
				Vi = null;
				break;
			case "pointerover":
			case "pointerout":
				$u.delete(e.pointerId);
				break;
			case "gotpointercapture":
			case "lostpointercapture":
				Pu.delete(e.pointerId)
		}
	}

	function tr(t, e, n, a, i, r) {
		return t === null || t.nativeEvent !== r ? (t = {
			blockedOn: e,
			domEventName: n,
			eventSystemFlags: a,
			nativeEvent: r,
			targetContainers: [i]
		}, e !== null && (e = ui(e), e !== null && pd(e)), t) : (t.eventSystemFlags |= a, e = t.targetContainers, i !== null && e.indexOf(i) === -1 && e.push(i), t)
	}

	function Iv(t, e, n, a, i) {
		switch (e) {
			case "focusin":
				return Bi = tr(Bi, t, e, n, a, i), !0;
			case "dragenter":
				return Hi = tr(Hi, t, e, n, a, i), !0;
			case "mouseover":
				return Vi = tr(Vi, t, e, n, a, i), !0;
			case "pointerover":
				var r = i.pointerId;
				return $u.set(r, tr($u.get(r) || null, t, e, n, a, i)), !0;
			case "gotpointercapture":
				return r = i.pointerId, Pu.set(r, tr(Pu.get(r) || null, t, e, n, a, i)), !0
		}
		return !1
	}

	function _d(t) {
		var e = La(t.target);
		if (e !== null) {
			var n = Ht(e);
			if (n !== null) {
				if (e = n.tag, e === 13) {
					if (e = Nt(n), e !== null) {
						t.blockedOn = e, ir(t.priority, function() {
							yd(n)
						});
						return
					}
				} else if (e === 31) {
					if (e = Ct(n), e !== null) {
						t.blockedOn = e, ir(t.priority, function() {
							yd(n)
						});
						return
					}
				} else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
					t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
					return
				}
			}
		}
		t.blockedOn = null
	}

	function ro(t) {
		if (t.blockedOn !== null) return !1;
		for (var e = t.targetContainers; 0 < e.length;) {
			var n = df(t.nativeEvent);
			if (n === null) {
				n = t.nativeEvent;
				var a = new n.constructor(n.type, n);
				Sl = a, n.target.dispatchEvent(a), Sl = null
			} else return e = ui(n), e !== null && pd(e), t.blockedOn = n, !1;
			e.shift()
		}
		return !0
	}

	function Ad(t, e, n) {
		ro(t) && n.delete(e)
	}

	function kv() {
		mf = !1, Bi !== null && ro(Bi) && (Bi = null), Hi !== null && ro(Hi) && (Hi = null), Vi !== null && ro(Vi) && (Vi = null), $u.forEach(Ad), Pu.forEach(Ad)
	}

	function oo(t, e) {
		t.blockedOn === e && (t.blockedOn = null, mf || (mf = !0, rt.unstable_scheduleCallback(rt.unstable_NormalPriority, kv)))
	}
	var co = null;

	function Sd(t) {
		co !== t && (co = t, rt.unstable_scheduleCallback(rt.unstable_NormalPriority, function() {
			co === t && (co = null);
			for (var e = 0; e < t.length; e += 3) {
				var n = t[e],
					a = t[e + 1],
					i = t[e + 2];
				if (typeof a != "function") {
					if (vf(a || n) === null) continue;
					break
				}
				var r = ui(n);
				r !== null && (t.splice(e, 3), e -= 3, hc(r, {
					pending: !0,
					data: i,
					method: n.method,
					action: a
				}, a, i))
			}
		}))
	}

	function nu(t) {
		function e(b) {
			return oo(b, t)
		}
		Bi !== null && oo(Bi, t), Hi !== null && oo(Hi, t), Vi !== null && oo(Vi, t), $u.forEach(e), Pu.forEach(e);
		for (var n = 0; n < xi.length; n++) {
			var a = xi[n];
			a.blockedOn === t && (a.blockedOn = null)
		}
		for (; 0 < xi.length && (n = xi[0], n.blockedOn === null);) _d(n), n.blockedOn === null && xi.shift();
		if (n = (t.ownerDocument || t).$$reactFormReplay, n != null)
			for (a = 0; a < n.length; a += 3) {
				var i = n[a],
					r = n[a + 1],
					s = i[sn] || null;
				if (typeof r == "function") s || Sd(n);
				else if (s) {
					var v = null;
					if (r && r.hasAttribute("formAction")) {
						if (i = r, s = r[sn] || null) v = s.formAction;
						else if (vf(i) !== null) continue
					} else v = s.action;
					typeof v == "function" ? n[a + 1] = v : (n.splice(a, 3), a -= 3), Sd(n)
				}
			}
	}

	function wd() {
		function t(r) {
			r.canIntercept && r.info === "react-transition" && r.intercept({
				handler: function() {
					return new Promise(function(s) {
						return i = s
					})
				},
				focusReset: "manual",
				scroll: "manual"
			})
		}

		function e() {
			i !== null && (i(), i = null), a || setTimeout(n, 20)
		}

		function n() {
			if (!a && !navigation.transition) {
				var r = navigation.currentEntry;
				r && r.url != null && navigation.navigate(r.url, {
					state: r.getState(),
					info: "react-transition",
					history: "replace"
				})
			}
		}
		if (typeof navigation == "object") {
			var a = !1,
				i = null;
			return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(n, 100),
				function() {
					a = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), i !== null && (i(), i = null)
				}
		}
	}

	function pf(t) {
		this._internalRoot = t
	}
	fo.prototype.render = pf.prototype.render = function(t) {
		var e = this._internalRoot;
		if (e === null) throw Error(B(409));
		var n = e.current,
			a = Fn();
		vd(n, a, t, e, null, null)
	}, fo.prototype.unmount = pf.prototype.unmount = function() {
		var t = this._internalRoot;
		if (t !== null) {
			this._internalRoot = null;
			var e = t.containerInfo;
			vd(t.current, 2, null, t, null, null), Qr(), e[ja] = null
		}
	};

	function fo(t) {
		this._internalRoot = t
	}
	fo.prototype.unstable_scheduleHydration = function(t) {
		if (t) {
			var e = vl();
			t = {
				blockedOn: null,
				target: t,
				priority: e
			};
			for (var n = 0; n < xi.length && e !== 0 && e < xi[n].priority; n++);
			xi.splice(n, 0, t), n === 0 && _d(t)
		}
	};
	var Ed = I.version;
	if (Ed !== "19.2.0") throw Error(B(527, Ed, "19.2.0"));
	R.findDOMNode = function(t) {
		var e = t._reactInternals;
		if (e === void 0) throw typeof t.render == "function" ? Error(B(188)) : (t = Object.keys(t).join(","), Error(B(268, t)));
		return t = Y(e), t = t !== null ? vt(t) : null, t = t === null ? null : t.stateNode, t
	};
	var $v = {
		bundleType: 0,
		version: "19.2.0",
		rendererPackageName: "react-dom",
		currentDispatcherRef: _,
		reconcilerVersion: "19.2.0"
	};
	if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
		var so = __REACT_DEVTOOLS_GLOBAL_HOOK__;
		if (!so.isDisabled && so.supportsFiber) try {
			St = so.inject($v), Et = so
		} catch {}
	}
	return nr.createRoot = function(t, e) {
		if (!Mt(t)) throw Error(B(299));
		var n = !1,
			a = "",
			i = Ds,
			r = Us,
			s = js;
		return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (a = e.identifierPrefix), e.onUncaughtError !== void 0 && (i = e.onUncaughtError), e.onCaughtError !== void 0 && (r = e.onCaughtError), e.onRecoverableError !== void 0 && (s = e.onRecoverableError)), e = hd(t, 1, !1, null, null, n, a, null, i, r, s, wd), t[ja] = e.current, Ic(t), new pf(e)
	}, nr.hydrateRoot = function(t, e, n) {
		if (!Mt(t)) throw Error(B(299));
		var a = !1,
			i = "",
			r = Ds,
			s = Us,
			v = js,
			b = null;
		return n != null && (n.unstable_strictMode === !0 && (a = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (r = n.onUncaughtError), n.onCaughtError !== void 0 && (s = n.onCaughtError), n.onRecoverableError !== void 0 && (v = n.onRecoverableError), n.formState !== void 0 && (b = n.formState)), e = hd(t, 1, !0, e, n ?? null, a, i, b, r, s, v, wd), e.context = dd(null), n = e.current, a = Fn(), a = dl(a), i = Ei(a), i.callback = null, Mi(n, i, a), n = a, e.current.lanes = n, Jt(e, n), Da(e), t[ja] = e.current, Ic(t), new fo(e)
	}, nr.version = "19.2.0", nr
}
var Ld;

function om() {
	if (Ld) return bf.exports;
	Ld = 1;

	function rt() {
		if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(rt)
		} catch (I) {
			console.error(I)
		}
	}
	return rt(), bf.exports = rm(), bf.exports
}
var cm = om(),
	wf = {},
	ho = {
		exports: {}
	},
	fm = ho.exports,
	Nd;

function sm() {
	return Nd || (Nd = 1, (function(rt, I) {
		(function(B, Mt) {
			rt.exports = Mt()
		})(fm, () => (() => {
			var Xt = [, ((Nt, Ct, at) => {
					at.r(Ct), at.d(Ct, {
						default: () => vt
					});
					var Y = (() => {
						var it = typeof document < "u" ? document.currentScript?.src : void 0;
						return (function(ot = {}) {
							var yt, S = ot,
								Pt, re, xt = new Promise((l, u) => {
									Pt = l, re = u
								}),
								Yt = typeof window == "object",
								Gt = typeof importScripts == "function";

							function Dt() {
								function l(w) {
									const T = h;
									c = u = 0, h = new Map, T.forEach(N => {
										try {
											N(w)
										} catch (U) {
											console.error(U)
										}
									}), this.nb(), m && m.Pb()
								}
								let u = 0,
									c = 0,
									h = new Map,
									m = null,
									g = null;
								this.requestAnimationFrame = function(w) {
									u ||= requestAnimationFrame(l.bind(this));
									const T = ++c;
									return h.set(T, w), T
								}, this.cancelAnimationFrame = function(w) {
									h.delete(w), u && h.size == 0 && (cancelAnimationFrame(u), u = 0)
								}, this.Nb = function(w) {
									g && (document.body.remove(g), g = null), w || (g = document.createElement("div"), g.style.backgroundColor = "black", g.style.position = "fixed", g.style.right = 0, g.style.top = 0, g.style.color = "white", g.style.padding = "4px", g.innerHTML = "RIVE FPS", w = function(T) {
										g.innerHTML = "RIVE FPS " + T.toFixed(1)
									}, document.body.appendChild(g)), m = new function() {
										let T = 0,
											N = 0;
										this.Pb = function() {
											var U = performance.now();
											N ? (++T, U -= N, 1e3 < U && (w(1e3 * T / U), T = N = 0)) : (N = U, T = 0)
										}
									}
								}, this.Kb = function() {
									g && (document.body.remove(g), g = null), m = null
								}, this.nb = function() {}
							}

							function It(l) {
								console.assert(!0);
								const u = new Map;
								let c = -1 / 0;
								this.push = function(h) {
									return h = h + ((1 << l) - 1) >> l, u.has(h) && clearTimeout(u.get(h)), u.set(h, setTimeout(function() {
										u.delete(h), u.length == 0 ? c = -1 / 0 : h == c && (c = Math.max(...u.keys()), console.assert(c < h))
									}, 1e3)), c = Math.max(h, c), c << l
								}
							}
							const ae = S.onRuntimeInitialized;
							S.onRuntimeInitialized = function() {
								ae && ae();
								let l = S.decodeAudio;
								S.decodeAudio = function(m, g) {
									m = l(m), g(m)
								};
								let u = S.decodeFont;
								S.decodeFont = function(m, g) {
									m = u(m), g(m)
								};
								const c = S.FileAssetLoader;
								S.ptrToAsset = m => {
									let g = S.ptrToFileAsset(m);
									return g.isImage ? S.ptrToImageAsset(m) : g.isFont ? S.ptrToFontAsset(m) : g.isAudio ? S.ptrToAudioAsset(m) : g
								}, S.CustomFileAssetLoader = c.extend("CustomFileAssetLoader", {
									__construct: function({
										loadContents: m
									}) {
										this.__parent.__construct.call(this), this.Db = m
									},
									loadContents: function(m, g) {
										return m = S.ptrToAsset(m), this.Db(m, g)
									}
								}), S.CDNFileAssetLoader = c.extend("CDNFileAssetLoader", {
									__construct: function() {
										this.__parent.__construct.call(this)
									},
									loadContents: function(m) {
										let g = S.ptrToAsset(m);
										return m = g.cdnUuid, m === "" ? !1 : ((function(w, T) {
											var N = new XMLHttpRequest;
											N.responseType = "arraybuffer", N.onreadystatechange = function() {
												N.readyState == 4 && N.status == 200 && T(N)
											}, N.open("GET", w, !0), N.send(null)
										})(g.cdnBaseUrl + "/" + m, w => {
											g.decode(new Uint8Array(w.response))
										}), !0)
									}
								}), S.FallbackFileAssetLoader = c.extend("FallbackFileAssetLoader", {
									__construct: function() {
										this.__parent.__construct.call(this), this.jb = []
									},
									addLoader: function(m) {
										this.jb.push(m)
									},
									loadContents: function(m, g) {
										for (let w of this.jb)
											if (w.loadContents(m, g)) return !0;
										return !1
									}
								});
								let h = S.computeAlignment;
								S.computeAlignment = function(m, g, w, T, N = 1) {
									return h.call(this, m, g, w, T, N)
								}
							};
							const Ut = "createConicGradient createImageData createLinearGradient createPattern createRadialGradient getContextAttributes getImageData getLineDash getTransform isContextLost isPointInPath isPointInStroke measureText".split(" "),
								Me = new function() {
									function l() {
										if (!u) {
											let me = function(dt, kt, we) {
												if (kt = ut.createShader(kt), ut.shaderSource(kt, we), ut.compileShader(kt), we = ut.getShaderInfoLog(kt), 0 < (we || "").length) throw we;
												ut.attachShader(dt, kt)
											};
											var pt = me,
												C = document.createElement("canvas"),
												lt = {
													alpha: 1,
													depth: 0,
													stencil: 0,
													antialias: 0,
													premultipliedAlpha: 1,
													preserveDrawingBuffer: 0,
													powerPreference: "high-performance",
													failIfMajorPerformanceCaveat: 0,
													enableExtensionsByDefault: 1,
													explicitSwapControl: 1,
													renderViaOffscreenBackBuffer: 1
												};
											let ut;
											if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
												if (ut = C.getContext("webgl", lt), c = 1, !ut) return console.log("No WebGL support. Image mesh will not be drawn."), !1
											} else if (ut = C.getContext("webgl2", lt)) c = 2;
											else if (ut = C.getContext("webgl", lt)) c = 1;
											else return console.log("No WebGL support. Image mesh will not be drawn."), !1;
											if (ut = new Proxy(ut, {
													get(dt, kt) {
														if (dt.isContextLost()) {
															if (N || (console.error("Cannot render the mesh because the GL Context was lost. Tried to invoke ", kt), N = !0), typeof dt[kt] == "function") return function() {}
														} else return typeof dt[kt] == "function" ? function(...we) {
															return dt[kt].apply(dt, we)
														} : dt[kt]
													},
													set(dt, kt, we) {
														if (dt.isContextLost()) N || (console.error("Cannot render the mesh because the GL Context was lost. Tried to set property " + kt), N = !0);
														else return dt[kt] = we, !0
													}
												}), h = Math.min(ut.getParameter(ut.MAX_RENDERBUFFER_SIZE), ut.getParameter(ut.MAX_TEXTURE_SIZE)), C = ut.createProgram(), me(C, ut.VERTEX_SHADER, `attribute vec2 vertex;
                attribute vec2 uv;
                uniform vec4 mat;
                uniform vec2 translate;
                varying vec2 st;
                void main() {
                    st = uv;
                    gl_Position = vec4(mat2(mat) * vertex + translate, 0, 1);
                }`), me(C, ut.FRAGMENT_SHADER, `precision highp float;
                uniform sampler2D image;
                varying vec2 st;
                void main() {
                    gl_FragColor = texture2D(image, st);
                }`), ut.bindAttribLocation(C, 0, "vertex"), ut.bindAttribLocation(C, 1, "uv"), ut.linkProgram(C), lt = ut.getProgramInfoLog(C), 0 < (lt || "").trim().length) throw lt;
											m = ut.getUniformLocation(C, "mat"), g = ut.getUniformLocation(C, "translate"), ut.useProgram(C), ut.bindBuffer(ut.ARRAY_BUFFER, ut.createBuffer()), ut.enableVertexAttribArray(0), ut.enableVertexAttribArray(1), ut.bindBuffer(ut.ELEMENT_ARRAY_BUFFER, ut.createBuffer()), ut.uniform1i(ut.getUniformLocation(C, "image"), 0), ut.pixelStorei(ut.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), u = ut
										}
										return !0
									}
									let u = null,
										c = 0,
										h = 0,
										m = null,
										g = null,
										w = 0,
										T = 0,
										N = !1;
									l(), this.ac = function() {
										return l(), h
									}, this.Jb = function(C) {
										u.deleteTexture && u.deleteTexture(C)
									}, this.Ib = function(C) {
										if (!l()) return null;
										const lt = u.createTexture();
										return lt ? (u.bindTexture(u.TEXTURE_2D, lt), u.texImage2D(u.TEXTURE_2D, 0, u.RGBA, u.RGBA, u.UNSIGNED_BYTE, C), u.texParameteri(u.TEXTURE_2D, u.TEXTURE_WRAP_S, u.CLAMP_TO_EDGE), u.texParameteri(u.TEXTURE_2D, u.TEXTURE_WRAP_T, u.CLAMP_TO_EDGE), u.texParameteri(u.TEXTURE_2D, u.TEXTURE_MAG_FILTER, u.LINEAR), c == 2 ? (u.texParameteri(u.TEXTURE_2D, u.TEXTURE_MIN_FILTER, u.LINEAR_MIPMAP_LINEAR), u.generateMipmap(u.TEXTURE_2D)) : u.texParameteri(u.TEXTURE_2D, u.TEXTURE_MIN_FILTER, u.LINEAR), lt) : null
									};
									const U = new It(8),
										nt = new It(8),
										ht = new It(10),
										_t = new It(10);
									this.Mb = function(C, lt, pt, ut, me) {
										if (l()) {
											var dt = U.push(C),
												kt = nt.push(lt);
											if (u.canvas) {
												(u.canvas.width != dt || u.canvas.height != kt) && (u.canvas.width = dt, u.canvas.height = kt), u.viewport(0, kt - lt, C, lt), u.disable(u.SCISSOR_TEST), u.clearColor(0, 0, 0, 0), u.clear(u.COLOR_BUFFER_BIT), u.enable(u.SCISSOR_TEST), pt.sort((ne, Yn) => Yn.ub - ne.ub), dt = ht.push(ut), w != dt && (u.bufferData(u.ARRAY_BUFFER, 8 * dt, u.DYNAMIC_DRAW), w = dt), dt = 0;
												for (var we of pt) u.bufferSubData(u.ARRAY_BUFFER, dt, we.Sa), dt += 4 * we.Sa.length;
												console.assert(dt == 4 * ut);
												for (var Ke of pt) u.bufferSubData(u.ARRAY_BUFFER, dt, Ke.Ab), dt += 4 * Ke.Ab.length;
												console.assert(dt == 8 * ut), dt = _t.push(me), T != dt && (u.bufferData(u.ELEMENT_ARRAY_BUFFER, 2 * dt, u.DYNAMIC_DRAW), T = dt), we = 0;
												for (var jn of pt) u.bufferSubData(u.ELEMENT_ARRAY_BUFFER, we, jn.indices), we += 2 * jn.indices.length;
												console.assert(we == 2 * me), jn = 0, Ke = !0, dt = we = 0;
												for (const ne of pt) {
													ne.image.Ia != jn && (u.bindTexture(u.TEXTURE_2D, ne.image.Ha || null), jn = ne.image.Ia), ne.fc ? (u.scissor(ne.Ya, kt - ne.Za - ne.ib, ne.tc, ne.ib), Ke = !0) : Ke && (u.scissor(0, kt - lt, C, lt), Ke = !1), pt = 2 / C;
													const Yn = -2 / lt;
													u.uniform4f(m, ne.ga[0] * pt * ne.za, ne.ga[1] * Yn * ne.Aa, ne.ga[2] * pt * ne.za, ne.ga[3] * Yn * ne.Aa), u.uniform2f(g, ne.ga[4] * pt * ne.za + pt * (ne.Ya - ne.bc * ne.za) - 1, ne.ga[5] * Yn * ne.Aa + Yn * (ne.Za - ne.cc * ne.Aa) + 1), u.vertexAttribPointer(0, 2, u.FLOAT, !1, 0, dt), u.vertexAttribPointer(1, 2, u.FLOAT, !1, 0, dt + 4 * ut), u.drawElements(u.TRIANGLES, ne.indices.length, u.UNSIGNED_SHORT, we), dt += 4 * ne.Sa.length, we += 2 * ne.indices.length
												}
												console.assert(dt == 4 * ut), console.assert(we == 2 * me)
											}
										}
									}, this.canvas = function() {
										return l() && u.canvas
									}
								},
								ct = S.onRuntimeInitialized;
							S.onRuntimeInitialized = function() {
								function l($) {
									switch ($) {
										case U.srcOver:
											return "source-over";
										case U.screen:
											return "screen";
										case U.overlay:
											return "overlay";
										case U.darken:
											return "darken";
										case U.lighten:
											return "lighten";
										case U.colorDodge:
											return "color-dodge";
										case U.colorBurn:
											return "color-burn";
										case U.hardLight:
											return "hard-light";
										case U.softLight:
											return "soft-light";
										case U.difference:
											return "difference";
										case U.exclusion:
											return "exclusion";
										case U.multiply:
											return "multiply";
										case U.hue:
											return "hue";
										case U.saturation:
											return "saturation";
										case U.color:
											return "color";
										case U.luminosity:
											return "luminosity"
									}
								}

								function u($) {
									return "rgba(" + ((16711680 & $) >>> 16) + "," + ((65280 & $) >>> 8) + "," + ((255 & $) >>> 0) + "," + ((4278190080 & $) >>> 24) / 255 + ")"
								}

								function c() {
									0 < kt.length && (Me.Mb(dt.drawWidth(), dt.drawHeight(), kt, we, Ke), kt = [], Ke = we = 0, dt.reset(512, 512));
									for (const $ of me) {
										for (const st of $.H) st();
										$.H = []
									}
									me.clear()
								}
								ct && ct();
								var h = S.RenderPaintStyle;
								const m = S.RenderPath,
									g = S.RenderPaint,
									w = S.Renderer,
									T = S.StrokeCap,
									N = S.StrokeJoin,
									U = S.BlendMode,
									nt = h.fill,
									ht = h.stroke,
									_t = S.FillRule.evenOdd;
								let C = 1;
								var lt = S.RenderImage.extend("CanvasRenderImage", {
										__construct: function({
											ka: $,
											va: st
										} = {}) {
											this.__parent.__construct.call(this), this.Ia = C, C = C + 1 & 2147483647 || 1, this.ka = $, this.va = st
										},
										__destruct: function() {
											this.Ha && (Me.Jb(this.Ha), URL.revokeObjectURL(this.Va)), this.__parent.__destruct.call(this)
										},
										decode: function($) {
											var st = this;
											st.va && st.va(st);
											var $t = new Image;
											st.Va = URL.createObjectURL(new Blob([$], {
												type: "image/png"
											})), $t.onload = function() {
												st.Cb = $t, st.Ha = Me.Ib($t), st.size($t.width, $t.height), st.ka && st.ka(st)
											}, $t.src = st.Va
										}
									}),
									pt = m.extend("CanvasRenderPath", {
										__construct: function() {
											this.__parent.__construct.call(this), this.T = new Path2D
										},
										rewind: function() {
											this.T = new Path2D
										},
										addPath: function($, st, $t, oe, Ft, ie, he) {
											var de = this.T,
												Tn = de.addPath;
											$ = $.T;
											const Ee = new DOMMatrix;
											Ee.a = st, Ee.b = $t, Ee.c = oe, Ee.d = Ft, Ee.e = ie, Ee.f = he, Tn.call(de, $, Ee)
										},
										fillRule: function($) {
											this.Ua = $
										},
										moveTo: function($, st) {
											this.T.moveTo($, st)
										},
										lineTo: function($, st) {
											this.T.lineTo($, st)
										},
										cubicTo: function($, st, $t, oe, Ft, ie) {
											this.T.bezierCurveTo($, st, $t, oe, Ft, ie)
										},
										close: function() {
											this.T.closePath()
										}
									}),
									ut = g.extend("CanvasRenderPaint", {
										color: function($) {
											this.Wa = u($)
										},
										thickness: function($) {
											this.Fb = $
										},
										join: function($) {
											switch ($) {
												case N.miter:
													this.Ga = "miter";
													break;
												case N.round:
													this.Ga = "round";
													break;
												case N.bevel:
													this.Ga = "bevel"
											}
										},
										cap: function($) {
											switch ($) {
												case T.butt:
													this.Fa = "butt";
													break;
												case T.round:
													this.Fa = "round";
													break;
												case T.square:
													this.Fa = "square"
											}
										},
										style: function($) {
											this.Eb = $
										},
										blendMode: function($) {
											this.Bb = l($)
										},
										clearGradient: function() {
											this.ia = null
										},
										linearGradient: function($, st, $t, oe) {
											this.ia = {
												wb: $,
												xb: st,
												bb: $t,
												cb: oe,
												Pa: []
											}
										},
										radialGradient: function($, st, $t, oe) {
											this.ia = {
												wb: $,
												xb: st,
												bb: $t,
												cb: oe,
												Pa: [],
												$b: !0
											}
										},
										addStop: function($, st) {
											this.ia.Pa.push({
												color: $,
												stop: st
											})
										},
										completeGradient: function() {},
										draw: function($, st, $t) {
											let oe = this.Eb;
											var Ft = this.Wa,
												ie = this.ia;
											if ($.globalCompositeOperation = this.Bb, ie != null) {
												Ft = ie.wb;
												var he = ie.xb;
												const Tn = ie.bb;
												var de = ie.cb;
												const Ee = ie.Pa;
												ie.$b ? (ie = Tn - Ft, de -= he, Ft = $.createRadialGradient(Ft, he, 0, Ft, he, Math.sqrt(ie * ie + de * de))) : Ft = $.createLinearGradient(Ft, he, Tn, de);
												for (let dn = 0, ge = Ee.length; dn < ge; dn++) he = Ee[dn], Ft.addColorStop(he.stop, u(he.color));
												this.Wa = Ft, this.ia = null
											}
											switch (oe) {
												case ht:
													$.strokeStyle = Ft, $.lineWidth = this.Fb, $.lineCap = this.Fa, $.lineJoin = this.Ga, $.stroke(st);
													break;
												case nt:
													$.fillStyle = Ft, $.fill(st, $t)
											}
										}
									});
								const me = new Set;
								let dt = null,
									kt = [],
									we = 0,
									Ke = 0;
								var jn = S.CanvasRenderer = w.extend("Renderer", {
									__construct: function($) {
										this.__parent.__construct.call(this), this.S = [1, 0, 0, 1, 0, 0], this.B = $.getContext("2d"), this.Ta = $, this.H = []
									},
									save: function() {
										this.S.push(...this.S.slice(this.S.length - 6)), this.H.push(this.B.save.bind(this.B))
									},
									restore: function() {
										const $ = this.S.length - 6;
										if (6 > $) throw "restore() called without matching save().";
										this.S.splice($), this.H.push(this.B.restore.bind(this.B))
									},
									transform: function($, st, $t, oe, Ft, ie) {
										const he = this.S,
											de = he.length - 6;
										he.splice(de, 6, he[de] * $ + he[de + 2] * st, he[de + 1] * $ + he[de + 3] * st, he[de] * $t + he[de + 2] * oe, he[de + 1] * $t + he[de + 3] * oe, he[de] * Ft + he[de + 2] * ie + he[de + 4], he[de + 1] * Ft + he[de + 3] * ie + he[de + 5]), this.H.push(this.B.transform.bind(this.B, $, st, $t, oe, Ft, ie))
									},
									rotate: function($) {
										const st = Math.sin($);
										$ = Math.cos($), this.transform($, st, -st, $, 0, 0)
									},
									_drawPath: function($, st) {
										this.H.push(st.draw.bind(st, this.B, $.T, $.Ua === _t ? "evenodd" : "nonzero"))
									},
									_drawRiveImage: function($, st, $t, oe) {
										var Ft = $.Cb;
										if (Ft) {
											var ie = this.B,
												he = l($t);
											this.H.push(function() {
												ie.globalCompositeOperation = he, ie.globalAlpha = oe, ie.drawImage(Ft, 0, 0), ie.globalAlpha = 1
											})
										}
									},
									_getMatrix: function($) {
										const st = this.S,
											$t = st.length - 6;
										for (let oe = 0; 6 > oe; ++oe) $[oe] = st[$t + oe]
									},
									_drawImageMesh: function($, st, $t, oe, Ft, ie, he, de, Tn, Ee, dn) {
										st = this.B.canvas.width;
										var ge = this.B.canvas.height;
										const xa = Ee - de,
											Ul = dn - Tn;
										de = Math.max(de, 0), Tn = Math.max(Tn, 0), Ee = Math.min(Ee, st), dn = Math.min(dn, ge);
										const Ta = Ee - de,
											Ca = dn - Tn;
										if (console.assert(Ta <= Math.min(xa, st)), console.assert(Ca <= Math.min(Ul, ge)), !(0 >= Ta || 0 >= Ca)) {
											Ee = Ta < xa || Ca < Ul, st = dn = 1;
											var pa = Math.ceil(Ta * dn),
												Cn = Math.ceil(Ca * st);
											ge = Me.ac(), pa > ge && (dn *= ge / pa, pa = ge), Cn > ge && (st *= ge / Cn, Cn = ge), dt || (dt = new S.DynamicRectanizer(ge), dt.reset(512, 512)), ge = dt.addRect(pa, Cn), 0 > ge && (c(), me.add(this), ge = dt.addRect(pa, Cn), console.assert(0 <= ge));
											var Su = ge & 65535,
												Pi = ge >> 16;
											kt.push({
												ga: this.S.slice(this.S.length - 6),
												image: $,
												Ya: Su,
												Za: Pi,
												bc: de,
												cc: Tn,
												tc: pa,
												ib: Cn,
												za: dn,
												Aa: st,
												Sa: new Float32Array(Ft),
												Ab: new Float32Array(ie),
												indices: new Uint16Array(he),
												fc: Ee,
												ub: $.Ia << 1 | (Ee ? 1 : 0)
											}), we += Ft.length, Ke += he.length;
											var Xn = this.B,
												Do = l($t);
											this.H.push(function() {
												Xn.save(), Xn.resetTransform(), Xn.globalCompositeOperation = Do, Xn.globalAlpha = oe;
												const wn = Me.canvas();
												wn && Xn.drawImage(wn, Su, Pi, pa, Cn, de, Tn, Ta, Ca), Xn.restore()
											})
										}
									},
									_clipPath: function($) {
										this.H.push(this.B.clip.bind(this.B, $.T, $.Ua === _t ? "evenodd" : "nonzero"))
									},
									clear: function() {
										me.add(this), this.H.push(this.B.clearRect.bind(this.B, 0, 0, this.Ta.width, this.Ta.height))
									},
									flush: function() {},
									translate: function($, st) {
										this.transform(1, 0, 0, 1, $, st)
									}
								});
								S.makeRenderer = function($) {
									const st = new jn($),
										$t = st.B;
									return new Proxy(st, {
										get(oe, Ft) {
											if (typeof oe[Ft] == "function") return function(...ie) {
												return oe[Ft].apply(oe, ie)
											};
											if (typeof $t[Ft] == "function") {
												if (-1 < Ut.indexOf(Ft)) throw Error("RiveException: Method call to '" + Ft + "()' is not allowed, as the renderer cannot immediately pass through the return                 values of any canvas 2d context methods.");
												return function(...ie) {
													st.H.push($t[Ft].bind($t, ...ie))
												}
											}
											return oe[Ft]
										},
										set(oe, Ft, ie) {
											if (Ft in $t) return st.H.push(() => {
												$t[Ft] = ie
											}), !0
										}
									})
								}, S.decodeImage = function($, st) {
									new lt({
										ka: st
									}).decode($)
								}, S.renderFactory = {
									makeRenderPaint: function() {
										return new ut
									},
									makeRenderPath: function() {
										return new pt
									},
									makeRenderImage: function() {
										let $ = Yn;
										return new lt({
											va: () => {
												$.total++
											},
											ka: () => {
												if ($.loaded++, $.loaded === $.total) {
													const st = $.ready;
													st && (st(), $.ready = null)
												}
											}
										})
									}
								};
								let ne = S.load,
									Yn = null;
								S.load = function($, st, $t = !0) {
									const oe = new S.FallbackFileAssetLoader;
									return st !== void 0 && oe.addLoader(st), $t && (st = new S.CDNFileAssetLoader, oe.addLoader(st)), new Promise(function(Ft) {
										let ie = null;
										Yn = {
											total: 0,
											loaded: 0,
											ready: function() {
												Ft(ie)
											}
										}, ie = ne($, oe), Yn.total == 0 && Ft(ie)
									})
								};
								let Va = S.RendererWrapper.prototype.align;
								S.RendererWrapper.prototype.align = function($, st, $t, oe, Ft = 1) {
									Va.call(this, $, st, $t, oe, Ft)
								}, h = new Dt, S.requestAnimationFrame = h.requestAnimationFrame.bind(h), S.cancelAnimationFrame = h.cancelAnimationFrame.bind(h), S.enableFPSCounter = h.Nb.bind(h), S.disableFPSCounter = h.Kb, h.nb = c, S.resolveAnimationFrame = c, S.cleanup = function() {
									dt && dt.delete()
								}
							};
							var ft = Object.assign({}, S),
								E = "./this.program",
								Z = "",
								V, z;
							(Yt || Gt) && (Gt ? Z = self.location.href : typeof document < "u" && document.currentScript && (Z = document.currentScript.src), it && (Z = it), Z.startsWith("blob:") ? Z = "" : Z = Z.substr(0, Z.replace(/[?#].*/, "").lastIndexOf("/") + 1), Gt && (z = l => {
								var u = new XMLHttpRequest;
								return u.open("GET", l, !1), u.responseType = "arraybuffer", u.send(null), new Uint8Array(u.response)
							}), V = (l, u, c) => {
								if (Kn(l)) {
									var h = new XMLHttpRequest;
									h.open("GET", l, !0), h.responseType = "arraybuffer", h.onload = () => {
										h.status == 200 || h.status == 0 && h.response ? u(h.response) : c()
									}, h.onerror = c, h.send(null)
								} else fetch(l, {
									credentials: "same-origin"
								}).then(m => m.ok ? m.arrayBuffer() : Promise.reject(Error(m.status + " : " + m.url))).then(u, c)
							});
							var x = S.print || console.log.bind(console),
								_ = S.printErr || console.error.bind(console);
							Object.assign(S, ft), ft = null, S.thisProgram && (E = S.thisProgram);
							var R;
							S.wasmBinary && (R = S.wasmBinary);
							var K, G = !1,
								P, y, L, k, W, tt, gt, zt;

							function Bt() {
								var l = K.buffer;
								S.HEAP8 = P = new Int8Array(l), S.HEAP16 = L = new Int16Array(l), S.HEAPU8 = y = new Uint8Array(l), S.HEAPU16 = k = new Uint16Array(l), S.HEAP32 = W = new Int32Array(l), S.HEAPU32 = tt = new Uint32Array(l), S.HEAPF32 = gt = new Float32Array(l), S.HEAPF64 = zt = new Float64Array(l)
							}
							var Zt = [],
								te = [],
								Le = [];

							function Rt() {
								var l = S.preRun.shift();
								Zt.unshift(l)
							}
							var ee = 0,
								_e = null;

							function ve(l) {
								throw S.onAbort?.(l), l = "Aborted(" + l + ")", _(l), G = !0, l = new WebAssembly.RuntimeError(l + ". Build with -sASSERTIONS for more info."), re(l), l
							}
							var on = l => l.startsWith("data:application/octet-stream;base64,"),
								Kn = l => l.startsWith("file://"),
								Oe;

							function qt(l) {
								if (l == Oe && R) return new Uint8Array(R);
								if (z) return z(l);
								throw "both async and sync fetching of the wasm failed"
							}

							function xn(l) {
								return R ? Promise.resolve().then(() => qt(l)) : new Promise((u, c) => {
									V(l, h => u(new Uint8Array(h)), () => {
										try {
											u(qt(l))
										} catch (h) {
											c(h)
										}
									})
								})
							}

							function Qe(l, u, c) {
								return xn(l).then(h => WebAssembly.instantiate(h, u)).then(c, h => {
									_(`failed to asynchronously prepare wasm: ${h}`), ve(h)
								})
							}

							function Ua(l, u) {
								var c = Oe;
								return R || typeof WebAssembly.instantiateStreaming != "function" || on(c) || Kn(c) || typeof fetch != "function" ? Qe(c, l, u) : fetch(c, {
									credentials: "same-origin"
								}).then(h => WebAssembly.instantiateStreaming(h, l).then(u, function(m) {
									return _(`wasm streaming compile failed: ${m}`), _("falling back to ArrayBuffer instantiation"), Qe(c, l, u)
								}))
							}
							var gn, Ae, tn = {
									464256: (l, u, c, h, m) => {
										if (typeof window > "u" || (window.AudioContext || window.webkitAudioContext) === void 0) return 0;
										if (typeof window.h > "u") {
											window.h = {
												ya: 0
											}, window.h.I = {}, window.h.I.wa = l, window.h.I.capture = u, window.h.I.Ja = c, window.h.fa = {}, window.h.fa.stopped = h, window.h.fa.vb = m;
											let g = window.h;
											g.D = [], g.rc = function(w) {
												for (var T = 0; T < g.D.length; ++T)
													if (g.D[T] == null) return g.D[T] = w, T;
												return g.D.push(w), g.D.length - 1
											}, g.zb = function(w) {
												for (g.D[w] = null; 0 < g.D.length && g.D[g.D.length - 1] == null;) g.D.pop()
											}, g.Oc = function(w) {
												for (var T = 0; T < g.D.length; ++T)
													if (g.D[T] == w) return g.zb(T)
											}, g.pa = function(w) {
												return g.D[w]
											}, g.Ra = ["touchend", "click"], g.unlock = function() {
												for (var w = 0; w < g.D.length; ++w) {
													var T = g.D[w];
													T != null && T.K != null && T.state === g.fa.vb && T.K.resume().then(() => {
														$i(T.ob)
													}, N => {
														console.error("Failed to resume audiocontext", N)
													})
												}
												g.Ra.map(function(N) {
													document.removeEventListener(N, g.unlock, !0)
												})
											}, g.Ra.map(function(w) {
												document.addEventListener(w, g.unlock, !0)
											})
										}
										return window.h.ya += 1, 1
									},
									466434: () => {
										typeof window.h < "u" && (window.h.Ra.map(function(l) {
											document.removeEventListener(l, window.h.unlock, !0)
										}), --window.h.ya, window.h.ya === 0 && delete window.h)
									},
									466738: () => navigator.mediaDevices !== void 0 && navigator.mediaDevices.getUserMedia !== void 0,
									466842: () => {
										try {
											var l = new(window.AudioContext || window.webkitAudioContext),
												u = l.sampleRate;
											return l.close(), u
										} catch {
											return 0
										}
									},
									467013: (l, u, c, h, m, g) => {
										if (typeof window.h > "u") return -1;
										var w = {},
											T = {};
										return l == window.h.I.wa && c != 0 && (T.sampleRate = c), w.K = new(window.AudioContext || window.webkitAudioContext)(T), w.K.suspend(), w.state = window.h.fa.stopped, c = 0, l != window.h.I.wa && (c = u), w.Y = w.K.createScriptProcessor(h, c, u), w.Y.onaudioprocess = function(N) {
											if ((w.qa == null || w.qa.length == 0) && (w.qa = new Float32Array(gt.buffer, m, h * u)), l == window.h.I.capture || l == window.h.I.Ja) {
												for (var U = 0; U < u; U += 1)
													for (var nt = N.inputBuffer.getChannelData(U), ht = w.qa, _t = 0; _t < h; _t += 1) ht[_t * u + U] = nt[_t];
												_u(g, h, m)
											}
											if (l == window.h.I.wa || l == window.h.I.Ja)
												for (Au(g, h, m), U = 0; U < N.outputBuffer.numberOfChannels; ++U)
													for (nt = N.outputBuffer.getChannelData(U), ht = w.qa, _t = 0; _t < h; _t += 1) nt[_t] = ht[_t * u + U];
											else
												for (U = 0; U < N.outputBuffer.numberOfChannels; ++U) N.outputBuffer.getChannelData(U).fill(0)
										}, l != window.h.I.capture && l != window.h.I.Ja || navigator.mediaDevices.getUserMedia({
											audio: !0,
											video: !1
										}).then(function(N) {
											w.Ba = w.K.createMediaStreamSource(N), w.Ba.connect(w.Y), w.Y.connect(w.K.destination)
										}).catch(function(N) {
											console.log("Failed to get user media: " + N)
										}), l == window.h.I.wa && w.Y.connect(w.K.destination), w.ob = g, window.h.rc(w)
									},
									469890: l => window.h.pa(l).K.sampleRate,
									469963: l => {
										l = window.h.pa(l), l.Y !== void 0 && (l.Y.onaudioprocess = function() {}, l.Y.disconnect(), l.Y = void 0), l.Ba !== void 0 && (l.Ba.disconnect(), l.Ba = void 0), l.K.close(), l.K = void 0, l.ob = void 0
									},
									470363: l => {
										window.h.zb(l)
									},
									470413: l => {
										l = window.h.pa(l), l.K.resume(), l.state = window.h.fa.vb
									},
									470552: l => {
										l = window.h.pa(l), l.K.suspend(), l.state = window.h.fa.stopped
									}
								},
								d = l => {
									for (; 0 < l.length;) l.shift()(S)
								};

							function o() {
								var l = W[+ri >> 2];
								return ri += 4, l
							}
							var f = (l, u) => {
									for (var c = 0, h = l.length - 1; 0 <= h; h--) {
										var m = l[h];
										m === "." ? l.splice(h, 1) : m === ".." ? (l.splice(h, 1), c++) : c && (l.splice(h, 1), c--)
									}
									if (u)
										for (; c; c--) l.unshift("..");
									return l
								},
								p = l => {
									var u = l.charAt(0) === "/",
										c = l.substr(-1) === "/";
									return (l = f(l.split("/").filter(h => !!h), !u).join("/")) || u || (l = "."), l && c && (l += "/"), (u ? "/" : "") + l
								},
								M = l => {
									var u = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(l).slice(1);
									return l = u[0], u = u[1], !l && !u ? "." : (u &&= u.substr(0, u.length - 1), l + u)
								},
								q = l => {
									if (l === "/") return "/";
									l = p(l), l = l.replace(/\/$/, "");
									var u = l.lastIndexOf("/");
									return u === -1 ? l : l.substr(u + 1)
								},
								et = () => {
									if (typeof crypto == "object" && typeof crypto.getRandomValues == "function") return l => crypto.getRandomValues(l);
									ve("initRandomDevice")
								},
								St = l => (St = et())(l),
								Et = (...l) => {
									for (var u = "", c = !1, h = l.length - 1; - 1 <= h && !c; h--) {
										if (c = 0 <= h ? l[h] : "/", typeof c != "string") throw new TypeError("Arguments to path.resolve must be strings");
										if (!c) return "";
										u = c + "/" + u, c = c.charAt(0) === "/"
									}
									return u = f(u.split("/").filter(m => !!m), !c).join("/"), (c ? "/" : "") + u || "."
								},
								mt = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0,
								Tt = (l, u, c) => {
									var h = u + c;
									for (c = u; l[c] && !(c >= h);) ++c;
									if (16 < c - u && l.buffer && mt) return mt.decode(l.subarray(u, c));
									for (h = ""; u < c;) {
										var m = l[u++];
										if (m & 128) {
											var g = l[u++] & 63;
											if ((m & 224) == 192) h += String.fromCharCode((m & 31) << 6 | g);
											else {
												var w = l[u++] & 63;
												m = (m & 240) == 224 ? (m & 15) << 12 | g << 6 | w : (m & 7) << 18 | g << 12 | w << 6 | l[u++] & 63, 65536 > m ? h += String.fromCharCode(m) : (m -= 65536, h += String.fromCharCode(55296 | m >> 10, 56320 | m & 1023))
											}
										} else h += String.fromCharCode(m)
									}
									return h
								},
								Se = [],
								en = l => {
									for (var u = 0, c = 0; c < l.length; ++c) {
										var h = l.charCodeAt(c);
										127 >= h ? u++ : 2047 >= h ? u += 2 : 55296 <= h && 57343 >= h ? (u += 4, ++c) : u += 3
									}
									return u
								},
								Ne = (l, u, c, h) => {
									if (!(0 < h)) return 0;
									var m = c;
									h = c + h - 1;
									for (var g = 0; g < l.length; ++g) {
										var w = l.charCodeAt(g);
										if (55296 <= w && 57343 >= w) {
											var T = l.charCodeAt(++g);
											w = 65536 + ((w & 1023) << 10) | T & 1023
										}
										if (127 >= w) {
											if (c >= h) break;
											u[c++] = w
										} else {
											if (2047 >= w) {
												if (c + 1 >= h) break;
												u[c++] = 192 | w >> 6
											} else {
												if (65535 >= w) {
													if (c + 2 >= h) break;
													u[c++] = 224 | w >> 12
												} else {
													if (c + 3 >= h) break;
													u[c++] = 240 | w >> 18, u[c++] = 128 | w >> 12 & 63
												}
												u[c++] = 128 | w >> 6 & 63
											}
											u[c++] = 128 | w & 63
										}
									}
									return u[c] = 0, c - m
								};

							function bn(l, u) {
								var c = Array(en(l) + 1);
								return l = Ne(l, c, 0, c.length), u && (c.length = l), c
							}
							var cn = [];

							function nn(l, u) {
								cn[l] = {
									input: [],
									G: [],
									V: u
								}, _a(l, Ze)
							}
							var Ze = {
									open(l) {
										var u = cn[l.node.xa];
										if (!u) throw new bt(43);
										l.s = u, l.seekable = !1
									},
									close(l) {
										l.s.V.oa(l.s)
									},
									oa(l) {
										l.s.V.oa(l.s)
									},
									read(l, u, c, h) {
										if (!l.s || !l.s.V.hb) throw new bt(60);
										for (var m = 0, g = 0; g < h; g++) {
											try {
												var w = l.s.V.hb(l.s)
											} catch {
												throw new bt(29)
											}
											if (w === void 0 && m === 0) throw new bt(6);
											if (w == null) break;
											m++, u[c + g] = w
										}
										return m && (l.node.timestamp = Date.now()), m
									},
									write(l, u, c, h) {
										if (!l.s || !l.s.V.Ma) throw new bt(60);
										try {
											for (var m = 0; m < h; m++) l.s.V.Ma(l.s, u[c + m])
										} catch {
											throw new bt(29)
										}
										return h && (l.node.timestamp = Date.now()), m
									}
								},
								fn = {
									hb() {
										t: {
											if (!Se.length) {
												var l = null;
												if (typeof window < "u" && typeof window.prompt == "function" && (l = window.prompt("Input: "), l !== null && (l += `
`)), !l) {
													l = null;
													break t
												}
												Se = bn(l, !0)
											}
											l = Se.shift()
										}
										return l
									},
									Ma(l, u) {
										u === null || u === 10 ? (x(Tt(l.G, 0)), l.G = []) : u != 0 && l.G.push(u)
									},
									oa(l) {
										l.G && 0 < l.G.length && (x(Tt(l.G, 0)), l.G = [])
									},
									Xb() {
										return {
											zc: 25856,
											Bc: 5,
											yc: 191,
											Ac: 35387,
											xc: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
										}
									},
									Yb() {
										return 0
									},
									Zb() {
										return [24, 80]
									}
								},
								zn = {
									Ma(l, u) {
										u === null || u === 10 ? (_(Tt(l.G, 0)), l.G = []) : u != 0 && l.G.push(u)
									},
									oa(l) {
										l.G && 0 < l.G.length && (_(Tt(l.G, 0)), l.G = [])
									}
								};

							function fa(l, u) {
								var c = l.l ? l.l.length : 0;
								c >= u || (u = Math.max(u, c * (1048576 > c ? 2 : 1.125) >>> 0), c != 0 && (u = Math.max(u, 256)), c = l.l, l.l = new Uint8Array(u), 0 < l.v && l.l.set(c.subarray(0, l.v), 0))
							}
							var Vt = {
									N: null,
									U() {
										return Vt.createNode(null, "/", 16895, 0)
									},
									createNode(l, u, c, h) {
										if ((c & 61440) === 24576 || (c & 61440) === 4096) throw new bt(63);
										return Vt.N || (Vt.N = {
											dir: {
												node: {
													X: Vt.j.X,
													P: Vt.j.P,
													ja: Vt.j.ja,
													ta: Vt.j.ta,
													sb: Vt.j.sb,
													yb: Vt.j.yb,
													tb: Vt.j.tb,
													rb: Vt.j.rb,
													Ca: Vt.j.Ca
												},
												stream: {
													aa: Vt.m.aa
												}
											},
											file: {
												node: {
													X: Vt.j.X,
													P: Vt.j.P
												},
												stream: {
													aa: Vt.m.aa,
													read: Vt.m.read,
													write: Vt.m.write,
													Xa: Vt.m.Xa,
													kb: Vt.m.kb,
													mb: Vt.m.mb
												}
											},
											link: {
												node: {
													X: Vt.j.X,
													P: Vt.j.P,
													la: Vt.j.la
												},
												stream: {}
											},
											$a: {
												node: {
													X: Vt.j.X,
													P: Vt.j.P
												},
												stream: Gi
											}
										}), c = lr(l, u, c, h), (c.mode & 61440) === 16384 ? (c.j = Vt.N.dir.node, c.m = Vt.N.dir.stream, c.l = {}) : (c.mode & 61440) === 32768 ? (c.j = Vt.N.file.node, c.m = Vt.N.file.stream, c.v = 0, c.l = null) : (c.mode & 61440) === 40960 ? (c.j = Vt.N.link.node, c.m = Vt.N.link.stream) : (c.mode & 61440) === 8192 && (c.j = Vt.N.$a.node, c.m = Vt.N.$a.stream), c.timestamp = Date.now(), l && (l.l[u] = c, l.timestamp = c.timestamp), c
									},
									Fc(l) {
										return l.l ? l.l.subarray ? l.l.subarray(0, l.v) : new Uint8Array(l.l) : new Uint8Array(0)
									},
									j: {
										X(l) {
											var u = {};
											return u.Dc = (l.mode & 61440) === 8192 ? l.id : 1, u.Hc = l.id, u.mode = l.mode, u.Kc = 1, u.uid = 0, u.Gc = 0, u.xa = l.xa, (l.mode & 61440) === 16384 ? u.size = 4096 : (l.mode & 61440) === 32768 ? u.size = l.v : (l.mode & 61440) === 40960 ? u.size = l.link.length : u.size = 0, u.vc = new Date(l.timestamp), u.Jc = new Date(l.timestamp), u.Cc = new Date(l.timestamp), u.Gb = 4096, u.wc = Math.ceil(u.size / u.Gb), u
										},
										P(l, u) {
											if (u.mode !== void 0 && (l.mode = u.mode), u.timestamp !== void 0 && (l.timestamp = u.timestamp), u.size !== void 0 && (u = u.size, l.v != u))
												if (u == 0) l.l = null, l.v = 0;
												else {
													var c = l.l;
													l.l = new Uint8Array(u), c && l.l.set(c.subarray(0, Math.min(u, l.v))), l.v = u
												}
										},
										ja() {
											throw vl[44]
										},
										ta(l, u, c, h) {
											return Vt.createNode(l, u, c, h)
										},
										sb(l, u, c) {
											if ((l.mode & 61440) === 16384) {
												try {
													var h = ii(u, c)
												} catch {}
												if (h)
													for (var m in h.l) throw new bt(55)
											}
											delete l.parent.l[l.name], l.parent.timestamp = Date.now(), l.name = c, u.l[c] = l, u.timestamp = l.parent.timestamp
										},
										yb(l, u) {
											delete l.l[u], l.timestamp = Date.now()
										},
										tb(l, u) {
											var c = ii(l, u),
												h;
											for (h in c.l) throw new bt(55);
											delete l.l[u], l.timestamp = Date.now()
										},
										rb(l) {
											var u = [".", ".."],
												c;
											for (c of Object.keys(l.l)) u.push(c);
											return u
										},
										Ca(l, u, c) {
											return l = Vt.createNode(l, u, 41471, 0), l.link = c, l
										},
										la(l) {
											if ((l.mode & 61440) !== 40960) throw new bt(28);
											return l.link
										}
									},
									m: {
										read(l, u, c, h, m) {
											var g = l.node.l;
											if (m >= l.node.v) return 0;
											if (l = Math.min(l.node.v - m, h), 8 < l && g.subarray) u.set(g.subarray(m, m + l), c);
											else
												for (h = 0; h < l; h++) u[c + h] = g[m + h];
											return l
										},
										write(l, u, c, h, m, g) {
											if (u.buffer === P.buffer && (g = !1), !h) return 0;
											if (l = l.node, l.timestamp = Date.now(), u.subarray && (!l.l || l.l.subarray)) {
												if (g) return l.l = u.subarray(c, c + h), l.v = h;
												if (l.v === 0 && m === 0) return l.l = u.slice(c, c + h), l.v = h;
												if (m + h <= l.v) return l.l.set(u.subarray(c, c + h), m), h
											}
											if (fa(l, m + h), l.l.subarray && u.subarray) l.l.set(u.subarray(c, c + h), m);
											else
												for (g = 0; g < h; g++) l.l[m + g] = u[c + g];
											return l.v = Math.max(l.v, m + h), h
										},
										aa(l, u, c) {
											if (c === 1 ? u += l.position : c === 2 && (l.node.mode & 61440) === 32768 && (u += l.node.v), 0 > u) throw new bt(28);
											return u
										},
										Xa(l, u, c) {
											fa(l.node, u + c), l.node.v = Math.max(l.node.v, u + c)
										},
										kb(l, u, c, h, m) {
											if ((l.node.mode & 61440) !== 32768) throw new bt(43);
											if (l = l.node.l, m & 2 || l.buffer !== P.buffer) {
												if ((0 < c || c + u < l.length) && (l.subarray ? l = l.subarray(c, c + u) : l = Array.prototype.slice.call(l, c, c + u)), c = !0, ve(), u = void 0, !u) throw new bt(48);
												P.set(l, u)
											} else c = !1, u = l.byteOffset;
											return {
												o: u,
												uc: c
											}
										},
										mb(l, u, c, h) {
											return Vt.m.write(l, u, 0, h, c, !1), 0
										}
									}
								},
								Dn = (l, u) => {
									var c = 0;
									return l && (c |= 365), u && (c |= 146), c
								},
								Jt = null,
								sa = {},
								ni = [],
								ar = 1,
								ai = null,
								dl = !0,
								bt = class {
									constructor(l) {
										this.name = "ErrnoError", this.$ = l
									}
								},
								vl = {},
								ir = class {
									constructor() {
										this.h = {}, this.node = null
									}
									get flags() {
										return this.h.flags
									}
									set flags(l) {
										this.h.flags = l
									}
									get position() {
										return this.h.position
									}
									set position(l) {
										this.h.position = l
									}
								},
								ba = class {
									constructor(l, u, c, h) {
										l ||= this, this.parent = l, this.U = l.U, this.ua = null, this.id = ar++, this.name = u, this.mode = c, this.j = {}, this.m = {}, this.xa = h
									}
									get read() {
										return (this.mode & 365) === 365
									}
									set read(l) {
										l ? this.mode |= 365 : this.mode &= -366
									}
									get write() {
										return (this.mode & 146) === 146
									}
									set write(l) {
										l ? this.mode |= 146 : this.mode &= -147
									}
								};

							function Be(l, u = {}) {
								if (l = Et(l), !l) return {
									path: "",
									node: null
								};
								if (u = Object.assign({
										gb: !0,
										Oa: 0
									}, u), 8 < u.Oa) throw new bt(32);
								l = l.split("/").filter(w => !!w);
								for (var c = Jt, h = "/", m = 0; m < l.length; m++) {
									var g = m === l.length - 1;
									if (g && u.parent) break;
									if (c = ii(c, l[m]), h = p(h + "/" + l[m]), c.ua && (!g || g && u.gb) && (c = c.ua.root), !g || u.fb) {
										for (g = 0;
											(c.mode & 61440) === 40960;)
											if (c = mo(h), h = Et(M(h), c), c = Be(h, {
													Oa: u.Oa + 1
												}).node, 40 < g++) throw new bt(32)
									}
								}
								return {
									path: h,
									node: c
								}
							}

							function sn(l) {
								for (var u;;) {
									if (l === l.parent) return l = l.U.lb, u ? l[l.length - 1] !== "/" ? `${l}/${u}` : l + u : l;
									u = u ? `${l.name}/${u}` : l.name, l = l.parent
								}
							}

							function ja(l, u) {
								for (var c = 0, h = 0; h < u.length; h++) c = (c << 5) - c + u.charCodeAt(h) | 0;
								return (l + c >>> 0) % ai.length
							}

							function ii(l, u) {
								var c = (l.mode & 61440) === 16384 ? (c = Xi(l, "x")) ? c : l.j.ja ? 0 : 2 : 54;
								if (c) throw new bt(c);
								for (c = ai[ja(l.id, u)]; c; c = c.ec) {
									var h = c.name;
									if (c.parent.id === l.id && h === u) return c
								}
								return l.j.ja(l, u)
							}

							function lr(l, u, c, h) {
								return l = new ba(l, u, c, h), u = ja(l.parent.id, l.name), l.ec = ai[u], ai[u] = l
							}

							function ur(l) {
								var u = ["r", "w", "rw"][l & 3];
								return l & 512 && (u += "w"), u
							}

							function Xi(l, u) {
								if (dl) return 0;
								if (!u.includes("r") || l.mode & 292) {
									if (u.includes("w") && !(l.mode & 146) || u.includes("x") && !(l.mode & 73)) return 2
								} else return 2;
								return 0
							}

							function li(l, u) {
								try {
									return ii(l, u), 20
								} catch {}
								return Xi(l, "wx")
							}

							function Jn(l) {
								if (l = ni[l], !l) throw new bt(8);
								return l
							}

							function La(l, u = -1) {
								if (l = Object.assign(new ir, l), u == -1) t: {
									for (u = 0; 4096 >= u; u++)
										if (!ni[u]) break t;
									throw new bt(33)
								}
								return l.W = u, ni[u] = l
							}

							function ui(l, u = -1) {
								return l = La(l, u), l.m?.Ec?.(l), l
							}
							var Gi = {
								open(l) {
									l.m = sa[l.node.xa].m, l.m.open?.(l)
								},
								aa() {
									throw new bt(70)
								}
							};

							function _a(l, u) {
								sa[l] = {
									m: u
								}
							}

							function Fe(l, u) {
								var c = u === "/";
								if (c && Jt) throw new bt(10);
								if (!c && u) {
									var h = Be(u, {
										gb: !1
									});
									if (u = h.path, h = h.node, h.ua) throw new bt(10);
									if ((h.mode & 61440) !== 16384) throw new bt(54)
								}
								u = {
									type: l,
									Mc: {},
									lb: u,
									dc: []
								}, l = l.U(u), l.U = u, u.root = l, c ? Jt = l : h && (h.ua = u, h.U && h.U.dc.push(u))
							}

							function ml(l, u, c) {
								var h = Be(l, {
									parent: !0
								}).node;
								if (l = q(l), !l || l === "." || l === "..") throw new bt(28);
								var m = li(h, l);
								if (m) throw new bt(m);
								if (!h.j.ta) throw new bt(63);
								return h.j.ta(h, l, u, c)
							}

							function Wn(l) {
								return ml(l, 16895, 0)
							}

							function In(l, u, c) {
								typeof c > "u" && (c = u, u = 438), ml(l, u | 8192, c)
							}

							function Aa(l, u) {
								if (!Et(l)) throw new bt(44);
								var c = Be(u, {
									parent: !0
								}).node;
								if (!c) throw new bt(44);
								u = q(u);
								var h = li(c, u);
								if (h) throw new bt(h);
								if (!c.j.Ca) throw new bt(63);
								c.j.Ca(c, u, l)
							}

							function mo(l) {
								if (l = Be(l).node, !l) throw new bt(44);
								if (!l.j.la) throw new bt(28);
								return Et(sn(l.parent), l.j.la(l))
							}

							function qi(l, u, c) {
								if (l === "") throw new bt(44);
								if (typeof u == "string") {
									var h = {
										r: 0,
										"r+": 2,
										w: 577,
										"w+": 578,
										a: 1089,
										"a+": 1090
									} [u];
									if (typeof h > "u") throw Error(`Unknown file open mode: ${u}`);
									u = h
								}
								if (c = u & 64 ? (typeof c > "u" ? 438 : c) & 4095 | 32768 : 0, typeof l == "object") var m = l;
								else {
									l = p(l);
									try {
										m = Be(l, {
											fb: !(u & 131072)
										}).node
									} catch {}
								}
								if (h = !1, u & 64)
									if (m) {
										if (u & 128) throw new bt(20)
									} else m = ml(l, c, 0), h = !0;
								if (!m) throw new bt(44);
								if ((m.mode & 61440) === 8192 && (u &= -513), u & 65536 && (m.mode & 61440) !== 16384) throw new bt(54);
								if (!h && (c = m ? (m.mode & 61440) === 40960 ? 32 : (m.mode & 61440) === 16384 && (ur(u) !== "r" || u & 512) ? 31 : Xi(m, ur(u)) : 44)) throw new bt(c);
								if (u & 512 && !h) {
									if (c = m, c = typeof c == "string" ? Be(c, {
											fb: !0
										}).node : c, !c.j.P) throw new bt(63);
									if ((c.mode & 61440) === 16384) throw new bt(31);
									if ((c.mode & 61440) !== 32768) throw new bt(28);
									if (h = Xi(c, "w")) throw new bt(h);
									c.j.P(c, {
										size: 0,
										timestamp: Date.now()
									})
								}
								return u &= -131713, m = La({
									node: m,
									path: sn(m),
									flags: u,
									seekable: !0,
									position: 0,
									m: m.m,
									sc: [],
									error: !1
								}), m.m.open && m.m.open(m), !S.logReadFiles || u & 1 || (_n ||= {}, l in _n || (_n[l] = 1)), m
							}

							function iu(l, u, c) {
								if (l.W === null) throw new bt(8);
								if (!l.seekable || !l.m.aa) throw new bt(70);
								if (c != 0 && c != 1 && c != 2) throw new bt(28);
								l.position = l.m.aa(l, u, c), l.sc = []
							}
							var rr;

							function Sa(l, u, c) {
								l = p("/dev/" + l);
								var h = Dn(!!u, !!c);
								Qi ||= 64;
								var m = Qi++ << 8 | 0;
								_a(m, {
									open(g) {
										g.seekable = !1
									},
									close() {
										c?.buffer?.length && c(10)
									},
									read(g, w, T, N) {
										for (var U = 0, nt = 0; nt < N; nt++) {
											try {
												var ht = u()
											} catch {
												throw new bt(29)
											}
											if (ht === void 0 && U === 0) throw new bt(6);
											if (ht == null) break;
											U++, w[T + nt] = ht
										}
										return U && (g.node.timestamp = Date.now()), U
									},
									write(g, w, T, N) {
										for (var U = 0; U < N; U++) try {
											c(w[T + U])
										} catch {
											throw new bt(29)
										}
										return N && (g.node.timestamp = Date.now()), U
									}
								}), In(l, h, m)
							}
							var Qi, hn = {},
								_n, ri = void 0,
								oi = (l, u) => Object.defineProperty(u, "name", {
									value: l
								}),
								Zi = [],
								kn = [],
								jt, $n = l => {
									if (!l) throw new jt("Cannot use deleted val. handle = " + l);
									return kn[l]
								},
								Xe = l => {
									switch (l) {
										case void 0:
											return 2;
										case null:
											return 4;
										case !0:
											return 6;
										case !1:
											return 8;
										default:
											const u = Zi.pop() || kn.length;
											return kn[u] = l, kn[u + 1] = 1, u
									}
								},
								pl = l => {
									var u = Error,
										c = oi(l, function(h) {
											this.name = l, this.message = h, h = Error(h).stack, h !== void 0 && (this.stack = this.toString() + `
` + h.replace(/^Error(:[^\n]*)?\n/, ""))
										});
									return c.prototype = Object.create(u.prototype), c.prototype.constructor = c, c.prototype.toString = function() {
										return this.message === void 0 ? this.name : `${this.name}: ${this.message}`
									}, c
								},
								lu, yl, Re = l => {
									for (var u = ""; y[l];) u += yl[y[l++]];
									return u
								},
								ci = [],
								gl = () => {
									for (; ci.length;) {
										var l = ci.pop();
										l.g.ea = !1, l.delete()
									}
								},
								Pn, ha = {},
								bl = (l, u) => {
									if (u === void 0) throw new jt("ptr should not be undefined");
									for (; l.C;) u = l.ma(u), l = l.C;
									return u
								},
								wa = {},
								_l = l => {
									l = dr(l);
									var u = Re(l);
									return Mn(l), u
								},
								Fi = (l, u) => {
									var c = wa[l];
									if (c === void 0) throw l = `${u} has unknown type ${_l(l)}`, new jt(l);
									return c
								},
								Al = () => {},
								fi = !1,
								ta = (l, u, c) => u === c ? l : c.C === void 0 ? null : (l = ta(l, u, c.C), l === null ? null : c.Lb(l)),
								Sl = {},
								uu = (l, u) => (u = bl(l, u), ha[u]),
								ea, da = (l, u) => {
									if (!u.u || !u.o) throw new ea("makeClassHandle requires ptr and ptrType");
									if (!!u.J != !!u.F) throw new ea("Both smartPtrType and smartPtr must be specified");
									return u.count = {
										value: 1
									}, Na(Object.create(l, {
										g: {
											value: u,
											writable: !0
										}
									}))
								},
								Na = l => typeof FinalizationRegistry > "u" ? (Na = u => u, l) : (fi = new FinalizationRegistry(u => {
									u = u.g, --u.count.value, u.count.value === 0 && (u.F ? u.J.O(u.F) : u.u.i.O(u.o))
								}), Na = u => {
									var c = u.g;
									return c.F && fi.register(u, {
										g: c
									}, u), u
								}, Al = u => {
									fi.unregister(u)
								}, Na(l)),
								si = {},
								hi = l => {
									for (; l.length;) {
										var u = l.pop();
										l.pop()(u)
									}
								};

							function va(l) {
								return this.fromWireType(tt[l >> 2])
							}
							var An = {},
								di = {},
								an = (l, u, c) => {
									function h(T) {
										if (T = c(T), T.length !== l.length) throw new ea("Mismatched type converter count");
										for (var N = 0; N < l.length; ++N) Un(l[N], T[N])
									}
									l.forEach(function(T) {
										di[T] = u
									});
									var m = Array(u.length),
										g = [],
										w = 0;
									u.forEach((T, N) => {
										wa.hasOwnProperty(T) ? m[N] = wa[T] : (g.push(T), An.hasOwnProperty(T) || (An[T] = []), An[T].push(() => {
											m[N] = wa[T], ++w, w === g.length && h(m)
										}))
									}), g.length === 0 && h(m)
								};

							function Ea(l, u, c = {}) {
								var h = u.name;
								if (!l) throw new jt(`type "${h}" must have a positive integer typeid pointer`);
								if (wa.hasOwnProperty(l)) {
									if (c.Vb) return;
									throw new jt(`Cannot register type '${h}' twice`)
								}
								wa[l] = u, delete di[l], An.hasOwnProperty(l) && (u = An[l], delete An[l], u.forEach(m => m()))
							}

							function Un(l, u, c = {}) {
								if (!("argPackAdvance" in u)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
								return Ea(l, u, c)
							}
							var vi = l => {
								throw new jt(l.g.u.i.name + " instance already deleted")
							};

							function Ki() {}
							var mi = (l, u, c) => {
									if (l[u].A === void 0) {
										var h = l[u];
										l[u] = function(...m) {
											if (!l[u].A.hasOwnProperty(m.length)) throw new jt(`Function '${c}' called with an invalid number of arguments (${m.length}) - expects one of (${l[u].A})!`);
											return l[u].A[m.length].apply(this, m)
										}, l[u].A = [], l[u].A[h.da] = h
									}
								},
								pi = (l, u, c) => {
									if (S.hasOwnProperty(l)) {
										if (c === void 0 || S[l].A !== void 0 && S[l].A[c] !== void 0) throw new jt(`Cannot register public name '${l}' twice`);
										if (mi(S, l, l), S.hasOwnProperty(c)) throw new jt(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
										S[l].A[c] = u
									} else S[l] = u, c !== void 0 && (S[l].Lc = c)
								},
								or = l => {
									if (l === void 0) return "_unknown";
									l = l.replace(/[^a-zA-Z0-9_]/g, "$");
									var u = l.charCodeAt(0);
									return 48 <= u && 57 >= u ? `_${l}` : l
								};

							function Sn(l, u, c, h, m, g, w, T) {
								this.name = l, this.constructor = u, this.M = c, this.O = h, this.C = m, this.Qb = g, this.ma = w, this.Lb = T, this.pb = []
							}
							var na = (l, u, c) => {
								for (; u !== c;) {
									if (!u.ma) throw new jt(`Expected null or instance of ${c.name}, got an instance of ${u.name}`);
									l = u.ma(l), u = u.C
								}
								return l
							};

							function wl(l, u) {
								if (u === null) {
									if (this.La) throw new jt(`null is not a valid ${this.name}`);
									return 0
								}
								if (!u.g) throw new jt(`Cannot pass "${su(u)}" as a ${this.name}`);
								if (!u.g.o) throw new jt(`Cannot pass deleted object as a pointer of type ${this.name}`);
								return na(u.g.o, u.g.u.i, this.i)
							}

							function Ji(l, u) {
								if (u === null) {
									if (this.La) throw new jt(`null is not a valid ${this.name}`);
									if (this.sa) {
										var c = this.Na();
										return l !== null && l.push(this.O, c), c
									}
									return 0
								}
								if (!u || !u.g) throw new jt(`Cannot pass "${su(u)}" as a ${this.name}`);
								if (!u.g.o) throw new jt(`Cannot pass deleted object as a pointer of type ${this.name}`);
								if (!this.ra && u.g.u.ra) throw new jt(`Cannot convert argument of type ${u.g.J?u.g.J.name:u.g.u.name} to parameter type ${this.name}`);
								if (c = na(u.g.o, u.g.u.i, this.i), this.sa) {
									if (u.g.F === void 0) throw new jt("Passing raw pointer to smart pointer is illegal");
									switch (this.mc) {
										case 0:
											if (u.g.J === this) c = u.g.F;
											else throw new jt(`Cannot convert argument of type ${u.g.J?u.g.J.name:u.g.u.name} to parameter type ${this.name}`);
											break;
										case 1:
											c = u.g.F;
											break;
										case 2:
											if (u.g.J === this) c = u.g.F;
											else {
												var h = u.clone();
												c = this.ic(c, Xe(() => h.delete())), l !== null && l.push(this.O, c)
											}
											break;
										default:
											throw new jt("Unsupporting sharing policy")
									}
								}
								return c
							}

							function po(l, u) {
								if (u === null) {
									if (this.La) throw new jt(`null is not a valid ${this.name}`);
									return 0
								}
								if (!u.g) throw new jt(`Cannot pass "${su(u)}" as a ${this.name}`);
								if (!u.g.o) throw new jt(`Cannot pass deleted object as a pointer of type ${this.name}`);
								if (u.g.u.ra) throw new jt(`Cannot convert argument of type ${u.g.u.name} to parameter type ${this.name}`);
								return na(u.g.o, u.g.u.i, this.i)
							}

							function yi(l, u, c, h, m, g, w, T, N, U, nt) {
								this.name = l, this.i = u, this.La = c, this.ra = h, this.sa = m, this.hc = g, this.mc = w, this.qb = T, this.Na = N, this.ic = U, this.O = nt, m || u.C !== void 0 ? this.toWireType = Ji : (this.toWireType = h ? wl : po, this.L = null)
							}
							var El = (l, u, c) => {
									if (!S.hasOwnProperty(l)) throw new ea("Replacing nonexistent public symbol");
									S[l].A !== void 0 && c !== void 0 ? S[l].A[c] = u : (S[l] = u, S[l].da = c)
								},
								Ma = [],
								Wi, ru = l => {
									var u = Ma[l];
									return u || (l >= Ma.length && (Ma.length = l + 1), Ma[l] = u = Wi.get(l)), u
								},
								yo = (l, u, c = []) => (l.includes("j") ? (l = l.replace(/p/g, "i"), u = (0, S["dynCall_" + l])(u, ...c)) : u = ru(u)(...c), u),
								go = (l, u) => (...c) => yo(l, u, c),
								un = (l, u) => {
									l = Re(l);
									var c = l.includes("j") ? go(l, u) : ru(u);
									if (typeof c != "function") throw new jt(`unknown function pointer with signature ${l}: ${u}`);
									return c
								},
								Ml, ma = (l, u) => {
									function c(g) {
										m[g] || wa[g] || (di[g] ? di[g].forEach(c) : (h.push(g), m[g] = !0))
									}
									var h = [],
										m = {};
									throw u.forEach(c), new Ml(`${l}: ` + h.map(_l).join([", "]))
								};

							function bo(l) {
								for (var u = 1; u < l.length; ++u)
									if (l[u] !== null && l[u].L === void 0) return !0;
								return !1
							}

							function Tl(l, u, c, h, m) {
								var g = u.length;
								if (2 > g) throw new jt("argTypes array size mismatch! Must at least get return value and 'this' types!");
								var w = u[1] !== null && c !== null,
									T = bo(u),
									N = u[0].name !== "void",
									U = g - 2,
									nt = Array(U),
									ht = [],
									_t = [];
								return oi(l, function(...C) {
									if (C.length !== U) throw new jt(`function ${l} called with ${C.length} arguments, expected ${U}`);
									if (_t.length = 0, ht.length = w ? 2 : 1, ht[0] = m, w) {
										var lt = u[1].toWireType(_t, this);
										ht[1] = lt
									}
									for (var pt = 0; pt < U; ++pt) nt[pt] = u[pt + 2].toWireType(_t, C[pt]), ht.push(nt[pt]);
									if (C = h(...ht), T) hi(_t);
									else
										for (pt = w ? 1 : 2; pt < u.length; pt++) {
											var ut = pt === 1 ? lt : nt[pt - 2];
											u[pt].L !== null && u[pt].L(ut)
										}
									return lt = N ? u[0].fromWireType(C) : void 0, lt
								})
							}
							var Cl = (l, u) => {
									for (var c = [], h = 0; h < l; h++) c.push(tt[u + 4 * h >> 2]);
									return c
								},
								ou = l => {
									l = l.trim();
									const u = l.indexOf("(");
									return u !== -1 ? l.substr(0, u) : l
								},
								cu = (l, u, c) => {
									if (!(l instanceof Object)) throw new jt(`${c} with invalid "this": ${l}`);
									if (!(l instanceof u.i.constructor)) throw new jt(`${c} incompatible with "this" of type ${l.constructor.name}`);
									if (!l.g.o) throw new jt(`cannot call emscripten binding method ${c} on deleted object`);
									return na(l.g.o, l.g.u.i, u.i)
								},
								fu = l => {
									9 < l && --kn[l + 1] === 0 && (kn[l] = void 0, Zi.push(l))
								},
								_o = {
									name: "emscripten::val",
									fromWireType: l => {
										var u = $n(l);
										return fu(l), u
									},
									toWireType: (l, u) => Xe(u),
									argPackAdvance: 8,
									readValueFromPointer: va,
									L: null
								},
								Ao = (l, u, c) => {
									switch (u) {
										case 1:
											return c ? function(h) {
												return this.fromWireType(P[h])
											} : function(h) {
												return this.fromWireType(y[h])
											};
										case 2:
											return c ? function(h) {
												return this.fromWireType(L[h >> 1])
											} : function(h) {
												return this.fromWireType(k[h >> 1])
											};
										case 4:
											return c ? function(h) {
												return this.fromWireType(W[h >> 2])
											} : function(h) {
												return this.fromWireType(tt[h >> 2])
											};
										default:
											throw new TypeError(`invalid integer width (${u}): ${l}`)
									}
								},
								su = l => {
									if (l === null) return "null";
									var u = typeof l;
									return u === "object" || u === "array" || u === "function" ? l.toString() : "" + l
								},
								hu = (l, u) => {
									switch (u) {
										case 4:
											return function(c) {
												return this.fromWireType(gt[c >> 2])
											};
										case 8:
											return function(c) {
												return this.fromWireType(zt[c >> 3])
											};
										default:
											throw new TypeError(`invalid float width (${u}): ${l}`)
									}
								},
								So = (l, u, c) => {
									switch (u) {
										case 1:
											return c ? h => P[h] : h => y[h];
										case 2:
											return c ? h => L[h >> 1] : h => k[h >> 1];
										case 4:
											return c ? h => W[h >> 2] : h => tt[h >> 2];
										default:
											throw new TypeError(`invalid integer width (${u}): ${l}`)
									}
								},
								cr = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0,
								wo = (l, u) => {
									for (var c = l >> 1, h = c + u / 2; !(c >= h) && k[c];) ++c;
									if (c <<= 1, 32 < c - l && cr) return cr.decode(y.subarray(l, c));
									for (c = "", h = 0; !(h >= u / 2); ++h) {
										var m = L[l + 2 * h >> 1];
										if (m == 0) break;
										c += String.fromCharCode(m)
									}
									return c
								},
								fr = (l, u, c) => {
									if (c ??= 2147483647, 2 > c) return 0;
									c -= 2;
									var h = u;
									c = c < 2 * l.length ? c / 2 : l.length;
									for (var m = 0; m < c; ++m) L[u >> 1] = l.charCodeAt(m), u += 2;
									return L[u >> 1] = 0, u - h
								},
								Eo = l => 2 * l.length,
								Mo = (l, u) => {
									for (var c = 0, h = ""; !(c >= u / 4);) {
										var m = W[l + 4 * c >> 2];
										if (m == 0) break;
										++c, 65536 <= m ? (m -= 65536, h += String.fromCharCode(55296 | m >> 10, 56320 | m & 1023)) : h += String.fromCharCode(m)
									}
									return h
								},
								To = (l, u, c) => {
									if (c ??= 2147483647, 4 > c) return 0;
									var h = u;
									c = h + c - 4;
									for (var m = 0; m < l.length; ++m) {
										var g = l.charCodeAt(m);
										if (55296 <= g && 57343 >= g) {
											var w = l.charCodeAt(++m);
											g = 65536 + ((g & 1023) << 10) | w & 1023
										}
										if (W[u >> 2] = g, u += 4, u + 4 > c) break
									}
									return W[u >> 2] = 0, u - h
								},
								Co = l => {
									for (var u = 0, c = 0; c < l.length; ++c) {
										var h = l.charCodeAt(c);
										55296 <= h && 57343 >= h && ++c, u += 4
									}
									return u
								},
								sr = (l, u, c) => {
									var h = [];
									return l = l.toWireType(h, c), h.length && (tt[u >> 2] = Xe(h)), l
								},
								Oo = {},
								du = l => {
									var u = Oo[l];
									return u === void 0 ? Re(l) : u
								},
								vu = [],
								Ro = l => {
									var u = vu.length;
									return vu.push(l), u
								},
								mu = (l, u) => {
									for (var c = Array(l), h = 0; h < l; ++h) c[h] = Fi(tt[u + 4 * h >> 2], "parameter " + h);
									return c
								},
								Ii = Reflect.construct,
								pu = [],
								Ol = {},
								yu = () => {
									if (!Rl) {
										var l = {
												USER: "web_user",
												LOGNAME: "web_user",
												PATH: "/",
												PWD: "/",
												HOME: "/home/web_user",
												LANG: (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
												_: E || "./this.program"
											},
											u;
										for (u in Ol) Ol[u] === void 0 ? delete l[u] : l[u] = Ol[u];
										var c = [];
										for (u in l) c.push(`${u}=${l[u]}`);
										Rl = c
									}
									return Rl
								},
								Rl, ki = l => l % 4 === 0 && (l % 100 !== 0 || l % 400 === 0),
								gu = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
								Ba = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
								zo = (l, u, c, h) => {
									function m(C, lt, pt) {
										for (C = typeof C == "number" ? C.toString() : C || ""; C.length < lt;) C = pt[0] + C;
										return C
									}

									function g(C, lt) {
										return m(C, lt, "0")
									}

									function w(C, lt) {
										function pt(me) {
											return 0 > me ? -1 : 0 < me ? 1 : 0
										}
										var ut;
										return (ut = pt(C.getFullYear() - lt.getFullYear())) === 0 && (ut = pt(C.getMonth() - lt.getMonth())) === 0 && (ut = pt(C.getDate() - lt.getDate())), ut
									}

									function T(C) {
										switch (C.getDay()) {
											case 0:
												return new Date(C.getFullYear() - 1, 11, 29);
											case 1:
												return C;
											case 2:
												return new Date(C.getFullYear(), 0, 3);
											case 3:
												return new Date(C.getFullYear(), 0, 2);
											case 4:
												return new Date(C.getFullYear(), 0, 1);
											case 5:
												return new Date(C.getFullYear() - 1, 11, 31);
											case 6:
												return new Date(C.getFullYear() - 1, 11, 30)
										}
									}

									function N(C) {
										var lt = C.ba;
										for (C = new Date(new Date(C.ca + 1900, 0, 1).getTime()); 0 < lt;) {
											var pt = C.getMonth(),
												ut = (ki(C.getFullYear()) ? gu : Ba)[pt];
											if (lt > ut - C.getDate()) lt -= ut - C.getDate() + 1, C.setDate(1), 11 > pt ? C.setMonth(pt + 1) : (C.setMonth(0), C.setFullYear(C.getFullYear() + 1));
											else {
												C.setDate(C.getDate() + lt);
												break
											}
										}
										return pt = new Date(C.getFullYear() + 1, 0, 4), lt = T(new Date(C.getFullYear(), 0, 4)), pt = T(pt), 0 >= w(lt, C) ? 0 >= w(pt, C) ? C.getFullYear() + 1 : C.getFullYear() : C.getFullYear() - 1
									}
									var U = tt[h + 40 >> 2];
									h = {
										pc: W[h >> 2],
										oc: W[h + 4 >> 2],
										Da: W[h + 8 >> 2],
										Qa: W[h + 12 >> 2],
										Ea: W[h + 16 >> 2],
										ca: W[h + 20 >> 2],
										R: W[h + 24 >> 2],
										ba: W[h + 28 >> 2],
										Nc: W[h + 32 >> 2],
										nc: W[h + 36 >> 2],
										qc: U && U ? Tt(y, U) : ""
									}, c = c ? Tt(y, c) : "", U = {
										"%c": "%a %b %d %H:%M:%S %Y",
										"%D": "%m/%d/%y",
										"%F": "%Y-%m-%d",
										"%h": "%b",
										"%r": "%I:%M:%S %p",
										"%R": "%H:%M",
										"%T": "%H:%M:%S",
										"%x": "%m/%d/%y",
										"%X": "%H:%M:%S",
										"%Ec": "%c",
										"%EC": "%C",
										"%Ex": "%m/%d/%y",
										"%EX": "%H:%M:%S",
										"%Ey": "%y",
										"%EY": "%Y",
										"%Od": "%d",
										"%Oe": "%e",
										"%OH": "%H",
										"%OI": "%I",
										"%Om": "%m",
										"%OM": "%M",
										"%OS": "%S",
										"%Ou": "%u",
										"%OU": "%U",
										"%OV": "%V",
										"%Ow": "%w",
										"%OW": "%W",
										"%Oy": "%y"
									};
									for (var nt in U) c = c.replace(new RegExp(nt, "g"), U[nt]);
									var ht = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
										_t = "January February March April May June July August September October November December".split(" ");
									U = {
										"%a": C => ht[C.R].substring(0, 3),
										"%A": C => ht[C.R],
										"%b": C => _t[C.Ea].substring(0, 3),
										"%B": C => _t[C.Ea],
										"%C": C => g((C.ca + 1900) / 100 | 0, 2),
										"%d": C => g(C.Qa, 2),
										"%e": C => m(C.Qa, 2, " "),
										"%g": C => N(C).toString().substring(2),
										"%G": N,
										"%H": C => g(C.Da, 2),
										"%I": C => (C = C.Da, C == 0 ? C = 12 : 12 < C && (C -= 12), g(C, 2)),
										"%j": C => {
											for (var lt = 0, pt = 0; pt <= C.Ea - 1; lt += (ki(C.ca + 1900) ? gu : Ba)[pt++]);
											return g(C.Qa + lt, 3)
										},
										"%m": C => g(C.Ea + 1, 2),
										"%M": C => g(C.oc, 2),
										"%n": () => `
`,
										"%p": C => 0 <= C.Da && 12 > C.Da ? "AM" : "PM",
										"%S": C => g(C.pc, 2),
										"%t": () => "	",
										"%u": C => C.R || 7,
										"%U": C => g(Math.floor((C.ba + 7 - C.R) / 7), 2),
										"%V": C => {
											var lt = Math.floor((C.ba + 7 - (C.R + 6) % 7) / 7);
											if (2 >= (C.R + 371 - C.ba - 2) % 7 && lt++, lt) lt == 53 && (pt = (C.R + 371 - C.ba) % 7, pt == 4 || pt == 3 && ki(C.ca) || (lt = 1));
											else {
												lt = 52;
												var pt = (C.R + 7 - C.ba - 1) % 7;
												(pt == 4 || pt == 5 && ki(C.ca % 400 - 1)) && lt++
											}
											return g(lt, 2)
										},
										"%w": C => C.R,
										"%W": C => g(Math.floor((C.ba + 7 - (C.R + 6) % 7) / 7), 2),
										"%y": C => (C.ca + 1900).toString().substring(2),
										"%Y": C => C.ca + 1900,
										"%z": C => {
											C = C.nc;
											var lt = 0 <= C;
											return C = Math.abs(C) / 60, (lt ? "+" : "-") + ("0000" + (C / 60 * 100 + C % 60)).slice(-4)
										},
										"%Z": C => C.qc,
										"%%": () => "%"
									}, c = c.replace(/%%/g, "\0\0");
									for (nt in U) c.includes(nt) && (c = c.replace(new RegExp(nt, "g"), U[nt](h)));
									return c = c.replace(/\0\0/g, "%"), nt = bn(c, !1), nt.length > u ? 0 : (P.set(nt, l), nt.length - 1)
								};
							[44].forEach(l => {
								vl[l] = new bt(l), vl[l].stack = "<generic error, no stack>"
							}), ai = Array(4096), Fe(Vt, "/"), Wn("/tmp"), Wn("/home"), Wn("/home/web_user"), (function() {
								Wn("/dev"), _a(259, {
									read: () => 0,
									write: (h, m, g, w) => w
								}), In("/dev/null", 259), nn(1280, fn), nn(1536, zn), In("/dev/tty", 1280), In("/dev/tty1", 1536);
								var l = new Uint8Array(1024),
									u = 0,
									c = () => (u === 0 && (u = St(l).byteLength), l[--u]);
								Sa("random", c), Sa("urandom", c), Wn("/dev/shm"), Wn("/dev/shm/tmp")
							})(), (function() {
								Wn("/proc");
								var l = Wn("/proc/self");
								Wn("/proc/self/fd"), Fe({
									U() {
										var u = lr(l, "fd", 16895, 73);
										return u.j = {
											ja(c, h) {
												var m = Jn(+h);
												return c = {
													parent: null,
													U: {
														lb: "fake"
													},
													j: {
														la: () => m.path
													}
												}, c.parent = c
											}
										}, u
									}
								}, "/proc/self/fd")
							})(), jt = S.BindingError = class extends Error {
								constructor(l) {
									super(l), this.name = "BindingError"
								}
							}, kn.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1), S.count_emval_handles = () => kn.length / 2 - 5 - Zi.length, lu = S.PureVirtualError = pl("PureVirtualError");
							for (var hr = Array(256), zl = 0; 256 > zl; ++zl) hr[zl] = String.fromCharCode(zl);
							yl = hr, S.getInheritedInstanceCount = () => Object.keys(ha).length, S.getLiveInheritedInstances = () => {
								var l = [],
									u;
								for (u in ha) ha.hasOwnProperty(u) && l.push(ha[u]);
								return l
							}, S.flushPendingDeletes = gl, S.setDelayFunction = l => {
								Pn = l, ci.length && Pn && Pn(gl)
							}, ea = S.InternalError = class extends Error {
								constructor(l) {
									super(l), this.name = "InternalError"
								}
							}, Object.assign(Ki.prototype, {
								isAliasOf: function(l) {
									if (!(this instanceof Ki && l instanceof Ki)) return !1;
									var u = this.g.u.i,
										c = this.g.o;
									l.g = l.g;
									var h = l.g.u.i;
									for (l = l.g.o; u.C;) c = u.ma(c), u = u.C;
									for (; h.C;) l = h.ma(l), h = h.C;
									return u === h && c === l
								},
								clone: function() {
									if (this.g.o || vi(this), this.g.ha) return this.g.count.value += 1, this;
									var l = Na,
										u = Object,
										c = u.create,
										h = Object.getPrototypeOf(this),
										m = this.g;
									return l = l(c.call(u, h, {
										g: {
											value: {
												count: m.count,
												ea: m.ea,
												ha: m.ha,
												o: m.o,
												u: m.u,
												F: m.F,
												J: m.J
											}
										}
									})), l.g.count.value += 1, l.g.ea = !1, l
								},
								delete() {
									if (this.g.o || vi(this), this.g.ea && !this.g.ha) throw new jt("Object already scheduled for deletion");
									Al(this);
									var l = this.g;
									--l.count.value, l.count.value === 0 && (l.F ? l.J.O(l.F) : l.u.i.O(l.o)), this.g.ha || (this.g.F = void 0, this.g.o = void 0)
								},
								isDeleted: function() {
									return !this.g.o
								},
								deleteLater: function() {
									if (this.g.o || vi(this), this.g.ea && !this.g.ha) throw new jt("Object already scheduled for deletion");
									return ci.push(this), ci.length === 1 && Pn && Pn(gl), this.g.ea = !0, this
								}
							}), Object.assign(yi.prototype, {
								Rb(l) {
									return this.qb && (l = this.qb(l)), l
								},
								ab(l) {
									this.O?.(l)
								},
								argPackAdvance: 8,
								readValueFromPointer: va,
								fromWireType: function(l) {
									function u() {
										return this.sa ? da(this.i.M, {
											u: this.hc,
											o: c,
											J: this,
											F: l
										}) : da(this.i.M, {
											u: this,
											o: l
										})
									}
									var c = this.Rb(l);
									if (!c) return this.ab(l), null;
									var h = uu(this.i, c);
									if (h !== void 0) return h.g.count.value === 0 ? (h.g.o = c, h.g.F = l, h.clone()) : (h = h.clone(), this.ab(l), h);
									if (h = this.i.Qb(c), h = Sl[h], !h) return u.call(this);
									h = this.ra ? h.Hb : h.pointerType;
									var m = ta(c, this.i, h.i);
									return m === null ? u.call(this) : this.sa ? da(h.i.M, {
										u: h,
										o: m,
										J: this,
										F: l
									}) : da(h.i.M, {
										u: h,
										o: m
									})
								}
							}), Ml = S.UnboundTypeError = pl("UnboundTypeError");
							var bu = {
									__syscall_fcntl64: function(l, u, c) {
										ri = c;
										try {
											var h = Jn(l);
											switch (u) {
												case 0:
													var m = o();
													if (0 > m) break;
													for (; ni[m];) m++;
													return ui(h, m).W;
												case 1:
												case 2:
													return 0;
												case 3:
													return h.flags;
												case 4:
													return m = o(), h.flags |= m, 0;
												case 12:
													return m = o(), L[m + 0 >> 1] = 2, 0;
												case 13:
												case 14:
													return 0
											}
											return -28
										} catch (g) {
											if (typeof hn > "u" || g.name !== "ErrnoError") throw g;
											return -g.$
										}
									},
									__syscall_ioctl: function(l, u, c) {
										ri = c;
										try {
											var h = Jn(l);
											switch (u) {
												case 21509:
													return h.s ? 0 : -59;
												case 21505:
													if (!h.s) return -59;
													if (h.s.V.Xb) {
														l = [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
														var m = o();
														W[m >> 2] = 25856, W[m + 4 >> 2] = 5, W[m + 8 >> 2] = 191, W[m + 12 >> 2] = 35387;
														for (var g = 0; 32 > g; g++) P[m + g + 17] = l[g] || 0
													}
													return 0;
												case 21510:
												case 21511:
												case 21512:
													return h.s ? 0 : -59;
												case 21506:
												case 21507:
												case 21508:
													if (!h.s) return -59;
													if (h.s.V.Yb)
														for (m = o(), l = [], g = 0; 32 > g; g++) l.push(P[m + g + 17]);
													return 0;
												case 21519:
													return h.s ? (m = o(), W[m >> 2] = 0) : -59;
												case 21520:
													return h.s ? -28 : -59;
												case 21531:
													if (m = o(), !h.m.Wb) throw new bt(59);
													return h.m.Wb(h, u, m);
												case 21523:
													return h.s ? (h.s.V.Zb && (g = [24, 80], m = o(), L[m >> 1] = g[0], L[m + 2 >> 1] = g[1]), 0) : -59;
												case 21524:
													return h.s ? 0 : -59;
												case 21515:
													return h.s ? 0 : -59;
												default:
													return -28
											}
										} catch (w) {
											if (typeof hn > "u" || w.name !== "ErrnoError") throw w;
											return -w.$
										}
									},
									__syscall_openat: function(l, u, c, h) {
										ri = h;
										try {
											u = u ? Tt(y, u) : "";
											var m = u;
											if (m.charAt(0) === "/") u = m;
											else {
												var g = l === -100 ? "/" : Jn(l).path;
												if (m.length == 0) throw new bt(44);
												u = p(g + "/" + m)
											}
											var w = h ? o() : 0;
											return qi(u, c, w).W
										} catch (T) {
											if (typeof hn > "u" || T.name !== "ErrnoError") throw T;
											return -T.$
										}
									},
									_abort_js: () => {
										ve("")
									},
									_embind_create_inheriting_constructor: (l, u, c) => {
										l = Re(l), u = Fi(u, "wrapper"), c = $n(c);
										var h = u.i,
											m = h.M,
											g = h.C.M,
											w = h.C.constructor;
										return l = oi(l, function(...T) {
											h.C.pb.forEach((function(N) {
												if (this[N] === g[N]) throw new lu(`Pure virtual function ${N} must be implemented in JavaScript`)
											}).bind(this)), Object.defineProperty(this, "__parent", {
												value: m
											}), this.__construct(...T)
										}), m.__construct = function(...T) {
											if (this === m) throw new jt("Pass correct 'this' to __construct");
											T = w.implement(this, ...T), Al(T);
											var N = T.g;
											if (T.notifyOnDestruction(), N.ha = !0, Object.defineProperties(this, {
													g: {
														value: N
													}
												}), Na(this), T = N.o, T = bl(h, T), ha.hasOwnProperty(T)) throw new jt(`Tried to register registered instance: ${T}`);
											ha[T] = this
										}, m.__destruct = function() {
											if (this === m) throw new jt("Pass correct 'this' to __destruct");
											Al(this);
											var T = this.g.o;
											if (T = bl(h, T), ha.hasOwnProperty(T)) delete ha[T];
											else throw new jt(`Tried to unregister unregistered instance: ${T}`)
										}, l.prototype = Object.create(m), Object.assign(l.prototype, c), Xe(l)
									},
									_embind_finalize_value_object: l => {
										var u = si[l];
										delete si[l];
										var c = u.Na,
											h = u.O,
											m = u.eb,
											g = m.map(w => w.Ub).concat(m.map(w => w.kc));
										an([l], g, w => {
											var T = {};
											return m.forEach((N, U) => {
												var nt = w[U],
													ht = N.Sb,
													_t = N.Tb,
													C = w[U + m.length],
													lt = N.jc,
													pt = N.lc;
												T[N.Ob] = {
													read: ut => nt.fromWireType(ht(_t, ut)),
													write: (ut, me) => {
														var dt = [];
														lt(pt, ut, C.toWireType(dt, me)), hi(dt)
													}
												}
											}), [{
												name: u.name,
												fromWireType: N => {
													var U = {},
														nt;
													for (nt in T) U[nt] = T[nt].read(N);
													return h(N), U
												},
												toWireType: (N, U) => {
													for (var nt in T)
														if (!(nt in U)) throw new TypeError(`Missing field: "${nt}"`);
													var ht = c();
													for (nt in T) T[nt].write(ht, U[nt]);
													return N !== null && N.push(h, ht), ht
												},
												argPackAdvance: 8,
												readValueFromPointer: va,
												L: h
											}]
										})
									},
									_embind_register_bigint: () => {},
									_embind_register_bool: (l, u, c, h) => {
										u = Re(u), Un(l, {
											name: u,
											fromWireType: function(m) {
												return !!m
											},
											toWireType: function(m, g) {
												return g ? c : h
											},
											argPackAdvance: 8,
											readValueFromPointer: function(m) {
												return this.fromWireType(y[m])
											},
											L: null
										})
									},
									_embind_register_class: (l, u, c, h, m, g, w, T, N, U, nt, ht, _t) => {
										nt = Re(nt), g = un(m, g), T &&= un(w, T), U &&= un(N, U), _t = un(ht, _t);
										var C = or(nt);
										pi(C, function() {
											ma(`Cannot construct ${nt} due to unbound types`, [h])
										}), an([l, u, c], h ? [h] : [], lt => {
											if (lt = lt[0], h) var pt = lt.i,
												ut = pt.M;
											else ut = Ki.prototype;
											lt = oi(nt, function(...we) {
												if (Object.getPrototypeOf(this) !== me) throw new jt("Use 'new' to construct " + nt);
												if (dt.Z === void 0) throw new jt(nt + " has no accessible constructor");
												var Ke = dt.Z[we.length];
												if (Ke === void 0) throw new jt(`Tried to invoke ctor of ${nt} with invalid number of parameters (${we.length}) - expected (${Object.keys(dt.Z).toString()}) parameters instead!`);
												return Ke.apply(this, we)
											});
											var me = Object.create(ut, {
												constructor: {
													value: lt
												}
											});
											lt.prototype = me;
											var dt = new Sn(nt, lt, me, _t, pt, g, T, U);
											if (dt.C) {
												var kt;
												(kt = dt.C).na ?? (kt.na = []), dt.C.na.push(dt)
											}
											return pt = new yi(nt, dt, !0, !1, !1), kt = new yi(nt + "*", dt, !1, !1, !1), ut = new yi(nt + " const*", dt, !1, !0, !1), Sl[l] = {
												pointerType: kt,
												Hb: ut
											}, El(C, lt), [pt, kt, ut]
										})
									},
									_embind_register_class_class_function: (l, u, c, h, m, g, w) => {
										var T = Cl(c, h);
										u = Re(u), u = ou(u), g = un(m, g), an([], [l], N => {
											function U() {
												ma(`Cannot call ${nt} due to unbound types`, T)
											}
											N = N[0];
											var nt = `${N.name}.${u}`;
											u.startsWith("@@") && (u = Symbol[u.substring(2)]);
											var ht = N.i.constructor;
											return ht[u] === void 0 ? (U.da = c - 1, ht[u] = U) : (mi(ht, u, nt), ht[u].A[c - 1] = U), an([], T, _t => {
												if (_t = Tl(nt, [_t[0], null].concat(_t.slice(1)), null, g, w), ht[u].A === void 0 ? (_t.da = c - 1, ht[u] = _t) : ht[u].A[c - 1] = _t, N.i.na)
													for (const C of N.i.na) C.constructor.hasOwnProperty(u) || (C.constructor[u] = _t);
												return []
											}), []
										})
									},
									_embind_register_class_class_property: (l, u, c, h, m, g, w, T) => {
										u = Re(u), g = un(m, g), an([], [l], N => {
											N = N[0];
											var U = `${N.name}.${u}`,
												nt = {
													get() {
														ma(`Cannot access ${U} due to unbound types`, [c])
													},
													enumerable: !0,
													configurable: !0
												};
											return nt.set = T ? () => {
												ma(`Cannot access ${U} due to unbound types`, [c])
											} : () => {
												throw new jt(`${U} is a read-only property`)
											}, Object.defineProperty(N.i.constructor, u, nt), an([], [c], ht => {
												ht = ht[0];
												var _t = {
													get() {
														return ht.fromWireType(g(h))
													},
													enumerable: !0
												};
												return T && (T = un(w, T), _t.set = C => {
													var lt = [];
													T(h, ht.toWireType(lt, C)), hi(lt)
												}), Object.defineProperty(N.i.constructor, u, _t), []
											}), []
										})
									},
									_embind_register_class_constructor: (l, u, c, h, m, g) => {
										var w = Cl(u, c);
										m = un(h, m), an([], [l], T => {
											T = T[0];
											var N = `constructor ${T.name}`;
											if (T.i.Z === void 0 && (T.i.Z = []), T.i.Z[u - 1] !== void 0) throw new jt(`Cannot register multiple constructors with identical number of parameters (${u-1}) for class '${T.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
											return T.i.Z[u - 1] = () => {
												ma(`Cannot construct ${T.name} due to unbound types`, w)
											}, an([], w, U => (U.splice(1, 0, null), T.i.Z[u - 1] = Tl(N, U, null, m, g), [])), []
										})
									},
									_embind_register_class_function: (l, u, c, h, m, g, w, T) => {
										var N = Cl(c, h);
										u = Re(u), u = ou(u), g = un(m, g), an([], [l], U => {
											function nt() {
												ma(`Cannot call ${ht} due to unbound types`, N)
											}
											U = U[0];
											var ht = `${U.name}.${u}`;
											u.startsWith("@@") && (u = Symbol[u.substring(2)]), T && U.i.pb.push(u);
											var _t = U.i.M,
												C = _t[u];
											return C === void 0 || C.A === void 0 && C.className !== U.name && C.da === c - 2 ? (nt.da = c - 2, nt.className = U.name, _t[u] = nt) : (mi(_t, u, ht), _t[u].A[c - 2] = nt), an([], N, lt => (lt = Tl(ht, lt, U, g, w), _t[u].A === void 0 ? (lt.da = c - 2, _t[u] = lt) : _t[u].A[c - 2] = lt, [])), []
										})
									},
									_embind_register_class_property: (l, u, c, h, m, g, w, T, N, U) => {
										u = Re(u), m = un(h, m), an([], [l], nt => {
											nt = nt[0];
											var ht = `${nt.name}.${u}`,
												_t = {
													get() {
														ma(`Cannot access ${ht} due to unbound types`, [c, w])
													},
													enumerable: !0,
													configurable: !0
												};
											return _t.set = N ? () => ma(`Cannot access ${ht} due to unbound types`, [c, w]) : () => {
												throw new jt(ht + " is a read-only property")
											}, Object.defineProperty(nt.i.M, u, _t), an([], N ? [c, w] : [c], C => {
												var lt = C[0],
													pt = {
														get() {
															var me = cu(this, nt, ht + " getter");
															return lt.fromWireType(m(g, me))
														},
														enumerable: !0
													};
												if (N) {
													N = un(T, N);
													var ut = C[1];
													pt.set = function(me) {
														var dt = cu(this, nt, ht + " setter"),
															kt = [];
														N(U, dt, ut.toWireType(kt, me)), hi(kt)
													}
												}
												return Object.defineProperty(nt.i.M, u, pt), []
											}), []
										})
									},
									_embind_register_emval: l => Un(l, _o),
									_embind_register_enum: (l, u, c, h) => {
										function m() {}
										u = Re(u), m.values = {}, Un(l, {
											name: u,
											constructor: m,
											fromWireType: function(g) {
												return this.constructor.values[g]
											},
											toWireType: (g, w) => w.value,
											argPackAdvance: 8,
											readValueFromPointer: Ao(u, c, h),
											L: null
										}), pi(u, m)
									},
									_embind_register_enum_value: (l, u, c) => {
										var h = Fi(l, "enum");
										u = Re(u), l = h.constructor, h = Object.create(h.constructor.prototype, {
											value: {
												value: c
											},
											constructor: {
												value: oi(`${h.name}_${u}`, function() {})
											}
										}), l.values[c] = h, l[u] = h
									},
									_embind_register_float: (l, u, c) => {
										u = Re(u), Un(l, {
											name: u,
											fromWireType: h => h,
											toWireType: (h, m) => m,
											argPackAdvance: 8,
											readValueFromPointer: hu(u, c),
											L: null
										})
									},
									_embind_register_function: (l, u, c, h, m, g) => {
										var w = Cl(u, c);
										l = Re(l), l = ou(l), m = un(h, m), pi(l, function() {
											ma(`Cannot call ${l} due to unbound types`, w)
										}, u - 1), an([], w, T => (El(l, Tl(l, [T[0], null].concat(T.slice(1)), null, m, g), u - 1), []))
									},
									_embind_register_integer: (l, u, c, h, m) => {
										if (u = Re(u), m === -1 && (m = 4294967295), m = T => T, h === 0) {
											var g = 32 - 8 * c;
											m = T => T << g >>> g
										}
										var w = u.includes("unsigned") ? function(T, N) {
											return N >>> 0
										} : function(T, N) {
											return N
										};
										Un(l, {
											name: u,
											fromWireType: m,
											toWireType: w,
											argPackAdvance: 8,
											readValueFromPointer: So(u, c, h !== 0),
											L: null
										})
									},
									_embind_register_memory_view: (l, u, c) => {
										function h(g) {
											return new m(P.buffer, tt[g + 4 >> 2], tt[g >> 2])
										}
										var m = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][u];
										c = Re(c), Un(l, {
											name: c,
											fromWireType: h,
											argPackAdvance: 8,
											readValueFromPointer: h
										}, {
											Vb: !0
										})
									},
									_embind_register_std_string: (l, u) => {
										u = Re(u);
										var c = u === "std::string";
										Un(l, {
											name: u,
											fromWireType: function(h) {
												var m = tt[h >> 2],
													g = h + 4;
												if (c)
													for (var w = g, T = 0; T <= m; ++T) {
														var N = g + T;
														if (T == m || y[N] == 0) {
															if (w = w ? Tt(y, w, N - w) : "", U === void 0) var U = w;
															else U += "\0", U += w;
															w = N + 1
														}
													} else {
														for (U = Array(m), T = 0; T < m; ++T) U[T] = String.fromCharCode(y[g + T]);
														U = U.join("")
													}
												return Mn(h), U
											},
											toWireType: function(h, m) {
												m instanceof ArrayBuffer && (m = new Uint8Array(m));
												var g = typeof m == "string";
												if (!(g || m instanceof Uint8Array || m instanceof Uint8ClampedArray || m instanceof Int8Array)) throw new jt("Cannot pass non-string to std::string");
												var w = c && g ? en(m) : m.length,
													T = Ha(4 + w + 1),
													N = T + 4;
												if (tt[T >> 2] = w, c && g) Ne(m, y, N, w + 1);
												else if (g)
													for (g = 0; g < w; ++g) {
														var U = m.charCodeAt(g);
														if (255 < U) throw Mn(N), new jt("String has UTF-16 code units that do not fit in 8 bits");
														y[N + g] = U
													} else
														for (g = 0; g < w; ++g) y[N + g] = m[g];
												return h !== null && h.push(Mn, T), T
											},
											argPackAdvance: 8,
											readValueFromPointer: va,
											L(h) {
												Mn(h)
											}
										})
									},
									_embind_register_std_wstring: (l, u, c) => {
										if (c = Re(c), u === 2) var h = wo,
											m = fr,
											g = Eo,
											w = T => k[T >> 1];
										else u === 4 && (h = Mo, m = To, g = Co, w = T => tt[T >> 2]);
										Un(l, {
											name: c,
											fromWireType: T => {
												for (var N = tt[T >> 2], U, nt = T + 4, ht = 0; ht <= N; ++ht) {
													var _t = T + 4 + ht * u;
													(ht == N || w(_t) == 0) && (nt = h(nt, _t - nt), U === void 0 ? U = nt : (U += "\0", U += nt), nt = _t + u)
												}
												return Mn(T), U
											},
											toWireType: (T, N) => {
												if (typeof N != "string") throw new jt(`Cannot pass non-string to C++ string type ${c}`);
												var U = g(N),
													nt = Ha(4 + U + u);
												return tt[nt >> 2] = U / u, m(N, nt + 4, U + u), T !== null && T.push(Mn, nt), nt
											},
											argPackAdvance: 8,
											readValueFromPointer: va,
											L(T) {
												Mn(T)
											}
										})
									},
									_embind_register_value_object: (l, u, c, h, m, g) => {
										si[l] = {
											name: Re(u),
											Na: un(c, h),
											O: un(m, g),
											eb: []
										}
									},
									_embind_register_value_object_field: (l, u, c, h, m, g, w, T, N, U) => {
										si[l].eb.push({
											Ob: Re(u),
											Ub: c,
											Sb: un(h, m),
											Tb: g,
											kc: w,
											jc: un(T, N),
											lc: U
										})
									},
									_embind_register_void: (l, u) => {
										u = Re(u), Un(l, {
											Ic: !0,
											name: u,
											argPackAdvance: 0,
											fromWireType: () => {},
											toWireType: () => {}
										})
									},
									_emscripten_get_now_is_monotonic: () => 1,
									_emscripten_memcpy_js: (l, u, c) => y.copyWithin(l, u, u + c),
									_emval_as: (l, u, c) => (l = $n(l), u = Fi(u, "emval::as"), sr(u, c, l)),
									_emval_call_method: (l, u, c, h, m) => (l = vu[l], u = $n(u), c = du(c), l(u, u[c], h, m)),
									_emval_decref: fu,
									_emval_get_method_caller: (l, u, c) => {
										var h = mu(l, u),
											m = h.shift();
										l--;
										var g = Array(l);
										return u = `methodCaller<(${h.map(w=>w.name).join(", ")}) => ${m.name}>`, Ro(oi(u, (w, T, N, U) => {
											for (var nt = 0, ht = 0; ht < l; ++ht) g[ht] = h[ht].readValueFromPointer(U + nt), nt += h[ht].argPackAdvance;
											return w = c === 1 ? Ii(T, g) : T.apply(w, g), sr(m, N, w)
										}))
									},
									_emval_get_module_property: l => (l = du(l), Xe(S[l])),
									_emval_get_property: (l, u) => (l = $n(l), u = $n(u), Xe(l[u])),
									_emval_incref: l => {
										9 < l && (kn[l + 1] += 1)
									},
									_emval_new_array: () => Xe([]),
									_emval_new_cstring: l => Xe(du(l)),
									_emval_new_object: () => Xe({}),
									_emval_run_destructors: l => {
										var u = $n(l);
										hi(u), fu(l)
									},
									_emval_set_property: (l, u, c) => {
										l = $n(l), u = $n(u), c = $n(c), l[u] = c
									},
									_emval_take_value: (l, u) => (l = Fi(l, "_emval_take_value"), l = l.readValueFromPointer(u), Xe(l)),
									emscripten_asm_const_int: (l, u, c) => {
										pu.length = 0;
										for (var h; h = y[u++];) {
											var m = h != 105;
											m &= h != 112, c += m && c % 8 ? 4 : 0, pu.push(h == 112 ? tt[c >> 2] : h == 105 ? W[c >> 2] : zt[c >> 3]), c += m ? 8 : 4
										}
										return tn[l](...pu)
									},
									emscripten_date_now: () => Date.now(),
									emscripten_get_now: () => performance.now(),
									emscripten_resize_heap: l => {
										var u = y.length;
										if (l >>>= 0, 2147483648 < l) return !1;
										for (var c = 1; 4 >= c; c *= 2) {
											var h = u * (1 + .2 / c);
											h = Math.min(h, l + 100663296);
											var m = Math;
											h = Math.max(l, h);
											t: {
												m = (m.min.call(m, 2147483648, h + (65536 - h % 65536) % 65536) - K.buffer.byteLength + 65535) / 65536;
												try {
													K.grow(m), Bt();
													var g = 1;
													break t
												} catch {}
												g = void 0
											}
											if (g) return !0
										}
										return !1
									},
									environ_get: (l, u) => {
										var c = 0;
										return yu().forEach((h, m) => {
											var g = u + c;
											for (m = tt[l + 4 * m >> 2] = g, g = 0; g < h.length; ++g) P[m++] = h.charCodeAt(g);
											P[m] = 0, c += h.length + 1
										}), 0
									},
									environ_sizes_get: (l, u) => {
										var c = yu();
										tt[l >> 2] = c.length;
										var h = 0;
										return c.forEach(m => h += m.length + 1), tt[u >> 2] = h, 0
									},
									fd_close: function(l) {
										try {
											var u = Jn(l);
											if (u.W === null) throw new bt(8);
											u.Ka && (u.Ka = null);
											try {
												u.m.close && u.m.close(u)
											} catch (c) {
												throw c
											} finally {
												ni[u.W] = null
											}
											return u.W = null, 0
										} catch (c) {
											if (typeof hn > "u" || c.name !== "ErrnoError") throw c;
											return c.$
										}
									},
									fd_read: function(l, u, c, h) {
										try {
											t: {
												var m = Jn(l);l = u;
												for (var g, w = u = 0; w < c; w++) {
													var T = tt[l >> 2],
														N = tt[l + 4 >> 2];
													l += 8;
													var U = m,
														nt = g,
														ht = P;
													if (0 > N || 0 > nt) throw new bt(28);
													if (U.W === null) throw new bt(8);
													if ((U.flags & 2097155) === 1) throw new bt(8);
													if ((U.node.mode & 61440) === 16384) throw new bt(31);
													if (!U.m.read) throw new bt(28);
													var _t = typeof nt < "u";
													if (!_t) nt = U.position;
													else if (!U.seekable) throw new bt(70);
													var C = U.m.read(U, ht, T, N, nt);
													_t || (U.position += C);
													var lt = C;
													if (0 > lt) {
														var pt = -1;
														break t
													}
													if (u += lt, lt < N) break;
													typeof g < "u" && (g += lt)
												}
												pt = u
											}
											return tt[h >> 2] = pt,
											0
										}
										catch (ut) {
											if (typeof hn > "u" || ut.name !== "ErrnoError") throw ut;
											return ut.$
										}
									},
									fd_seek: function(l, u, c, h, m) {
										u = c + 2097152 >>> 0 < 4194305 - !!u ? (u >>> 0) + 4294967296 * c : NaN;
										try {
											if (isNaN(u)) return 61;
											var g = Jn(l);
											return iu(g, u, h), Ae = [g.position >>> 0, (gn = g.position, 1 <= +Math.abs(gn) ? 0 < gn ? +Math.floor(gn / 4294967296) >>> 0 : ~~+Math.ceil((gn - +(~~gn >>> 0)) / 4294967296) >>> 0 : 0)], W[m >> 2] = Ae[0], W[m + 4 >> 2] = Ae[1], g.Ka && u === 0 && h === 0 && (g.Ka = null), 0
										} catch (w) {
											if (typeof hn > "u" || w.name !== "ErrnoError") throw w;
											return w.$
										}
									},
									fd_write: function(l, u, c, h) {
										try {
											t: {
												var m = Jn(l);l = u;
												for (var g, w = u = 0; w < c; w++) {
													var T = tt[l >> 2],
														N = tt[l + 4 >> 2];
													l += 8;
													var U = m,
														nt = T,
														ht = N,
														_t = g,
														C = P;
													if (0 > ht || 0 > _t) throw new bt(28);
													if (U.W === null) throw new bt(8);
													if ((U.flags & 2097155) === 0) throw new bt(8);
													if ((U.node.mode & 61440) === 16384) throw new bt(31);
													if (!U.m.write) throw new bt(28);
													U.seekable && U.flags & 1024 && iu(U, 0, 2);
													var lt = typeof _t < "u";
													if (!lt) _t = U.position;
													else if (!U.seekable) throw new bt(70);
													var pt = U.m.write(U, C, nt, ht, _t, void 0);
													lt || (U.position += pt);
													var ut = pt;
													if (0 > ut) {
														var me = -1;
														break t
													}
													u += ut, typeof g < "u" && (g += ut)
												}
												me = u
											}
											return tt[h >> 2] = me,
											0
										}
										catch (dt) {
											if (typeof hn > "u" || dt.name !== "ErrnoError") throw dt;
											return dt.$
										}
									},
									strftime_l: (l, u, c, h) => zo(l, u, c, h)
								},
								He = (function() {
									function l(c) {
										return He = c.exports, K = He.memory, Bt(), Wi = He.__indirect_function_table, te.unshift(He.__wasm_call_ctors), ee--, S.monitorRunDependencies?.(ee), ee == 0 && _e && (c = _e, _e = null, c()), He
									}
									var u = {
										env: bu,
										wasi_snapshot_preview1: bu
									};
									if (ee++, S.monitorRunDependencies?.(ee), S.instantiateWasm) try {
										return S.instantiateWasm(u, l)
									} catch (c) {
										_(`Module.instantiateWasm callback failed with error: ${c}`), re(c)
									}
									return Oe ||= on("canvas_advanced.wasm") ? "canvas_advanced.wasm" : S.locateFile ? S.locateFile("canvas_advanced.wasm", Z) : Z + "canvas_advanced.wasm", Ua(u, function(c) {
										l(c.instance)
									}).catch(re), {}
								})(),
								Mn = l => (Mn = He.free)(l),
								Ha = l => (Ha = He.malloc)(l),
								dr = l => (dr = He.__getTypeName)(l),
								$i = S._ma_device__on_notification_unlocked = l => ($i = S._ma_device__on_notification_unlocked = He.ma_device__on_notification_unlocked)(l);
							S._ma_malloc_emscripten = (l, u) => (S._ma_malloc_emscripten = He.ma_malloc_emscripten)(l, u), S._ma_free_emscripten = (l, u) => (S._ma_free_emscripten = He.ma_free_emscripten)(l, u);
							var _u = S._ma_device_process_pcm_frames_capture__webaudio = (l, u, c) => (_u = S._ma_device_process_pcm_frames_capture__webaudio = He.ma_device_process_pcm_frames_capture__webaudio)(l, u, c),
								Au = S._ma_device_process_pcm_frames_playback__webaudio = (l, u, c) => (Au = S._ma_device_process_pcm_frames_playback__webaudio = He.ma_device_process_pcm_frames_playback__webaudio)(l, u, c);
							S.dynCall_iiji = (l, u, c, h, m) => (S.dynCall_iiji = He.dynCall_iiji)(l, u, c, h, m), S.dynCall_jiji = (l, u, c, h, m) => (S.dynCall_jiji = He.dynCall_jiji)(l, u, c, h, m), S.dynCall_iiiji = (l, u, c, h, m, g) => (S.dynCall_iiiji = He.dynCall_iiiji)(l, u, c, h, m, g), S.dynCall_iij = (l, u, c, h) => (S.dynCall_iij = He.dynCall_iij)(l, u, c, h), S.dynCall_jii = (l, u, c) => (S.dynCall_jii = He.dynCall_jii)(l, u, c), S.dynCall_viijii = (l, u, c, h, m, g, w) => (S.dynCall_viijii = He.dynCall_viijii)(l, u, c, h, m, g, w), S.dynCall_iiiiij = (l, u, c, h, m, g, w) => (S.dynCall_iiiiij = He.dynCall_iiiiij)(l, u, c, h, m, g, w), S.dynCall_iiiiijj = (l, u, c, h, m, g, w, T, N) => (S.dynCall_iiiiijj = He.dynCall_iiiiijj)(l, u, c, h, m, g, w, T, N), S.dynCall_iiiiiijj = (l, u, c, h, m, g, w, T, N, U) => (S.dynCall_iiiiiijj = He.dynCall_iiiiiijj)(l, u, c, h, m, g, w, T, N, U);
							var gi;
							_e = function l() {
								gi || Dl(), gi || (_e = l)
							};

							function Dl() {
								function l() {
									if (!gi && (gi = !0, S.calledRun = !0, !G)) {
										if (S.noFSInit || rr || (rr = !0, S.stdin = S.stdin, S.stdout = S.stdout, S.stderr = S.stderr, S.stdin ? Sa("stdin", S.stdin) : Aa("/dev/tty", "/dev/stdin"), S.stdout ? Sa("stdout", null, S.stdout) : Aa("/dev/tty", "/dev/stdout"), S.stderr ? Sa("stderr", null, S.stderr) : Aa("/dev/tty1", "/dev/stderr"), qi("/dev/stdin", 0), qi("/dev/stdout", 1), qi("/dev/stderr", 1)), dl = !1, d(te), Pt(S), S.onRuntimeInitialized && S.onRuntimeInitialized(), S.postRun)
											for (typeof S.postRun == "function" && (S.postRun = [S.postRun]); S.postRun.length;) {
												var u = S.postRun.shift();
												Le.unshift(u)
											}
										d(Le)
									}
								}
								if (!(0 < ee)) {
									if (S.preRun)
										for (typeof S.preRun == "function" && (S.preRun = [S.preRun]); S.preRun.length;) Rt();
									d(Zt), 0 < ee || (S.setStatus ? (S.setStatus("Running..."), setTimeout(function() {
										setTimeout(function() {
											S.setStatus("")
										}, 1), l()
									}, 1)) : l())
								}
							}
							if (S.preInit)
								for (typeof S.preInit == "function" && (S.preInit = [S.preInit]); 0 < S.preInit.length;) S.preInit.pop()();
							return Dl(), yt = xt, yt
						})
					})();
					const vt = Y
				}), (Nt => {
					Nt.exports = JSON.parse(`{"name":"@rive-app/canvas","version":"2.32.0","description":"Rive's canvas based web api.","main":"rive.js","homepage":"https://rive.app","repository":{"type":"git","url":"https://github.com/rive-app/rive-wasm/tree/master/js"},"keywords":["rive","animation"],"author":"Rive","contributors":["Luigi Rosso <luigi@rive.app> (https://rive.app)","Maxwell Talbot <max@rive.app> (https://rive.app)","Arthur Vivian <arthur@rive.app> (https://rive.app)","Umberto Sonnino <umberto@rive.app> (https://rive.app)","Matthew Sullivan <matt.j.sullivan@gmail.com> (mailto:matt.j.sullivan@gmail.com)"],"license":"MIT","files":["rive.js","rive.js.map","rive.wasm","rive_fallback.wasm","rive.d.ts","rive_advanced.mjs.d.ts"],"typings":"rive.d.ts","dependencies":{},"browser":{"fs":false,"path":false}}`)
				}), ((Nt, Ct, at) => {
					at.r(Ct), at.d(Ct, {
						Animation: () => Y.Animation
					});
					var Y = at(4)
				}), ((Nt, Ct, at) => {
					at.r(Ct), at.d(Ct, {
						Animation: () => Y
					});
					var Y = (function() {
						function vt(it, ot, yt, S) {
							this.animation = it, this.artboard = ot, this.playing = S, this.loopCount = 0, this.scrubTo = null, this.instance = new yt.LinearAnimationInstance(it, ot)
						}
						return Object.defineProperty(vt.prototype, "name", {
							get: function() {
								return this.animation.name
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(vt.prototype, "time", {
							get: function() {
								return this.instance.time
							},
							set: function(it) {
								this.instance.time = it
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(vt.prototype, "loopValue", {
							get: function() {
								return this.animation.loopValue
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(vt.prototype, "needsScrub", {
							get: function() {
								return this.scrubTo !== null
							},
							enumerable: !1,
							configurable: !0
						}), vt.prototype.advance = function(it) {
							this.scrubTo === null ? this.instance.advance(it) : (this.instance.time = 0, this.instance.advance(this.scrubTo), this.scrubTo = null)
						}, vt.prototype.apply = function(it) {
							this.instance.apply(it)
						}, vt.prototype.cleanup = function() {
							this.instance.delete()
						}, vt
					})()
				}), ((Nt, Ct, at) => {
					at.r(Ct), at.d(Ct, {
						AudioAssetWrapper: () => it.AudioAssetWrapper,
						AudioWrapper: () => it.AudioWrapper,
						BLANK_URL: () => vt.BLANK_URL,
						CustomFileAssetLoaderWrapper: () => it.CustomFileAssetLoaderWrapper,
						FileAssetWrapper: () => it.FileAssetWrapper,
						FileFinalizer: () => it.FileFinalizer,
						FontAssetWrapper: () => it.FontAssetWrapper,
						FontWrapper: () => it.FontWrapper,
						ImageAssetWrapper: () => it.ImageAssetWrapper,
						ImageWrapper: () => it.ImageWrapper,
						createFinalization: () => it.createFinalization,
						finalizationRegistry: () => it.finalizationRegistry,
						registerTouchInteractions: () => Y.registerTouchInteractions,
						sanitizeUrl: () => vt.sanitizeUrl
					});
					var Y = at(6),
						vt = at(7),
						it = at(8)
				}), ((Nt, Ct, at) => {
					at.r(Ct), at.d(Ct, {
						registerTouchInteractions: () => it
					});
					var Y = void 0,
						vt = function(ot, yt, S) {
							var Pt, re, xt = [];
							if (["touchstart", "touchmove"].indexOf(ot.type) > -1 && (!((Pt = ot.changedTouches) === null || Pt === void 0) && Pt.length)) {
								yt || ot.preventDefault();
								for (var Yt = 0, Gt = S ? ot.changedTouches.length : 1; Yt < Gt;) {
									var Dt = ot.changedTouches[Yt];
									xt.push({
										clientX: Dt.clientX,
										clientY: Dt.clientY,
										identifier: Dt.identifier
									}), Yt++
								}
							} else if (ot.type === "touchend" && (!((re = ot.changedTouches) === null || re === void 0) && re.length))
								for (var Yt = 0, Gt = S ? ot.changedTouches.length : 1; Yt < Gt;) {
									var Dt = ot.changedTouches[Yt];
									xt.push({
										clientX: Dt.clientX,
										clientY: Dt.clientY,
										identifier: Dt.identifier
									}), Yt++
								} else xt.push({
									clientX: ot.clientX,
									clientY: ot.clientY,
									identifier: 0
								});
							return xt
						},
						it = function(ot) {
							var yt = ot.canvas,
								S = ot.artboard,
								Pt = ot.stateMachines,
								re = Pt === void 0 ? [] : Pt,
								xt = ot.renderer,
								Yt = ot.rive,
								Gt = ot.fit,
								Dt = ot.alignment,
								It = ot.isTouchScrollEnabled,
								ae = It === void 0 ? !1 : It,
								Ut = ot.dispatchPointerExit,
								Me = Ut === void 0 ? !0 : Ut,
								ct = ot.enableMultiTouch,
								ft = ct === void 0 ? !1 : ct,
								E = ot.layoutScaleFactor,
								Z = E === void 0 ? 1 : E;
							if (!yt || !re.length || !xt || !Yt || !S || typeof window > "u") return null;
							var V = null,
								z = !1,
								x = function(R) {
									if (z && R instanceof MouseEvent) {
										R.type == "mouseup" && (z = !1);
										return
									}
									z = ae && R.type === "touchend" && V === "touchstart", V = R.type;
									var K = R.currentTarget.getBoundingClientRect(),
										G = vt(R, ae, ft),
										P = Yt.computeAlignment(Gt, Dt, {
											minX: 0,
											minY: 0,
											maxX: K.width,
											maxY: K.height
										}, S.bounds, Z),
										y = new Yt.Mat2D;
									switch (P.invert(y), G.forEach(function(Oe) {
											var qt = Oe.clientX,
												xn = Oe.clientY;
											if (!(!qt && !xn)) {
												var Qe = qt - K.left,
													Ua = xn - K.top,
													gn = new Yt.Vec2D(Qe, Ua),
													Ae = Yt.mapXY(y, gn),
													tn = Ae.x(),
													d = Ae.y();
												Oe.transformedX = tn, Oe.transformedY = d, Ae.delete(), gn.delete()
											}
										}), y.delete(), P.delete(), R.type) {
										case "mouseout":
											for (var L = function(Oe) {
													Me ? G.forEach(function(qt) {
														Oe.pointerExit(qt.transformedX, qt.transformedY, qt.identifier)
													}) : G.forEach(function(qt) {
														Oe.pointerMove(qt.transformedX, qt.transformedY, qt.identifier)
													})
												}, k = 0, W = re; k < W.length; k++) {
												var tt = W[k];
												L(tt)
											}
											break;
										case "touchmove":
										case "mouseover":
										case "mousemove": {
											for (var gt = function(Oe) {
													G.forEach(function(qt) {
														Oe.pointerMove(qt.transformedX, qt.transformedY, qt.identifier)
													})
												}, zt = 0, Bt = re; zt < Bt.length; zt++) {
												var tt = Bt[zt];
												gt(tt)
											}
											break
										}
										case "touchstart":
										case "mousedown": {
											for (var Zt = function(Oe) {
													G.forEach(function(qt) {
														Oe.pointerDown(qt.transformedX, qt.transformedY, qt.identifier)
													})
												}, te = 0, Le = re; te < Le.length; te++) {
												var tt = Le[te];
												Zt(tt)
											}
											break
										}
										case "touchend": {
											for (var Rt = function(Oe) {
													G.forEach(function(qt) {
														Oe.pointerUp(qt.transformedX, qt.transformedY, qt.identifier), Oe.pointerExit(qt.transformedX, qt.transformedY, qt.identifier)
													})
												}, ee = 0, _e = re; ee < _e.length; ee++) {
												var tt = _e[ee];
												Rt(tt)
											}
											break
										}
										case "mouseup": {
											for (var ve = function(Oe) {
													G.forEach(function(qt) {
														Oe.pointerUp(qt.transformedX, qt.transformedY, qt.identifier)
													})
												}, on = 0, Kn = re; on < Kn.length; on++) {
												var tt = Kn[on];
												ve(tt)
											}
											break
										}
									}
								},
								_ = x.bind(Y);
							return yt.addEventListener("mouseover", _), yt.addEventListener("mouseout", _), yt.addEventListener("mousemove", _), yt.addEventListener("mousedown", _), yt.addEventListener("mouseup", _), yt.addEventListener("touchmove", _, {
									passive: ae
								}), yt.addEventListener("touchstart", _, {
									passive: ae
								}), yt.addEventListener("touchend", _),
								function() {
									yt.removeEventListener("mouseover", _), yt.removeEventListener("mouseout", _), yt.removeEventListener("mousemove", _), yt.removeEventListener("mousedown", _), yt.removeEventListener("mouseup", _), yt.removeEventListener("touchmove", _), yt.removeEventListener("touchstart", _), yt.removeEventListener("touchend", _)
								}
						}
				}), ((Nt, Ct, at) => {
					at.r(Ct), at.d(Ct, {
						BLANK_URL: () => Pt,
						sanitizeUrl: () => Yt
					});
					var Y = /^([^\w]*)(javascript|data|vbscript)/im,
						vt = /&#(\w+)(^\w|;)?/g,
						it = /&(newline|tab);/gi,
						ot = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim,
						yt = /^.+(:|&colon;)/gim,
						S = [".", "/"],
						Pt = "about:blank";

					function re(Gt) {
						return S.indexOf(Gt[0]) > -1
					}

					function xt(Gt) {
						var Dt = Gt.replace(ot, "");
						return Dt.replace(vt, function(It, ae) {
							return String.fromCharCode(ae)
						})
					}

					function Yt(Gt) {
						if (!Gt) return Pt;
						var Dt = xt(Gt).replace(it, "").replace(ot, "").trim();
						if (!Dt) return Pt;
						if (re(Dt)) return Dt;
						var It = Dt.match(yt);
						if (!It) return Dt;
						var ae = It[0];
						return Y.test(ae) ? Pt : Dt
					}
				}), ((Nt, Ct, at) => {
					at.r(Ct), at.d(Ct, {
						AudioAssetWrapper: () => Gt,
						AudioWrapper: () => S,
						CustomFileAssetLoaderWrapper: () => re,
						FileAssetWrapper: () => xt,
						FileFinalizer: () => vt,
						FontAssetWrapper: () => Dt,
						FontWrapper: () => Pt,
						ImageAssetWrapper: () => Yt,
						ImageWrapper: () => yt,
						createFinalization: () => Me,
						finalizationRegistry: () => Ut
					});
					var Y = (function() {
							var ct = function(ft, E) {
								return ct = Object.setPrototypeOf || {
									__proto__: []
								}
								instanceof Array && function(Z, V) {
									Z.__proto__ = V
								} || function(Z, V) {
									for (var z in V) Object.prototype.hasOwnProperty.call(V, z) && (Z[z] = V[z])
								}, ct(ft, E)
							};
							return function(ft, E) {
								if (typeof E != "function" && E !== null) throw new TypeError("Class extends value " + String(E) + " is not a constructor or null");
								ct(ft, E);

								function Z() {
									this.constructor = ft
								}
								ft.prototype = E === null ? Object.create(E) : (Z.prototype = E.prototype, new Z)
							}
						})(),
						vt = (function() {
							function ct(ft) {
								this.selfUnref = !1, this._file = ft
							}
							return ct.prototype.unref = function() {
								this._file && this._file.unref()
							}, ct
						})(),
						it = (function() {
							function ct(ft) {
								this._finalizableObject = ft
							}
							return ct.prototype.unref = function() {
								this._finalizableObject.unref()
							}, ct
						})(),
						ot = (function() {
							function ct() {
								this.selfUnref = !1
							}
							return ct.prototype.unref = function() {}, ct
						})(),
						yt = (function(ct) {
							Y(ft, ct);

							function ft(E) {
								var Z = ct.call(this) || this;
								return Z._nativeImage = E, Z
							}
							return Object.defineProperty(ft.prototype, "nativeImage", {
								get: function() {
									return this._nativeImage
								},
								enumerable: !1,
								configurable: !0
							}), ft.prototype.unref = function() {
								this.selfUnref && this._nativeImage.unref()
							}, ft
						})(ot),
						S = (function(ct) {
							Y(ft, ct);

							function ft(E) {
								var Z = ct.call(this) || this;
								return Z._nativeAudio = E, Z
							}
							return Object.defineProperty(ft.prototype, "nativeAudio", {
								get: function() {
									return this._nativeAudio
								},
								enumerable: !1,
								configurable: !0
							}), ft.prototype.unref = function() {
								this.selfUnref && this._nativeAudio.unref()
							}, ft
						})(ot),
						Pt = (function(ct) {
							Y(ft, ct);

							function ft(E) {
								var Z = ct.call(this) || this;
								return Z._nativeFont = E, Z
							}
							return Object.defineProperty(ft.prototype, "nativeFont", {
								get: function() {
									return this._nativeFont
								},
								enumerable: !1,
								configurable: !0
							}), ft.prototype.unref = function() {
								this.selfUnref && this._nativeFont.unref()
							}, ft
						})(ot),
						re = (function() {
							function ct(ft, E) {
								this._assetLoaderCallback = E, this.assetLoader = new ft.CustomFileAssetLoader({
									loadContents: this.loadContents.bind(this)
								})
							}
							return ct.prototype.loadContents = function(ft, E) {
								var Z;
								return ft.isImage ? Z = new Yt(ft) : ft.isAudio ? Z = new Gt(ft) : ft.isFont && (Z = new Dt(ft)), this._assetLoaderCallback(Z, E)
							}, ct
						})(),
						xt = (function() {
							function ct(ft) {
								this._nativeFileAsset = ft
							}
							return ct.prototype.decode = function(ft) {
								this._nativeFileAsset.decode(ft)
							}, Object.defineProperty(ct.prototype, "name", {
								get: function() {
									return this._nativeFileAsset.name
								},
								enumerable: !1,
								configurable: !0
							}), Object.defineProperty(ct.prototype, "fileExtension", {
								get: function() {
									return this._nativeFileAsset.fileExtension
								},
								enumerable: !1,
								configurable: !0
							}), Object.defineProperty(ct.prototype, "uniqueFilename", {
								get: function() {
									return this._nativeFileAsset.uniqueFilename
								},
								enumerable: !1,
								configurable: !0
							}), Object.defineProperty(ct.prototype, "isAudio", {
								get: function() {
									return this._nativeFileAsset.isAudio
								},
								enumerable: !1,
								configurable: !0
							}), Object.defineProperty(ct.prototype, "isImage", {
								get: function() {
									return this._nativeFileAsset.isImage
								},
								enumerable: !1,
								configurable: !0
							}), Object.defineProperty(ct.prototype, "isFont", {
								get: function() {
									return this._nativeFileAsset.isFont
								},
								enumerable: !1,
								configurable: !0
							}), Object.defineProperty(ct.prototype, "cdnUuid", {
								get: function() {
									return this._nativeFileAsset.cdnUuid
								},
								enumerable: !1,
								configurable: !0
							}), Object.defineProperty(ct.prototype, "nativeFileAsset", {
								get: function() {
									return this._nativeFileAsset
								},
								enumerable: !1,
								configurable: !0
							}), ct
						})(),
						Yt = (function(ct) {
							Y(ft, ct);

							function ft() {
								return ct !== null && ct.apply(this, arguments) || this
							}
							return ft.prototype.setRenderImage = function(E) {
								this._nativeFileAsset.setRenderImage(E.nativeImage)
							}, ft
						})(xt),
						Gt = (function(ct) {
							Y(ft, ct);

							function ft() {
								return ct !== null && ct.apply(this, arguments) || this
							}
							return ft.prototype.setAudioSource = function(E) {
								this._nativeFileAsset.setAudioSource(E.nativeAudio)
							}, ft
						})(xt),
						Dt = (function(ct) {
							Y(ft, ct);

							function ft() {
								return ct !== null && ct.apply(this, arguments) || this
							}
							return ft.prototype.setFont = function(E) {
								this._nativeFileAsset.setFont(E.nativeFont)
							}, ft
						})(xt),
						It = (function() {
							function ct(ft) {}
							return ct.prototype.register = function(ft) {
								ft.selfUnref = !0
							}, ct.prototype.unregister = function(ft) {}, ct
						})(),
						ae = typeof FinalizationRegistry < "u" ? FinalizationRegistry : It,
						Ut = new ae(function(ct) {
							ct?.unref()
						}),
						Me = function(ct, ft) {
							var E = new it(ft);
							Ut.register(ct, E)
						}
				})],
				B = {};

			function Mt(Nt) {
				var Ct = B[Nt];
				if (Ct !== void 0) return Ct.exports;
				var at = B[Nt] = {
					exports: {}
				};
				return Xt[Nt](at, at.exports, Mt), at.exports
			}
			Mt.d = (Nt, Ct) => {
				for (var at in Ct) Mt.o(Ct, at) && !Mt.o(Nt, at) && Object.defineProperty(Nt, at, {
					enumerable: !0,
					get: Ct[at]
				})
			}, Mt.o = (Nt, Ct) => Object.prototype.hasOwnProperty.call(Nt, Ct), Mt.r = Nt => {
				typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(Nt, Symbol.toStringTag, {
					value: "Module"
				}), Object.defineProperty(Nt, "__esModule", {
					value: !0
				})
			};
			var Ht = {};
			return (() => {
				Mt.r(Ht), Mt.d(Ht, {
					Alignment: () => Yt,
					DataEnum: () => zt,
					EventType: () => V,
					Fit: () => xt,
					Layout: () => Gt,
					LoopType: () => z,
					Rive: () => tt,
					RiveEventType: () => Ut,
					RiveFile: () => W,
					RuntimeLoader: () => Dt,
					StateMachineInput: () => ae,
					StateMachineInputType: () => It,
					Testing: () => Ua,
					ViewModel: () => gt,
					ViewModelInstance: () => Zt,
					ViewModelInstanceArtboard: () => qt,
					ViewModelInstanceAssetImage: () => Oe,
					ViewModelInstanceBoolean: () => ee,
					ViewModelInstanceColor: () => Kn,
					ViewModelInstanceEnum: () => ve,
					ViewModelInstanceList: () => on,
					ViewModelInstanceNumber: () => Rt,
					ViewModelInstanceString: () => Le,
					ViewModelInstanceTrigger: () => _e,
					ViewModelInstanceValue: () => te,
					decodeAudio: () => gn,
					decodeFont: () => tn,
					decodeImage: () => Ae
				});
				var Nt = Mt(1),
					Ct = Mt(2),
					at = Mt(3),
					Y = Mt(5),
					vt = (function() {
						var d = function(o, f) {
							return d = Object.setPrototypeOf || {
								__proto__: []
							}
							instanceof Array && function(p, M) {
								p.__proto__ = M
							} || function(p, M) {
								for (var q in M) Object.prototype.hasOwnProperty.call(M, q) && (p[q] = M[q])
							}, d(o, f)
						};
						return function(o, f) {
							if (typeof f != "function" && f !== null) throw new TypeError("Class extends value " + String(f) + " is not a constructor or null");
							d(o, f);

							function p() {
								this.constructor = o
							}
							o.prototype = f === null ? Object.create(f) : (p.prototype = f.prototype, new p)
						}
					})(),
					it = function() {
						return it = Object.assign || function(d) {
							for (var o, f = 1, p = arguments.length; f < p; f++) {
								o = arguments[f];
								for (var M in o) Object.prototype.hasOwnProperty.call(o, M) && (d[M] = o[M])
							}
							return d
						}, it.apply(this, arguments)
					},
					ot = function(d, o, f, p) {
						function M(q) {
							return q instanceof f ? q : new f(function(et) {
								et(q)
							})
						}
						return new(f || (f = Promise))(function(q, et) {
							function St(Tt) {
								try {
									mt(p.next(Tt))
								} catch (Se) {
									et(Se)
								}
							}

							function Et(Tt) {
								try {
									mt(p.throw(Tt))
								} catch (Se) {
									et(Se)
								}
							}

							function mt(Tt) {
								Tt.done ? q(Tt.value) : M(Tt.value).then(St, Et)
							}
							mt((p = p.apply(d, o || [])).next())
						})
					},
					yt = function(d, o) {
						var f = {
								label: 0,
								sent: function() {
									if (q[0] & 1) throw q[1];
									return q[1]
								},
								trys: [],
								ops: []
							},
							p, M, q, et = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
						return et.next = St(0), et.throw = St(1), et.return = St(2), typeof Symbol == "function" && (et[Symbol.iterator] = function() {
							return this
						}), et;

						function St(mt) {
							return function(Tt) {
								return Et([mt, Tt])
							}
						}

						function Et(mt) {
							if (p) throw new TypeError("Generator is already executing.");
							for (; et && (et = 0, mt[0] && (f = 0)), f;) try {
								if (p = 1, M && (q = mt[0] & 2 ? M.return : mt[0] ? M.throw || ((q = M.return) && q.call(M), 0) : M.next) && !(q = q.call(M, mt[1])).done) return q;
								switch (M = 0, q && (mt = [mt[0] & 2, q.value]), mt[0]) {
									case 0:
									case 1:
										q = mt;
										break;
									case 4:
										return f.label++, {
											value: mt[1],
											done: !1
										};
									case 5:
										f.label++, M = mt[1], mt = [0];
										continue;
									case 7:
										mt = f.ops.pop(), f.trys.pop();
										continue;
									default:
										if (q = f.trys, !(q = q.length > 0 && q[q.length - 1]) && (mt[0] === 6 || mt[0] === 2)) {
											f = 0;
											continue
										}
										if (mt[0] === 3 && (!q || mt[1] > q[0] && mt[1] < q[3])) {
											f.label = mt[1];
											break
										}
										if (mt[0] === 6 && f.label < q[1]) {
											f.label = q[1], q = mt;
											break
										}
										if (q && f.label < q[2]) {
											f.label = q[2], f.ops.push(mt);
											break
										}
										q[2] && f.ops.pop(), f.trys.pop();
										continue
								}
								mt = o.call(d, f)
							} catch (Tt) {
								mt = [6, Tt], M = 0
							} finally {
								p = q = 0
							}
							if (mt[0] & 5) throw mt[1];
							return {
								value: mt[0] ? mt[1] : void 0,
								done: !0
							}
						}
					},
					S = function(d, o, f) {
						if (f || arguments.length === 2)
							for (var p = 0, M = o.length, q; p < M; p++)(q || !(p in o)) && (q || (q = Array.prototype.slice.call(o, 0, p)), q[p] = o[p]);
						return d.concat(q || Array.prototype.slice.call(o))
					},
					Pt = (function(d) {
						vt(o, d);

						function o() {
							var f = d !== null && d.apply(this, arguments) || this;
							return f.isHandledError = !0, f
						}
						return o
					})(Error),
					re = function(d) {
						return d && d.isHandledError ? d.message : "Problem loading file; may be corrupt!"
					},
					xt;
				(function(d) {
					d.Cover = "cover", d.Contain = "contain", d.Fill = "fill", d.FitWidth = "fitWidth", d.FitHeight = "fitHeight", d.None = "none", d.ScaleDown = "scaleDown", d.Layout = "layout"
				})(xt || (xt = {}));
				var Yt;
				(function(d) {
					d.Center = "center", d.TopLeft = "topLeft", d.TopCenter = "topCenter", d.TopRight = "topRight", d.CenterLeft = "centerLeft", d.CenterRight = "centerRight", d.BottomLeft = "bottomLeft", d.BottomCenter = "bottomCenter", d.BottomRight = "bottomRight"
				})(Yt || (Yt = {}));
				var Gt = (function() {
						function d(o) {
							var f, p, M, q, et, St, Et;
							this.fit = (f = o?.fit) !== null && f !== void 0 ? f : xt.Contain, this.alignment = (p = o?.alignment) !== null && p !== void 0 ? p : Yt.Center, this.layoutScaleFactor = (M = o?.layoutScaleFactor) !== null && M !== void 0 ? M : 1, this.minX = (q = o?.minX) !== null && q !== void 0 ? q : 0, this.minY = (et = o?.minY) !== null && et !== void 0 ? et : 0, this.maxX = (St = o?.maxX) !== null && St !== void 0 ? St : 0, this.maxY = (Et = o?.maxY) !== null && Et !== void 0 ? Et : 0
						}
						return d.new = function(o) {
							var f = o.fit,
								p = o.alignment,
								M = o.minX,
								q = o.minY,
								et = o.maxX,
								St = o.maxY;
							return console.warn("This function is deprecated: please use `new Layout({})` instead"), new d({
								fit: f,
								alignment: p,
								minX: M,
								minY: q,
								maxX: et,
								maxY: St
							})
						}, d.prototype.copyWith = function(o) {
							var f = o.fit,
								p = o.alignment,
								M = o.layoutScaleFactor,
								q = o.minX,
								et = o.minY,
								St = o.maxX,
								Et = o.maxY;
							return new d({
								fit: f ?? this.fit,
								alignment: p ?? this.alignment,
								layoutScaleFactor: M ?? this.layoutScaleFactor,
								minX: q ?? this.minX,
								minY: et ?? this.minY,
								maxX: St ?? this.maxX,
								maxY: Et ?? this.maxY
							})
						}, d.prototype.runtimeFit = function(o) {
							if (this.cachedRuntimeFit) return this.cachedRuntimeFit;
							var f;
							return this.fit === xt.Cover ? f = o.Fit.cover : this.fit === xt.Contain ? f = o.Fit.contain : this.fit === xt.Fill ? f = o.Fit.fill : this.fit === xt.FitWidth ? f = o.Fit.fitWidth : this.fit === xt.FitHeight ? f = o.Fit.fitHeight : this.fit === xt.ScaleDown ? f = o.Fit.scaleDown : this.fit === xt.Layout ? f = o.Fit.layout : f = o.Fit.none, this.cachedRuntimeFit = f, f
						}, d.prototype.runtimeAlignment = function(o) {
							if (this.cachedRuntimeAlignment) return this.cachedRuntimeAlignment;
							var f;
							return this.alignment === Yt.TopLeft ? f = o.Alignment.topLeft : this.alignment === Yt.TopCenter ? f = o.Alignment.topCenter : this.alignment === Yt.TopRight ? f = o.Alignment.topRight : this.alignment === Yt.CenterLeft ? f = o.Alignment.centerLeft : this.alignment === Yt.CenterRight ? f = o.Alignment.centerRight : this.alignment === Yt.BottomLeft ? f = o.Alignment.bottomLeft : this.alignment === Yt.BottomCenter ? f = o.Alignment.bottomCenter : this.alignment === Yt.BottomRight ? f = o.Alignment.bottomRight : f = o.Alignment.center, this.cachedRuntimeAlignment = f, f
						}, d
					})(),
					Dt = (function() {
						function d() {}
						return d.loadRuntime = function() {
							Nt.default({
								locateFile: function() {
									return d.wasmURL
								}
							}).then(function(o) {
								var f;
								for (d.runtime = o; d.callBackQueue.length > 0;)(f = d.callBackQueue.shift()) === null || f === void 0 || f(d.runtime)
							}).catch(function(o) {
								var f = {
									message: o?.message || "Unknown error",
									type: o?.name || "Error",
									wasmError: o instanceof WebAssembly.CompileError || o instanceof WebAssembly.RuntimeError,
									originalError: o
								};
								console.debug("Rive WASM load error details:", f);
								var p = "https://cdn.jsdelivr.net/npm/".concat(Ct.name, "@").concat(Ct.version, "/rive_fallback.wasm");
								if (d.wasmURL.toLowerCase() !== p) console.warn("Failed to load WASM from ".concat(d.wasmURL, " (").concat(f.message, "), trying jsdelivr as a backup")), d.setWasmUrl(p), d.loadRuntime();
								else {
									var M = ["Could not load Rive WASM file from ".concat(d.wasmURL, " or ").concat(p, "."), "Possible reasons:", "- Network connection is down", "- WebAssembly is not supported in this environment", "- The WASM file is corrupted or incompatible", `
Error details:`, "- Type: ".concat(f.type), "- Message: ".concat(f.message), "- WebAssembly-specific error: ".concat(f.wasmError), `
To resolve, you may need to:`, "1. Check your network connection", "2. Set a new WASM source via RuntimeLoader.setWasmUrl()", "3. Call RuntimeLoader.loadRuntime() again"].join(`
`);
									console.error(M)
								}
							})
						}, d.getInstance = function(o) {
							d.isLoading || (d.isLoading = !0, d.loadRuntime()), d.runtime ? o(d.runtime) : d.callBackQueue.push(o)
						}, d.awaitInstance = function() {
							return new Promise(function(o) {
								return d.getInstance(function(f) {
									return o(f)
								})
							})
						}, d.setWasmUrl = function(o) {
							d.wasmURL = o
						}, d.getWasmUrl = function() {
							return d.wasmURL
						}, d.isLoading = !1, d.callBackQueue = [], d.wasmURL = "https://unpkg.com/".concat(Ct.name, "@").concat(Ct.version, "/rive.wasm"), d
					})(),
					It;
				(function(d) {
					d[d.Number = 56] = "Number", d[d.Trigger = 58] = "Trigger", d[d.Boolean = 59] = "Boolean"
				})(It || (It = {}));
				var ae = (function() {
						function d(o, f) {
							this.type = o, this.runtimeInput = f
						}
						return Object.defineProperty(d.prototype, "name", {
							get: function() {
								return this.runtimeInput.name
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "value", {
							get: function() {
								return this.runtimeInput.value
							},
							set: function(o) {
								this.runtimeInput.value = o
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.fire = function() {
							this.type === It.Trigger && this.runtimeInput.fire()
						}, d.prototype.delete = function() {
							this.runtimeInput = null
						}, d
					})(),
					Ut;
				(function(d) {
					d[d.General = 128] = "General", d[d.OpenUrl = 131] = "OpenUrl"
				})(Ut || (Ut = {}));
				var Me = (function() {
						function d(o) {
							this.isBindableArtboard = !1, this.isBindableArtboard = o
						}
						return d
					})(),
					ct = (function(d) {
						vt(o, d);

						function o(f, p) {
							var M = d.call(this, !1) || this;
							return M.nativeArtboard = f, M.file = p, M
						}
						return o
					})(Me),
					ft = (function(d) {
						vt(o, d);

						function o(f) {
							var p = d.call(this, !0) || this;
							return p.selfUnref = !1, p.nativeArtboard = f, p
						}
						return o.prototype.destroy = function() {
							this.selfUnref && this.nativeArtboard.unref()
						}, o
					})(Me),
					E = (function() {
						function d(o, f, p, M) {
							this.stateMachine = o, this.playing = p, this.artboard = M, this.inputs = [], this.instance = new f.StateMachineInstance(o, M), this.initInputs(f)
						}
						return Object.defineProperty(d.prototype, "name", {
							get: function() {
								return this.stateMachine.name
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "statesChanged", {
							get: function() {
								for (var o = [], f = 0; f < this.instance.stateChangedCount(); f++) o.push(this.instance.stateChangedNameByIndex(f));
								return o
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.advance = function(o) {
							this.instance.advance(o)
						}, d.prototype.advanceAndApply = function(o) {
							this.instance.advanceAndApply(o)
						}, d.prototype.reportedEventCount = function() {
							return this.instance.reportedEventCount()
						}, d.prototype.reportedEventAt = function(o) {
							return this.instance.reportedEventAt(o)
						}, d.prototype.initInputs = function(o) {
							for (var f = 0; f < this.instance.inputCount(); f++) {
								var p = this.instance.input(f);
								this.inputs.push(this.mapRuntimeInput(p, o))
							}
						}, d.prototype.mapRuntimeInput = function(o, f) {
							if (o.type === f.SMIInput.bool) return new ae(It.Boolean, o.asBool());
							if (o.type === f.SMIInput.number) return new ae(It.Number, o.asNumber());
							if (o.type === f.SMIInput.trigger) return new ae(It.Trigger, o.asTrigger())
						}, d.prototype.cleanup = function() {
							this.inputs.forEach(function(o) {
								o.delete()
							}), this.inputs.length = 0, this.instance.delete()
						}, d.prototype.bindViewModelInstance = function(o) {
							o.runtimeInstance != null && this.instance.bindViewModelInstance(o.runtimeInstance)
						}, d
					})(),
					Z = (function() {
						function d(o, f, p, M, q) {
							M === void 0 && (M = []), q === void 0 && (q = []), this.runtime = o, this.artboard = f, this.eventManager = p, this.animations = M, this.stateMachines = q
						}
						return d.prototype.add = function(o, f, p) {
							if (p === void 0 && (p = !0), o = Qe(o), o.length === 0) this.animations.forEach(function(Ne) {
								return Ne.playing = f
							}), this.stateMachines.forEach(function(Ne) {
								return Ne.playing = f
							});
							else
								for (var M = this.animations.map(function(Ne) {
										return Ne.name
									}), q = this.stateMachines.map(function(Ne) {
										return Ne.name
									}), et = 0; et < o.length; et++) {
									var St = M.indexOf(o[et]),
										Et = q.indexOf(o[et]);
									if (St >= 0 || Et >= 0) St >= 0 ? this.animations[St].playing = f : this.stateMachines[Et].playing = f;
									else {
										var mt = this.artboard.animationByName(o[et]);
										if (mt) {
											var Tt = new at.Animation(mt, this.artboard, this.runtime, f);
											Tt.advance(0), Tt.apply(1), this.animations.push(Tt)
										} else {
											var Se = this.artboard.stateMachineByName(o[et]);
											if (Se) {
												var en = new E(Se, this.runtime, f, this.artboard);
												this.stateMachines.push(en)
											}
										}
									}
								}
							return p && (f ? this.eventManager.fire({
								type: V.Play,
								data: this.playing
							}) : this.eventManager.fire({
								type: V.Pause,
								data: this.paused
							})), f ? this.playing : this.paused
						}, d.prototype.initLinearAnimations = function(o, f) {
							for (var p = this.animations.map(function(Et) {
									return Et.name
								}), M = 0; M < o.length; M++) {
								var q = p.indexOf(o[M]);
								if (q >= 0) this.animations[q].playing = f;
								else {
									var et = this.artboard.animationByName(o[M]);
									if (et) {
										var St = new at.Animation(et, this.artboard, this.runtime, f);
										St.advance(0), St.apply(1), this.animations.push(St)
									} else console.error("Animation with name ".concat(o[M], " not found."))
								}
							}
						}, d.prototype.initStateMachines = function(o, f) {
							for (var p = this.stateMachines.map(function(Et) {
									return Et.name
								}), M = 0; M < o.length; M++) {
								var q = p.indexOf(o[M]);
								if (q >= 0) this.stateMachines[q].playing = f;
								else {
									var et = this.artboard.stateMachineByName(o[M]);
									if (et) {
										var St = new E(et, this.runtime, f, this.artboard);
										this.stateMachines.push(St)
									} else console.warn("State Machine with name ".concat(o[M], " not found.")), this.initLinearAnimations([o[M]], f)
								}
							}
						}, d.prototype.play = function(o) {
							return this.add(o, !0)
						}, d.prototype.advanceIfPaused = function() {
							this.stateMachines.forEach(function(o) {
								o.playing || o.advanceAndApply(0)
							})
						}, d.prototype.pause = function(o) {
							return this.add(o, !1)
						}, d.prototype.scrub = function(o, f) {
							var p = this.animations.filter(function(M) {
								return o.includes(M.name)
							});
							return p.forEach(function(M) {
								return M.scrubTo = f
							}), p.map(function(M) {
								return M.name
							})
						}, Object.defineProperty(d.prototype, "playing", {
							get: function() {
								return this.animations.filter(function(o) {
									return o.playing
								}).map(function(o) {
									return o.name
								}).concat(this.stateMachines.filter(function(o) {
									return o.playing
								}).map(function(o) {
									return o.name
								}))
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "paused", {
							get: function() {
								return this.animations.filter(function(o) {
									return !o.playing
								}).map(function(o) {
									return o.name
								}).concat(this.stateMachines.filter(function(o) {
									return !o.playing
								}).map(function(o) {
									return o.name
								}))
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.stop = function(o) {
							var f = this;
							o = Qe(o);
							var p = [];
							if (o.length === 0) p = this.animations.map(function(et) {
								return et.name
							}).concat(this.stateMachines.map(function(et) {
								return et.name
							})), this.animations.forEach(function(et) {
								return et.cleanup()
							}), this.stateMachines.forEach(function(et) {
								return et.cleanup()
							}), this.animations.splice(0, this.animations.length), this.stateMachines.splice(0, this.stateMachines.length);
							else {
								var M = this.animations.filter(function(et) {
									return o.includes(et.name)
								});
								M.forEach(function(et) {
									et.cleanup(), f.animations.splice(f.animations.indexOf(et), 1)
								});
								var q = this.stateMachines.filter(function(et) {
									return o.includes(et.name)
								});
								q.forEach(function(et) {
									et.cleanup(), f.stateMachines.splice(f.stateMachines.indexOf(et), 1)
								}), p = M.map(function(et) {
									return et.name
								}).concat(q.map(function(et) {
									return et.name
								}))
							}
							return this.eventManager.fire({
								type: V.Stop,
								data: p
							}), p
						}, Object.defineProperty(d.prototype, "isPlaying", {
							get: function() {
								return this.animations.reduce(function(o, f) {
									return o || f.playing
								}, !1) || this.stateMachines.reduce(function(o, f) {
									return o || f.playing
								}, !1)
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "isPaused", {
							get: function() {
								return !this.isPlaying && (this.animations.length > 0 || this.stateMachines.length > 0)
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "isStopped", {
							get: function() {
								return this.animations.length === 0 && this.stateMachines.length === 0
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.atLeastOne = function(o, f) {
							f === void 0 && (f = !0);
							var p;
							return this.animations.length === 0 && this.stateMachines.length === 0 && (this.artboard.animationCount() > 0 ? this.add([p = this.artboard.animationByIndex(0).name], o, f) : this.artboard.stateMachineCount() > 0 && this.add([p = this.artboard.stateMachineByIndex(0).name], o, f)), p
						}, d.prototype.handleLooping = function() {
							for (var o = 0, f = this.animations.filter(function(M) {
									return M.playing
								}); o < f.length; o++) {
								var p = f[o];
								p.loopValue === 0 && p.loopCount ? (p.loopCount = 0, this.stop(p.name)) : p.loopValue === 1 && p.loopCount ? (this.eventManager.fire({
									type: V.Loop,
									data: {
										animation: p.name,
										type: z.Loop
									}
								}), p.loopCount = 0) : p.loopValue === 2 && p.loopCount > 1 && (this.eventManager.fire({
									type: V.Loop,
									data: {
										animation: p.name,
										type: z.PingPong
									}
								}), p.loopCount = 0)
							}
						}, d.prototype.handleStateChanges = function() {
							for (var o = [], f = 0, p = this.stateMachines.filter(function(q) {
									return q.playing
								}); f < p.length; f++) {
								var M = p[f];
								o.push.apply(o, M.statesChanged)
							}
							o.length > 0 && this.eventManager.fire({
								type: V.StateChange,
								data: o
							})
						}, d.prototype.handleAdvancing = function(o) {
							this.eventManager.fire({
								type: V.Advance,
								data: o
							})
						}, d
					})(),
					V;
				(function(d) {
					d.Load = "load", d.LoadError = "loaderror", d.Play = "play", d.Pause = "pause", d.Stop = "stop", d.Loop = "loop", d.Draw = "draw", d.Advance = "advance", d.StateChange = "statechange", d.RiveEvent = "riveevent", d.AudioStatusChange = "audiostatuschange"
				})(V || (V = {}));
				var z;
				(function(d) {
					d.OneShot = "oneshot", d.Loop = "loop", d.PingPong = "pingpong"
				})(z || (z = {}));
				var x = (function() {
						function d(o) {
							o === void 0 && (o = []), this.listeners = o
						}
						return d.prototype.getListeners = function(o) {
							return this.listeners.filter(function(f) {
								return f.type === o
							})
						}, d.prototype.add = function(o) {
							this.listeners.includes(o) || this.listeners.push(o)
						}, d.prototype.remove = function(o) {
							for (var f = 0; f < this.listeners.length; f++) {
								var p = this.listeners[f];
								if (p.type === o.type && p.callback === o.callback) {
									this.listeners.splice(f, 1);
									break
								}
							}
						}, d.prototype.removeAll = function(o) {
							var f = this;
							o ? this.listeners.filter(function(p) {
								return p.type === o
							}).forEach(function(p) {
								return f.remove(p)
							}) : this.listeners.splice(0, this.listeners.length)
						}, d.prototype.fire = function(o) {
							var f = this.getListeners(o.type);
							f.forEach(function(p) {
								return p.callback(o)
							})
						}, d
					})(),
					_ = (function() {
						function d(o) {
							this.eventManager = o, this.queue = []
						}
						return d.prototype.add = function(o) {
							this.queue.push(o)
						}, d.prototype.process = function() {
							for (; this.queue.length > 0;) {
								var o = this.queue.shift();
								o?.action && o.action(), o?.event && this.eventManager.fire(o.event)
							}
						}, d
					})(),
					R;
				(function(d) {
					d[d.AVAILABLE = 0] = "AVAILABLE", d[d.UNAVAILABLE = 1] = "UNAVAILABLE"
				})(R || (R = {}));
				var K = (function(d) {
						vt(o, d);

						function o() {
							var f = d !== null && d.apply(this, arguments) || this;
							return f._started = !1, f._enabled = !1, f._status = R.UNAVAILABLE, f
						}
						return o.prototype.delay = function(f) {
							return ot(this, void 0, void 0, function() {
								return yt(this, function(p) {
									return [2, new Promise(function(M) {
										return setTimeout(M, f)
									})]
								})
							})
						}, o.prototype.timeout = function() {
							return ot(this, void 0, void 0, function() {
								return yt(this, function(f) {
									return [2, new Promise(function(p, M) {
										return setTimeout(M, 50)
									})]
								})
							})
						}, o.prototype.reportToListeners = function() {
							this.fire({
								type: V.AudioStatusChange
							}), this.removeAll()
						}, o.prototype.enableAudio = function() {
							return ot(this, void 0, void 0, function() {
								return yt(this, function(f) {
									return this._enabled || (this._enabled = !0, this._status = R.AVAILABLE, this.reportToListeners()), [2]
								})
							})
						}, o.prototype.testAudio = function() {
							return ot(this, void 0, void 0, function() {
								return yt(this, function(f) {
									switch (f.label) {
										case 0:
											if (!(this._status === R.UNAVAILABLE && this._audioContext !== null)) return [3, 4];
											f.label = 1;
										case 1:
											return f.trys.push([1, 3, , 4]), [4, Promise.race([this._audioContext.resume(), this.timeout()])];
										case 2:
											return f.sent(), this.enableAudio(), [3, 4];
										case 3:
											return f.sent(), [3, 4];
										case 4:
											return [2]
									}
								})
							})
						}, o.prototype._establishAudio = function() {
							return ot(this, void 0, void 0, function() {
								return yt(this, function(f) {
									switch (f.label) {
										case 0:
											return this._started ? [3, 5] : (this._started = !0, typeof window > "u" ? (this.enableAudio(), [3, 5]) : [3, 1]);
										case 1:
											this._audioContext = new AudioContext, this.listenForUserAction(), f.label = 2;
										case 2:
											return this._status !== R.UNAVAILABLE ? [3, 5] : [4, this.testAudio()];
										case 3:
											return f.sent(), [4, this.delay(1e3)];
										case 4:
											return f.sent(), [3, 2];
										case 5:
											return [2]
									}
								})
							})
						}, o.prototype.listenForUserAction = function() {
							var f = this,
								p = function() {
									return ot(f, void 0, void 0, function() {
										return yt(this, function(M) {
											return this.enableAudio(), [2]
										})
									})
								};
							document.addEventListener("pointerdown", p, {
								once: !0
							})
						}, o.prototype.establishAudio = function() {
							return ot(this, void 0, void 0, function() {
								return yt(this, function(f) {
									return this._establishAudio(), [2]
								})
							})
						}, Object.defineProperty(o.prototype, "systemVolume", {
							get: function() {
								return this._status === R.UNAVAILABLE ? (this.testAudio(), 0) : 1
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(o.prototype, "status", {
							get: function() {
								return this._status
							},
							enumerable: !1,
							configurable: !0
						}), o
					})(x),
					G = new K,
					P = (function() {
						function d() {}
						return d.prototype.observe = function() {}, d.prototype.unobserve = function() {}, d.prototype.disconnect = function() {}, d
					})(),
					y = globalThis.ResizeObserver || P,
					L = (function() {
						function d() {
							var o = this;
							this._elementsMap = new Map, this._onObservedEntry = function(f) {
								var p = o._elementsMap.get(f.target);
								p !== null ? p.onResize(f.target.clientWidth == 0 || f.target.clientHeight == 0) : o._resizeObserver.unobserve(f.target)
							}, this._onObserved = function(f) {
								f.forEach(o._onObservedEntry)
							}, this._resizeObserver = new y(this._onObserved)
						}
						return d.prototype.add = function(o, f) {
							var p = {
								onResize: f,
								element: o
							};
							return this._elementsMap.set(o, p), this._resizeObserver.observe(o), p
						}, d.prototype.remove = function(o) {
							this._resizeObserver.unobserve(o.element), this._elementsMap.delete(o.element)
						}, d
					})(),
					k = new L,
					W = (function() {
						function d(o) {
							this.enableRiveAssetCDN = !0, this.referenceCount = 0, this.destroyed = !1, this.selfUnref = !1, this.bindableArtboards = [], this.src = o.src, this.buffer = o.buffer, o.assetLoader && (this.assetLoader = o.assetLoader), this.enableRiveAssetCDN = typeof o.enableRiveAssetCDN == "boolean" ? o.enableRiveAssetCDN : !0, this.eventManager = new x, o.onLoad && this.on(V.Load, o.onLoad), o.onLoadError && this.on(V.LoadError, o.onLoadError)
						}
						return d.prototype.releaseFile = function() {
							var o;
							this.selfUnref && ((o = this.file) === null || o === void 0 || o.unref()), this.file = null
						}, d.prototype.releaseBindableArtboards = function() {
							this.bindableArtboards.forEach(function(o) {
								return o.destroy()
							})
						}, d.prototype.initData = function() {
							return ot(this, void 0, void 0, function() {
								var o, f, p, M, q;
								return yt(this, function(et) {
									switch (et.label) {
										case 0:
											return this.src ? (o = this, [4, xn(this.src)]) : [3, 2];
										case 1:
											o.buffer = et.sent(), et.label = 2;
										case 2:
											return this.destroyed ? [2] : (this.assetLoader && (p = new Y.CustomFileAssetLoaderWrapper(this.runtime, this.assetLoader), f = p.assetLoader), M = this, [4, this.runtime.load(new Uint8Array(this.buffer), f, this.enableRiveAssetCDN)]);
										case 3:
											return M.file = et.sent(), q = new Y.FileFinalizer(this.file), Y.finalizationRegistry.register(this, q), this.destroyed ? (this.releaseFile(), [2]) : (this.file !== null ? this.eventManager.fire({
												type: V.Load,
												data: this
											}) : this.fireLoadError(d.fileLoadErrorMessage), [2])
									}
								})
							})
						}, d.prototype.init = function() {
							return ot(this, void 0, void 0, function() {
								var o, f;
								return yt(this, function(p) {
									switch (p.label) {
										case 0:
											if (!this.src && !this.buffer) return this.fireLoadError(d.missingErrorMessage), [2];
											p.label = 1;
										case 1:
											return p.trys.push([1, 4, , 5]), o = this, [4, Dt.awaitInstance()];
										case 2:
											return o.runtime = p.sent(), this.destroyed ? [2] : [4, this.initData()];
										case 3:
											return p.sent(), [3, 5];
										case 4:
											return f = p.sent(), this.fireLoadError(f instanceof Error ? f.message : d.fileLoadErrorMessage), [3, 5];
										case 5:
											return [2]
									}
								})
							})
						}, d.prototype.fireLoadError = function(o) {
							throw this.eventManager.fire({
								type: V.LoadError,
								data: o
							}), new Error(o)
						}, d.prototype.on = function(o, f) {
							this.eventManager.add({
								type: o,
								callback: f
							})
						}, d.prototype.off = function(o, f) {
							this.eventManager.remove({
								type: o,
								callback: f
							})
						}, d.prototype.cleanup = function() {
							this.referenceCount -= 1, this.referenceCount <= 0 && (this.removeAllRiveEventListeners(), this.releaseFile(), this.releaseBindableArtboards(), this.destroyed = !0)
						}, d.prototype.removeAllRiveEventListeners = function(o) {
							this.eventManager.removeAll(o)
						}, d.prototype.getInstance = function() {
							if (this.file !== null) return this.referenceCount += 1, this.file
						}, d.prototype.destroyIfUnused = function() {
							this.referenceCount <= 0 && this.cleanup()
						}, d.prototype.createBindableArtboard = function(o) {
							if (o != null) {
								var f = new ft(o);
								return (0, Y.createFinalization)(f, f.nativeArtboard), this.bindableArtboards.push(f), f
							}
							return null
						}, d.prototype.getArtboard = function(o) {
							var f = this.file.artboardByName(o);
							if (f != null) return new ct(f, this)
						}, d.prototype.getBindableArtboard = function(o) {
							var f = this.file.bindableArtboardByName(o);
							return this.createBindableArtboard(f)
						}, d.prototype.getDefaultBindableArtboard = function() {
							var o = this.file.bindableArtboardDefault();
							return this.createBindableArtboard(o)
						}, d.prototype.internalBindableArtboardFromArtboard = function(o) {
							var f = this.file.internalBindableArtboardFromArtboard(o);
							return this.createBindableArtboard(f)
						}, d.missingErrorMessage = "Rive source file or data buffer required", d.fileLoadErrorMessage = "The file failed to load", d
					})(),
					tt = (function() {
						function d(o) {
							var f = this,
								p;
							this.loaded = !1, this.destroyed = !1, this._observed = null, this.readyForPlaying = !1, this.artboard = null, this.eventCleanup = null, this.shouldDisableRiveListeners = !1, this.automaticallyHandleEvents = !1, this.dispatchPointerExit = !0, this.enableMultiTouch = !1, this.enableRiveAssetCDN = !0, this._volume = 1, this._artboardWidth = void 0, this._artboardHeight = void 0, this._devicePixelRatioUsed = 1, this._hasZeroSize = !1, this._audioEventListener = null, this._boundDraw = null, this._viewModelInstance = null, this._dataEnums = null, this.durations = [], this.frameTimes = [], this.frameCount = 0, this.isTouchScrollEnabled = !1, this.onCanvasResize = function(M) {
								var q = f._hasZeroSize !== M;
								f._hasZeroSize = M, M ? (!f._layout.maxX || !f._layout.maxY) && f.resizeToCanvas() : q && f.resizeDrawingSurfaceToCanvas()
							}, this.renderSecondTimer = 0, this._boundDraw = this.draw.bind(this), this.canvas = o.canvas, o.canvas.constructor === HTMLCanvasElement && (this._observed = k.add(this.canvas, this.onCanvasResize)), this.src = o.src, this.buffer = o.buffer, this.riveFile = o.riveFile, this.layout = (p = o.layout) !== null && p !== void 0 ? p : new Gt, this.shouldDisableRiveListeners = !!o.shouldDisableRiveListeners, this.isTouchScrollEnabled = !!o.isTouchScrollEnabled, this.automaticallyHandleEvents = !!o.automaticallyHandleEvents, this.dispatchPointerExit = o.dispatchPointerExit === !1 ? o.dispatchPointerExit : this.dispatchPointerExit, this.enableMultiTouch = !!o.enableMultiTouch, this.enableRiveAssetCDN = o.enableRiveAssetCDN === void 0 ? !0 : o.enableRiveAssetCDN, this.eventManager = new x, o.onLoad && this.on(V.Load, o.onLoad), o.onLoadError && this.on(V.LoadError, o.onLoadError), o.onPlay && this.on(V.Play, o.onPlay), o.onPause && this.on(V.Pause, o.onPause), o.onStop && this.on(V.Stop, o.onStop), o.onLoop && this.on(V.Loop, o.onLoop), o.onStateChange && this.on(V.StateChange, o.onStateChange), o.onAdvance && this.on(V.Advance, o.onAdvance), o.onload && !o.onLoad && this.on(V.Load, o.onload), o.onloaderror && !o.onLoadError && this.on(V.LoadError, o.onloaderror), o.onplay && !o.onPlay && this.on(V.Play, o.onplay), o.onpause && !o.onPause && this.on(V.Pause, o.onpause), o.onstop && !o.onStop && this.on(V.Stop, o.onstop), o.onloop && !o.onLoop && this.on(V.Loop, o.onloop), o.onstatechange && !o.onStateChange && this.on(V.StateChange, o.onstatechange), o.assetLoader && (this.assetLoader = o.assetLoader), this.taskQueue = new _(this.eventManager), this.init({
								src: this.src,
								buffer: this.buffer,
								riveFile: this.riveFile,
								autoplay: o.autoplay,
								autoBind: o.autoBind,
								animations: o.animations,
								stateMachines: o.stateMachines,
								artboard: o.artboard,
								useOffscreenRenderer: o.useOffscreenRenderer
							})
						}
						return Object.defineProperty(d.prototype, "viewModelCount", {
							get: function() {
								return this.file.viewModelCount()
							},
							enumerable: !1,
							configurable: !0
						}), d.new = function(o) {
							return console.warn("This function is deprecated: please use `new Rive({})` instead"), new d(o)
						}, d.prototype.onSystemAudioChanged = function() {
							this.volume = this._volume
						}, d.prototype.init = function(o) {
							var f = this,
								p = o.src,
								M = o.buffer,
								q = o.riveFile,
								et = o.animations,
								St = o.stateMachines,
								Et = o.artboard,
								mt = o.autoplay,
								Tt = mt === void 0 ? !1 : mt,
								Se = o.useOffscreenRenderer,
								en = Se === void 0 ? !1 : Se,
								Ne = o.autoBind,
								bn = Ne === void 0 ? !1 : Ne;
							if (!this.destroyed) {
								if (this.src = p, this.buffer = M, this.riveFile = q, !this.src && !this.buffer && !this.riveFile) throw new Pt(d.missingErrorMessage);
								var cn = Qe(et),
									nn = Qe(St);
								this.loaded = !1, this.readyForPlaying = !1, Dt.awaitInstance().then(function(Ze) {
									f.destroyed || (f.runtime = Ze, f.removeRiveListeners(), f.deleteRiveRenderer(), f.renderer = f.runtime.makeRenderer(f.canvas, en), f.canvas.width || f.canvas.height || f.resizeDrawingSurfaceToCanvas(), f.initData(Et, cn, nn, Tt, bn).then(function(fn) {
										if (fn) return f.setupRiveListeners()
									}).catch(function(fn) {
										console.error(fn)
									}))
								}).catch(function(Ze) {
									console.error(Ze)
								})
							}
						}, d.prototype.setupRiveListeners = function(o) {
							var f = this;
							if (this.eventCleanup && this.eventCleanup(), !this.shouldDisableRiveListeners) {
								var p = (this.animator.stateMachines || []).filter(function(St) {
										return St.playing && f.runtime.hasListeners(St.instance)
									}).map(function(St) {
										return St.instance
									}),
									M = this.isTouchScrollEnabled,
									q = this.dispatchPointerExit,
									et = this.enableMultiTouch;
								o && "isTouchScrollEnabled" in o && (M = o.isTouchScrollEnabled), this.eventCleanup = (0, Y.registerTouchInteractions)({
									canvas: this.canvas,
									artboard: this.artboard,
									stateMachines: p,
									renderer: this.renderer,
									rive: this.runtime,
									fit: this._layout.runtimeFit(this.runtime),
									alignment: this._layout.runtimeAlignment(this.runtime),
									isTouchScrollEnabled: M,
									dispatchPointerExit: q,
									enableMultiTouch: et,
									layoutScaleFactor: this._layout.layoutScaleFactor
								})
							}
						}, d.prototype.removeRiveListeners = function() {
							this.eventCleanup && (this.eventCleanup(), this.eventCleanup = null)
						}, d.prototype.initializeAudio = function() {
							var o = this,
								f;
							G.status == R.UNAVAILABLE && !((f = this.artboard) === null || f === void 0) && f.hasAudio && this._audioEventListener === null && (this._audioEventListener = {
								type: V.AudioStatusChange,
								callback: function() {
									return o.onSystemAudioChanged()
								}
							}, G.add(this._audioEventListener), G.establishAudio())
						}, d.prototype.initArtboardSize = function() {
							this.artboard && (this._artboardWidth = this.artboard.width = this._artboardWidth || this.artboard.width, this._artboardHeight = this.artboard.height = this._artboardHeight || this.artboard.height)
						}, d.prototype.initData = function(o, f, p, M, q) {
							return ot(this, void 0, void 0, function() {
								var et, St, Et, mt;
								return yt(this, function(Tt) {
									switch (Tt.label) {
										case 0:
											return Tt.trys.push([0, 3, , 4]), this.riveFile != null ? [3, 2] : (et = new W({
												src: this.src,
												buffer: this.buffer,
												enableRiveAssetCDN: this.enableRiveAssetCDN,
												assetLoader: this.assetLoader
											}), this.riveFile = et, [4, et.init()]);
										case 1:
											if (Tt.sent(), this.destroyed) return et.destroyIfUnused(), [2, !1];
											Tt.label = 2;
										case 2:
											return this.file = this.riveFile.getInstance(), this.initArtboard(o, f, p, M, q), this.initArtboardSize(), this.initializeAudio(), this.loaded = !0, this.eventManager.fire({
												type: V.Load,
												data: (mt = this.src) !== null && mt !== void 0 ? mt : "buffer"
											}), this.animator.advanceIfPaused(), this.readyForPlaying = !0, this.taskQueue.process(), this.drawFrame(), [2, !0];
										case 3:
											return St = Tt.sent(), Et = re(St), console.warn(Et), this.eventManager.fire({
												type: V.LoadError,
												data: Et
											}), [2, Promise.reject(Et)];
										case 4:
											return [2]
									}
								})
							})
						}, d.prototype.initArtboard = function(o, f, p, M, q) {
							if (this.file) {
								var et = o ? this.file.artboardByName(o) : this.file.defaultArtboard();
								if (!et) {
									var St = "Invalid artboard name or no default artboard";
									console.warn(St), this.eventManager.fire({
										type: V.LoadError,
										data: St
									});
									return
								}
								this.artboard = et, et.volume = this._volume * G.systemVolume, this.animator = new Z(this.runtime, this.artboard, this.eventManager);
								var Et;
								if (f.length > 0 || p.length > 0 ? (Et = f.concat(p), this.animator.initLinearAnimations(f, M), this.animator.initStateMachines(p, M)) : Et = [this.animator.atLeastOne(M, !1)], this.taskQueue.add({
										event: {
											type: M ? V.Play : V.Pause,
											data: Et
										}
									}), q) {
									var mt = this.file.defaultArtboardViewModel(et);
									if (mt !== null) {
										var Tt = mt.defaultInstance();
										if (Tt !== null) {
											var Se = new Zt(Tt, null);
											(0, Y.createFinalization)(Se, Se.runtimeInstance), this.bindViewModelInstance(Se)
										}
									}
								}
							}
						}, d.prototype.drawFrame = function() {
							var o, f;
							!((o = document?.timeline) === null || o === void 0) && o.currentTime ? this.loaded && this.artboard && !this.frameRequestId && (this._boundDraw(document.timeline.currentTime), (f = this.runtime) === null || f === void 0 || f.resolveAnimationFrame()) : this.startRendering()
						}, d.prototype.draw = function(o, f) {
							var p;
							this.frameRequestId = null;
							var M = performance.now();
							this.lastRenderTime || (this.lastRenderTime = o), this.renderSecondTimer += o - this.lastRenderTime, this.renderSecondTimer > 5e3 && (this.renderSecondTimer = 0, f?.());
							var q = (o - this.lastRenderTime) / 1e3;
							this.lastRenderTime = o;
							for (var et = this.animator.animations.filter(function(sa) {
									return sa.playing || sa.needsScrub
								}).sort(function(sa) {
									return sa.needsScrub ? -1 : 1
								}), St = 0, Et = et; St < Et.length; St++) {
								var mt = Et[St];
								mt.advance(q), mt.instance.didLoop && (mt.loopCount += 1), mt.apply(1)
							}
							for (var Tt = this.animator.stateMachines.filter(function(sa) {
									return sa.playing
								}), Se = 0, en = Tt; Se < en.length; Se++) {
								var Ne = en[Se],
									bn = Ne.reportedEventCount();
								if (bn)
									for (var cn = 0; cn < bn; cn++) {
										var nn = Ne.reportedEventAt(cn);
										if (nn)
											if (nn.type === Ut.OpenUrl) {
												if (this.eventManager.fire({
														type: V.RiveEvent,
														data: nn
													}), this.automaticallyHandleEvents) {
													var Ze = document.createElement("a"),
														fn = nn,
														zn = fn.url,
														fa = fn.target,
														Vt = (0, Y.sanitizeUrl)(zn);
													zn && Ze.setAttribute("href", Vt), fa && Ze.setAttribute("target", fa), Vt && Vt !== Y.BLANK_URL && Ze.click()
												}
											} else this.eventManager.fire({
												type: V.RiveEvent,
												data: nn
											})
									}
								Ne.advanceAndApply(q)
							}
							this.animator.stateMachines.length == 0 && this.artboard.advance(q);
							var Dn = this.renderer;
							Dn.clear(), Dn.save(), this.alignRenderer(), this._hasZeroSize || this.artboard.draw(Dn), Dn.restore(), Dn.flush(), this.animator.handleLooping(), this.animator.handleStateChanges(), this.animator.handleAdvancing(q), this.frameCount++;
							var Jt = performance.now();
							for (this.frameTimes.push(Jt), this.durations.push(Jt - M); this.frameTimes[0] <= Jt - 1e3;) this.frameTimes.shift(), this.durations.shift();
							(p = this._viewModelInstance) === null || p === void 0 || p.handleCallbacks(), this.animator.isPlaying ? this.startRendering() : this.animator.isPaused ? this.lastRenderTime = 0 : this.animator.isStopped && (this.lastRenderTime = 0)
						}, d.prototype.alignRenderer = function() {
							var o = this,
								f = o.renderer,
								p = o.runtime,
								M = o._layout,
								q = o.artboard;
							f.align(M.runtimeFit(p), M.runtimeAlignment(p), {
								minX: M.minX,
								minY: M.minY,
								maxX: M.maxX,
								maxY: M.maxY
							}, q.bounds, this._devicePixelRatioUsed * M.layoutScaleFactor)
						}, Object.defineProperty(d.prototype, "fps", {
							get: function() {
								return this.durations.length
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "frameTime", {
							get: function() {
								return this.durations.length === 0 ? 0 : (this.durations.reduce(function(o, f) {
									return o + f
								}, 0) / this.durations.length).toFixed(4)
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.cleanup = function() {
							var o, f;
							this.destroyed = !0, this.stopRendering(), this.cleanupInstances(), this._observed !== null && k.remove(this._observed), this.removeRiveListeners(), this.file && ((o = this.riveFile) === null || o === void 0 || o.cleanup(), this.file = null), this.riveFile = null, this.deleteRiveRenderer(), this._audioEventListener !== null && (G.remove(this._audioEventListener), this._audioEventListener = null), (f = this._viewModelInstance) === null || f === void 0 || f.cleanup(), this._viewModelInstance = null, this._dataEnums = null
						}, d.prototype.deleteRiveRenderer = function() {
							var o;
							(o = this.renderer) === null || o === void 0 || o.delete(), this.renderer = null
						}, d.prototype.cleanupInstances = function() {
							this.eventCleanup !== null && this.eventCleanup(), this.stop(), this.artboard && (this.artboard.delete(), this.artboard = null)
						}, d.prototype.retrieveTextRun = function(o) {
							var f;
							if (!o) {
								console.warn("No text run name provided");
								return
							}
							if (!this.artboard) {
								console.warn("Tried to access text run, but the Artboard is null");
								return
							}
							var p = this.artboard.textRun(o);
							if (!p) {
								console.warn("Could not access a text run with name '".concat(o, "' in the '").concat((f = this.artboard) === null || f === void 0 ? void 0 : f.name, "' Artboard. Note that you must rename a text run node in the Rive editor to make it queryable at runtime."));
								return
							}
							return p
						}, d.prototype.getTextRunValue = function(o) {
							var f = this.retrieveTextRun(o);
							return f ? f.text : void 0
						}, d.prototype.setTextRunValue = function(o, f) {
							var p = this.retrieveTextRun(o);
							p && (p.text = f)
						}, d.prototype.play = function(o, f) {
							var p = this;
							if (o = Qe(o), !this.readyForPlaying) {
								this.taskQueue.add({
									action: function() {
										return p.play(o, f)
									}
								});
								return
							}
							this.animator.play(o), this.eventCleanup && this.eventCleanup(), this.setupRiveListeners(), this.startRendering()
						}, d.prototype.pause = function(o) {
							var f = this;
							if (o = Qe(o), !this.readyForPlaying) {
								this.taskQueue.add({
									action: function() {
										return f.pause(o)
									}
								});
								return
							}
							this.eventCleanup && this.eventCleanup(), this.animator.pause(o)
						}, d.prototype.scrub = function(o, f) {
							var p = this;
							if (o = Qe(o), !this.readyForPlaying) {
								this.taskQueue.add({
									action: function() {
										return p.scrub(o, f)
									}
								});
								return
							}
							this.animator.scrub(o, f || 0), this.drawFrame()
						}, d.prototype.stop = function(o) {
							var f = this;
							if (o = Qe(o), !this.readyForPlaying) {
								this.taskQueue.add({
									action: function() {
										return f.stop(o)
									}
								});
								return
							}
							this.animator && this.animator.stop(o), this.eventCleanup && this.eventCleanup()
						}, d.prototype.reset = function(o) {
							var f, p, M = o?.artboard,
								q = Qe(o?.animations),
								et = Qe(o?.stateMachines),
								St = (f = o?.autoplay) !== null && f !== void 0 ? f : !1,
								Et = (p = o?.autoBind) !== null && p !== void 0 ? p : !1;
							this.cleanupInstances(), this.initArtboard(M, q, et, St, Et), this.taskQueue.process()
						}, d.prototype.load = function(o) {
							this.file = null, this.stop(), this.init(o)
						}, Object.defineProperty(d.prototype, "layout", {
							get: function() {
								return this._layout
							},
							set: function(o) {
								this._layout = o, (!o.maxX || !o.maxY) && this.resizeToCanvas(), this.loaded && !this.animator.isPlaying && this.drawFrame()
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.resizeToCanvas = function() {
							this._layout = this.layout.copyWith({
								minX: 0,
								minY: 0,
								maxX: this.canvas.width,
								maxY: this.canvas.height
							})
						}, d.prototype.resizeDrawingSurfaceToCanvas = function(o) {
							if (this.canvas instanceof HTMLCanvasElement && window) {
								var f = this.canvas.getBoundingClientRect(),
									p = f.width,
									M = f.height,
									q = o || window.devicePixelRatio || 1;
								if (this.devicePixelRatioUsed = q, this.canvas.width = q * p, this.canvas.height = q * M, this.resizeToCanvas(), this.drawFrame(), this.layout.fit === xt.Layout) {
									var et = this._layout.layoutScaleFactor;
									this.artboard.width = p / et, this.artboard.height = M / et
								}
							}
						}, Object.defineProperty(d.prototype, "source", {
							get: function() {
								return this.src
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "activeArtboard", {
							get: function() {
								return this.artboard ? this.artboard.name : ""
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "animationNames", {
							get: function() {
								if (!this.loaded || !this.artboard) return [];
								for (var o = [], f = 0; f < this.artboard.animationCount(); f++) o.push(this.artboard.animationByIndex(f).name);
								return o
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "stateMachineNames", {
							get: function() {
								if (!this.loaded || !this.artboard) return [];
								for (var o = [], f = 0; f < this.artboard.stateMachineCount(); f++) o.push(this.artboard.stateMachineByIndex(f).name);
								return o
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.stateMachineInputs = function(o) {
							if (this.loaded) {
								var f = this.animator.stateMachines.find(function(p) {
									return p.name === o
								});
								return f?.inputs
							}
						}, d.prototype.retrieveInputAtPath = function(o, f) {
							if (!o) {
								console.warn("No input name provided for path '".concat(f, "'"));
								return
							}
							if (!this.artboard) {
								console.warn("Tried to access input: '".concat(o, "', at path: '").concat(f, "', but the Artboard is null"));
								return
							}
							var p = this.artboard.inputByPath(o, f);
							if (!p) {
								console.warn("Could not access an input with name: '".concat(o, "', at path:'").concat(f, "'"));
								return
							}
							return p
						}, d.prototype.setBooleanStateAtPath = function(o, f, p) {
							var M = this.retrieveInputAtPath(o, p);
							M && (M.type === It.Boolean ? M.asBool().value = f : console.warn("Input with name: '".concat(o, "', at path:'").concat(p, "' is not a boolean")))
						}, d.prototype.setNumberStateAtPath = function(o, f, p) {
							var M = this.retrieveInputAtPath(o, p);
							M && (M.type === It.Number ? M.asNumber().value = f : console.warn("Input with name: '".concat(o, "', at path:'").concat(p, "' is not a number")))
						}, d.prototype.fireStateAtPath = function(o, f) {
							var p = this.retrieveInputAtPath(o, f);
							p && (p.type === It.Trigger ? p.asTrigger().fire() : console.warn("Input with name: '".concat(o, "', at path:'").concat(f, "' is not a trigger")))
						}, d.prototype.retrieveTextAtPath = function(o, f) {
							if (!o) {
								console.warn("No text name provided for path '".concat(f, "'"));
								return
							}
							if (!f) {
								console.warn("No path provided for text '".concat(o, "'"));
								return
							}
							if (!this.artboard) {
								console.warn("Tried to access text: '".concat(o, "', at path: '").concat(f, "', but the Artboard is null"));
								return
							}
							var p = this.artboard.textByPath(o, f);
							if (!p) {
								console.warn("Could not access text with name: '".concat(o, "', at path:'").concat(f, "'"));
								return
							}
							return p
						}, d.prototype.getTextRunValueAtPath = function(o, f) {
							var p = this.retrieveTextAtPath(o, f);
							if (!p) {
								console.warn("Could not get text with name: '".concat(o, "', at path:'").concat(f, "'"));
								return
							}
							return p.text
						}, d.prototype.setTextRunValueAtPath = function(o, f, p) {
							var M = this.retrieveTextAtPath(o, p);
							if (!M) {
								console.warn("Could not set text with name: '".concat(o, "', at path:'").concat(p, "'"));
								return
							}
							M.text = f
						}, Object.defineProperty(d.prototype, "playingStateMachineNames", {
							get: function() {
								return this.loaded ? this.animator.stateMachines.filter(function(o) {
									return o.playing
								}).map(function(o) {
									return o.name
								}) : []
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "playingAnimationNames", {
							get: function() {
								return this.loaded ? this.animator.animations.filter(function(o) {
									return o.playing
								}).map(function(o) {
									return o.name
								}) : []
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "pausedAnimationNames", {
							get: function() {
								return this.loaded ? this.animator.animations.filter(function(o) {
									return !o.playing
								}).map(function(o) {
									return o.name
								}) : []
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "pausedStateMachineNames", {
							get: function() {
								return this.loaded ? this.animator.stateMachines.filter(function(o) {
									return !o.playing
								}).map(function(o) {
									return o.name
								}) : []
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "isPlaying", {
							get: function() {
								return this.animator.isPlaying
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "isPaused", {
							get: function() {
								return this.animator.isPaused
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "isStopped", {
							get: function() {
								return this.animator.isStopped
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "bounds", {
							get: function() {
								return this.artboard ? this.artboard.bounds : void 0
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.on = function(o, f) {
							this.eventManager.add({
								type: o,
								callback: f
							})
						}, d.prototype.off = function(o, f) {
							this.eventManager.remove({
								type: o,
								callback: f
							})
						}, d.prototype.unsubscribe = function(o, f) {
							console.warn("This function is deprecated: please use `off()` instead."), this.off(o, f)
						}, d.prototype.removeAllRiveEventListeners = function(o) {
							this.eventManager.removeAll(o)
						}, d.prototype.unsubscribeAll = function(o) {
							console.warn("This function is deprecated: please use `removeAllRiveEventListeners()` instead."), this.removeAllRiveEventListeners(o)
						}, d.prototype.stopRendering = function() {
							this.loaded && this.frameRequestId && (this.runtime.cancelAnimationFrame ? this.runtime.cancelAnimationFrame(this.frameRequestId) : cancelAnimationFrame(this.frameRequestId), this.frameRequestId = null)
						}, d.prototype.startRendering = function() {
							this.loaded && this.artboard && !this.frameRequestId && (this.runtime.requestAnimationFrame ? this.frameRequestId = this.runtime.requestAnimationFrame(this._boundDraw) : this.frameRequestId = requestAnimationFrame(this._boundDraw))
						}, d.prototype.enableFPSCounter = function(o) {
							this.runtime.enableFPSCounter(o)
						}, d.prototype.disableFPSCounter = function() {
							this.runtime.disableFPSCounter()
						}, Object.defineProperty(d.prototype, "contents", {
							get: function() {
								if (this.loaded) {
									for (var o = {
											artboards: []
										}, f = 0; f < this.file.artboardCount(); f++) {
										for (var p = this.file.artboardByIndex(f), M = {
												name: p.name,
												animations: [],
												stateMachines: []
											}, q = 0; q < p.animationCount(); q++) {
											var et = p.animationByIndex(q);
											M.animations.push(et.name)
										}
										for (var St = 0; St < p.stateMachineCount(); St++) {
											for (var Et = p.stateMachineByIndex(St), mt = Et.name, Tt = new this.runtime.StateMachineInstance(Et, p), Se = [], en = 0; en < Tt.inputCount(); en++) {
												var Ne = Tt.input(en);
												Se.push({
													name: Ne.name,
													type: Ne.type
												})
											}
											M.stateMachines.push({
												name: mt,
												inputs: Se
											})
										}
										o.artboards.push(M)
									}
									return o
								}
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "volume", {
							get: function() {
								return this.artboard && this.artboard.volume !== this._volume && (this._volume = this.artboard.volume), this._volume
							},
							set: function(o) {
								this._volume = o, this.artboard && (this.artboard.volume = o * G.systemVolume)
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "artboardWidth", {
							get: function() {
								var o;
								return this.artboard ? this.artboard.width : (o = this._artboardWidth) !== null && o !== void 0 ? o : 0
							},
							set: function(o) {
								this._artboardWidth = o, this.artboard && (this.artboard.width = o)
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "artboardHeight", {
							get: function() {
								var o;
								return this.artboard ? this.artboard.height : (o = this._artboardHeight) !== null && o !== void 0 ? o : 0
							},
							set: function(o) {
								this._artboardHeight = o, this.artboard && (this.artboard.height = o)
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.resetArtboardSize = function() {
							this.artboard ? (this.artboard.resetArtboardSize(), this._artboardWidth = this.artboard.width, this._artboardHeight = this.artboard.height) : (this._artboardWidth = void 0, this._artboardHeight = void 0)
						}, Object.defineProperty(d.prototype, "devicePixelRatioUsed", {
							get: function() {
								return this._devicePixelRatioUsed
							},
							set: function(o) {
								this._devicePixelRatioUsed = o
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.bindViewModelInstance = function(o) {
							var f;
							this.artboard && !this.destroyed && o && o.runtimeInstance && (o.internalIncrementReferenceCount(), (f = this._viewModelInstance) === null || f === void 0 || f.cleanup(), this._viewModelInstance = o, this.animator.stateMachines.length > 0 ? this.animator.stateMachines.forEach(function(p) {
								return p.bindViewModelInstance(o)
							}) : this.artboard.bindViewModelInstance(o.runtimeInstance))
						}, Object.defineProperty(d.prototype, "viewModelInstance", {
							get: function() {
								return this._viewModelInstance
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.viewModelByIndex = function(o) {
							var f = this.file.viewModelByIndex(o);
							return f !== null ? new gt(f) : null
						}, d.prototype.viewModelByName = function(o) {
							var f = this.file.viewModelByName(o);
							return f !== null ? new gt(f) : null
						}, d.prototype.enums = function() {
							if (this._dataEnums === null) {
								var o = this.file.enums();
								this._dataEnums = o.map(function(f) {
									return new zt(f)
								})
							}
							return this._dataEnums
						}, d.prototype.defaultViewModel = function() {
							if (this.artboard) {
								var o = this.file.defaultArtboardViewModel(this.artboard);
								if (o) return new gt(o)
							}
							return null
						}, d.prototype.getArtboard = function(o) {
							var f, p;
							return (p = (f = this.riveFile) === null || f === void 0 ? void 0 : f.getArtboard(o)) !== null && p !== void 0 ? p : null
						}, d.prototype.getBindableArtboard = function(o) {
							var f, p;
							return (p = (f = this.riveFile) === null || f === void 0 ? void 0 : f.getBindableArtboard(o)) !== null && p !== void 0 ? p : null
						}, d.prototype.getDefaultBindableArtboard = function() {
							var o, f;
							return (f = (o = this.riveFile) === null || o === void 0 ? void 0 : o.getDefaultBindableArtboard()) !== null && f !== void 0 ? f : null
						}, d.missingErrorMessage = "Rive source file or data buffer required", d.cleanupErrorMessage = "Attempt to use file after calling cleanup.", d
					})(),
					gt = (function() {
						function d(o) {
							this._viewModel = o
						}
						return Object.defineProperty(d.prototype, "instanceCount", {
							get: function() {
								return this._viewModel.instanceCount
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "name", {
							get: function() {
								return this._viewModel.name
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.instanceByIndex = function(o) {
							var f = this._viewModel.instanceByIndex(o);
							if (f !== null) {
								var p = new Zt(f, null);
								return (0, Y.createFinalization)(p, f), p
							}
							return null
						}, d.prototype.instanceByName = function(o) {
							var f = this._viewModel.instanceByName(o);
							if (f !== null) {
								var p = new Zt(f, null);
								return (0, Y.createFinalization)(p, f), p
							}
							return null
						}, d.prototype.defaultInstance = function() {
							var o = this._viewModel.defaultInstance();
							if (o !== null) {
								var f = new Zt(o, null);
								return (0, Y.createFinalization)(f, o), f
							}
							return null
						}, d.prototype.instance = function() {
							var o = this._viewModel.instance();
							if (o !== null) {
								var f = new Zt(o, null);
								return (0, Y.createFinalization)(f, o), f
							}
							return null
						}, Object.defineProperty(d.prototype, "properties", {
							get: function() {
								return this._viewModel.getProperties()
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "instanceNames", {
							get: function() {
								return this._viewModel.getInstanceNames()
							},
							enumerable: !1,
							configurable: !0
						}), d
					})(),
					zt = (function() {
						function d(o) {
							this._dataEnum = o
						}
						return Object.defineProperty(d.prototype, "name", {
							get: function() {
								return this._dataEnum.name
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "values", {
							get: function() {
								return this._dataEnum.values
							},
							enumerable: !1,
							configurable: !0
						}), d
					})(),
					Bt;
				(function(d) {
					d.Number = "number", d.String = "string", d.Boolean = "boolean", d.Color = "color", d.Trigger = "trigger", d.Enum = "enum", d.List = "list", d.Image = "image", d.Artboard = "artboard"
				})(Bt || (Bt = {}));
				var Zt = (function() {
						function d(o, f) {
							this._parents = [], this._children = [], this._viewModelInstances = new Map, this._propertiesWithCallbacks = [], this._referenceCount = 0, this.selfUnref = !1, this._runtimeInstance = o, f !== null && this._parents.push(f)
						}
						return Object.defineProperty(d.prototype, "runtimeInstance", {
							get: function() {
								return this._runtimeInstance
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(d.prototype, "nativeInstance", {
							get: function() {
								return this._runtimeInstance
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.handleCallbacks = function() {
							this._propertiesWithCallbacks.length !== 0 && (this._propertiesWithCallbacks.forEach(function(o) {
								o.handleCallbacks()
							}), this._propertiesWithCallbacks.forEach(function(o) {
								o.clearChanges()
							})), this._children.forEach(function(o) {
								return o.handleCallbacks()
							})
						}, d.prototype.addParent = function(o) {
							this._parents.includes(o) || (this._parents.push(o), (this._propertiesWithCallbacks.length > 0 || this._children.length > 0) && o.addToViewModelCallbacks(this))
						}, d.prototype.removeParent = function(o) {
							var f = this._parents.indexOf(o);
							if (f !== -1) {
								var p = this._parents[f];
								p.removeFromViewModelCallbacks(this), this._parents.splice(f, 1)
							}
						}, d.prototype.addToPropertyCallbacks = function(o) {
							var f = this;
							this._propertiesWithCallbacks.includes(o) || (this._propertiesWithCallbacks.push(o), this._propertiesWithCallbacks.length > 0 && this._parents.forEach(function(p) {
								p.addToViewModelCallbacks(f)
							}))
						}, d.prototype.removeFromPropertyCallbacks = function(o) {
							var f = this;
							this._propertiesWithCallbacks.includes(o) && (this._propertiesWithCallbacks = this._propertiesWithCallbacks.filter(function(p) {
								return p !== o
							}), this._children.length === 0 && this._propertiesWithCallbacks.length === 0 && this._parents.forEach(function(p) {
								p.removeFromViewModelCallbacks(f)
							}))
						}, d.prototype.addToViewModelCallbacks = function(o) {
							var f = this;
							this._children.includes(o) || (this._children.push(o), this._parents.forEach(function(p) {
								p.addToViewModelCallbacks(f)
							}))
						}, d.prototype.removeFromViewModelCallbacks = function(o) {
							var f = this;
							this._children.includes(o) && (this._children = this._children.filter(function(p) {
								return p !== o
							}), this._children.length === 0 && this._propertiesWithCallbacks.length === 0 && this._parents.forEach(function(p) {
								p.removeFromViewModelCallbacks(f)
							}))
						}, d.prototype.clearCallbacks = function() {
							this._propertiesWithCallbacks.forEach(function(o) {
								o.clearCallbacks()
							})
						}, d.prototype.propertyFromPath = function(o, f) {
							var p = o.split("/");
							return this.propertyFromPathSegments(p, 0, f)
						}, d.prototype.viewModelFromPathSegments = function(o, f) {
							var p = this.internalViewModelInstance(o[f]);
							return p !== null ? f == o.length - 1 ? p : p.viewModelFromPathSegments(o, f++) : null
						}, d.prototype.propertyFromPathSegments = function(o, f, p) {
							var M, q, et, St, Et, mt, Tt, Se, en, Ne, bn, cn, nn, Ze, fn, zn, fa, Vt;
							if (f < o.length - 1) {
								var Dn = this.internalViewModelInstance(o[f]);
								return Dn !== null ? Dn.propertyFromPathSegments(o, f + 1, p) : null
							}
							var Jt = null;
							switch (p) {
								case Bt.Number:
									if (Jt = (q = (M = this._runtimeInstance) === null || M === void 0 ? void 0 : M.number(o[f])) !== null && q !== void 0 ? q : null, Jt !== null) return new Rt(Jt, this);
									break;
								case Bt.String:
									if (Jt = (St = (et = this._runtimeInstance) === null || et === void 0 ? void 0 : et.string(o[f])) !== null && St !== void 0 ? St : null, Jt !== null) return new Le(Jt, this);
									break;
								case Bt.Boolean:
									if (Jt = (mt = (Et = this._runtimeInstance) === null || Et === void 0 ? void 0 : Et.boolean(o[f])) !== null && mt !== void 0 ? mt : null, Jt !== null) return new ee(Jt, this);
									break;
								case Bt.Color:
									if (Jt = (Se = (Tt = this._runtimeInstance) === null || Tt === void 0 ? void 0 : Tt.color(o[f])) !== null && Se !== void 0 ? Se : null, Jt !== null) return new Kn(Jt, this);
									break;
								case Bt.Trigger:
									if (Jt = (Ne = (en = this._runtimeInstance) === null || en === void 0 ? void 0 : en.trigger(o[f])) !== null && Ne !== void 0 ? Ne : null, Jt !== null) return new _e(Jt, this);
									break;
								case Bt.Enum:
									if (Jt = (cn = (bn = this._runtimeInstance) === null || bn === void 0 ? void 0 : bn.enum(o[f])) !== null && cn !== void 0 ? cn : null, Jt !== null) return new ve(Jt, this);
									break;
								case Bt.List:
									if (Jt = (Ze = (nn = this._runtimeInstance) === null || nn === void 0 ? void 0 : nn.list(o[f])) !== null && Ze !== void 0 ? Ze : null, Jt !== null) return new on(Jt, this);
									break;
								case Bt.Image:
									if (Jt = (zn = (fn = this._runtimeInstance) === null || fn === void 0 ? void 0 : fn.image(o[f])) !== null && zn !== void 0 ? zn : null, Jt !== null) return new Oe(Jt, this);
									break;
								case Bt.Artboard:
									if (Jt = (Vt = (fa = this._runtimeInstance) === null || fa === void 0 ? void 0 : fa.artboard(o[f])) !== null && Vt !== void 0 ? Vt : null, Jt !== null) return new qt(Jt, this);
									break
							}
							return null
						}, d.prototype.internalViewModelInstance = function(o) {
							var f;
							if (this._viewModelInstances.has(o)) return this._viewModelInstances.get(o);
							var p = (f = this._runtimeInstance) === null || f === void 0 ? void 0 : f.viewModel(o);
							if (p !== null) {
								var M = new d(p, this);
								return (0, Y.createFinalization)(M, p), M.internalIncrementReferenceCount(), this._viewModelInstances.set(o, M), M
							}
							return null
						}, d.prototype.number = function(o) {
							var f = this.propertyFromPath(o, Bt.Number);
							return f
						}, d.prototype.string = function(o) {
							var f = this.propertyFromPath(o, Bt.String);
							return f
						}, d.prototype.boolean = function(o) {
							var f = this.propertyFromPath(o, Bt.Boolean);
							return f
						}, d.prototype.color = function(o) {
							var f = this.propertyFromPath(o, Bt.Color);
							return f
						}, d.prototype.trigger = function(o) {
							var f = this.propertyFromPath(o, Bt.Trigger);
							return f
						}, d.prototype.enum = function(o) {
							var f = this.propertyFromPath(o, Bt.Enum);
							return f
						}, d.prototype.list = function(o) {
							var f = this.propertyFromPath(o, Bt.List);
							return f
						}, d.prototype.image = function(o) {
							var f = this.propertyFromPath(o, Bt.Image);
							return f
						}, d.prototype.artboard = function(o) {
							var f = this.propertyFromPath(o, Bt.Artboard);
							return f
						}, d.prototype.viewModel = function(o) {
							var f = o.split("/"),
								p = f.length > 1 ? this.viewModelFromPathSegments(f.slice(0, f.length - 1), 0) : this;
							return p != null ? p.internalViewModelInstance(f[f.length - 1]) : null
						}, d.prototype.internalReplaceViewModel = function(o, f) {
							var p;
							if (f.runtimeInstance !== null) {
								var M = ((p = this._runtimeInstance) === null || p === void 0 ? void 0 : p.replaceViewModel(o, f.runtimeInstance)) || !1;
								if (M) {
									f.internalIncrementReferenceCount();
									var q = this.internalViewModelInstance(o);
									q !== null && (q.removeParent(this), this._children.includes(q) && (this._children = this._children.filter(function(et) {
										return et !== q
									})), q.cleanup()), this._viewModelInstances.set(o, f), f.addParent(this)
								}
								return M
							}
							return !1
						}, d.prototype.replaceViewModel = function(o, f) {
							var p, M = o.split("/"),
								q = M.length > 1 ? this.viewModelFromPathSegments(M.slice(0, M.length - 1), 0) : this;
							return (p = q?.internalReplaceViewModel(M[M.length - 1], f)) !== null && p !== void 0 ? p : !1
						}, d.prototype.incrementReferenceCount = function() {
							var o;
							this._referenceCount++, (o = this._runtimeInstance) === null || o === void 0 || o.incrementReferenceCount()
						}, d.prototype.decrementReferenceCount = function() {
							var o;
							this._referenceCount--, (o = this._runtimeInstance) === null || o === void 0 || o.decrementReferenceCount()
						}, Object.defineProperty(d.prototype, "properties", {
							get: function() {
								var o;
								return ((o = this._runtimeInstance) === null || o === void 0 ? void 0 : o.getProperties().map(function(f) {
									return it({}, f)
								})) || []
							},
							enumerable: !1,
							configurable: !0
						}), d.prototype.internalIncrementReferenceCount = function() {
							this._referenceCount++
						}, d.prototype.cleanup = function() {
							var o = this,
								f;
							if (this._referenceCount--, this._referenceCount <= 0) {
								this.selfUnref && ((f = this._runtimeInstance) === null || f === void 0 || f.unref()), this._runtimeInstance = null, this.clearCallbacks(), this._propertiesWithCallbacks = [], this._viewModelInstances.forEach(function(q) {
									q.cleanup()
								}), this._viewModelInstances.clear();
								var p = S([], this._children, !0);
								this._children.length = 0;
								var M = S([], this._parents, !0);
								this._parents.length = 0, p.forEach(function(q) {
									q.removeParent(o)
								}), M.forEach(function(q) {
									q.removeFromViewModelCallbacks(o)
								})
							}
						}, d
					})(),
					te = (function() {
						function d(o, f) {
							this.callbacks = [], this._viewModelInstanceValue = o, this._parentViewModel = f
						}
						return d.prototype.on = function(o) {
							this.callbacks.length === 0 && this._viewModelInstanceValue.clearChanges(), this.callbacks.includes(o) || (this.callbacks.push(o), this._parentViewModel.addToPropertyCallbacks(this))
						}, d.prototype.off = function(o) {
							o ? this.callbacks = this.callbacks.filter(function(f) {
								return f !== o
							}) : this.callbacks.length = 0, this.callbacks.length === 0 && this._parentViewModel.removeFromPropertyCallbacks(this)
						}, d.prototype.internalHandleCallback = function(o) {}, d.prototype.handleCallbacks = function() {
							var o = this;
							this._viewModelInstanceValue.hasChanged && this.callbacks.forEach(function(f) {
								o.internalHandleCallback(f)
							})
						}, d.prototype.clearChanges = function() {
							this._viewModelInstanceValue.clearChanges()
						}, d.prototype.clearCallbacks = function() {
							this.callbacks.length = 0
						}, Object.defineProperty(d.prototype, "name", {
							get: function() {
								return this._viewModelInstanceValue.name
							},
							enumerable: !1,
							configurable: !0
						}), d
					})(),
					Le = (function(d) {
						vt(o, d);

						function o(f, p) {
							return d.call(this, f, p) || this
						}
						return Object.defineProperty(o.prototype, "value", {
							get: function() {
								return this._viewModelInstanceValue.value
							},
							set: function(f) {
								this._viewModelInstanceValue.value = f
							},
							enumerable: !1,
							configurable: !0
						}), o.prototype.internalHandleCallback = function(f) {
							f(this.value)
						}, o
					})(te),
					Rt = (function(d) {
						vt(o, d);

						function o(f, p) {
							return d.call(this, f, p) || this
						}
						return Object.defineProperty(o.prototype, "value", {
							get: function() {
								return this._viewModelInstanceValue.value
							},
							set: function(f) {
								this._viewModelInstanceValue.value = f
							},
							enumerable: !1,
							configurable: !0
						}), o.prototype.internalHandleCallback = function(f) {
							f(this.value)
						}, o
					})(te),
					ee = (function(d) {
						vt(o, d);

						function o(f, p) {
							return d.call(this, f, p) || this
						}
						return Object.defineProperty(o.prototype, "value", {
							get: function() {
								return this._viewModelInstanceValue.value
							},
							set: function(f) {
								this._viewModelInstanceValue.value = f
							},
							enumerable: !1,
							configurable: !0
						}), o.prototype.internalHandleCallback = function(f) {
							f(this.value)
						}, o
					})(te),
					_e = (function(d) {
						vt(o, d);

						function o(f, p) {
							return d.call(this, f, p) || this
						}
						return o.prototype.trigger = function() {
							return this._viewModelInstanceValue.trigger()
						}, o.prototype.internalHandleCallback = function(f) {
							f()
						}, o
					})(te),
					ve = (function(d) {
						vt(o, d);

						function o(f, p) {
							return d.call(this, f, p) || this
						}
						return Object.defineProperty(o.prototype, "value", {
							get: function() {
								return this._viewModelInstanceValue.value
							},
							set: function(f) {
								this._viewModelInstanceValue.value = f
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(o.prototype, "valueIndex", {
							get: function() {
								return this._viewModelInstanceValue.valueIndex
							},
							set: function(f) {
								this._viewModelInstanceValue.valueIndex = f
							},
							enumerable: !1,
							configurable: !0
						}), Object.defineProperty(o.prototype, "values", {
							get: function() {
								return this._viewModelInstanceValue.values
							},
							enumerable: !1,
							configurable: !0
						}), o.prototype.internalHandleCallback = function(f) {
							f(this.value)
						}, o
					})(te),
					on = (function(d) {
						vt(o, d);

						function o(f, p) {
							return d.call(this, f, p) || this
						}
						return Object.defineProperty(o.prototype, "length", {
							get: function() {
								return this._viewModelInstanceValue.size
							},
							enumerable: !1,
							configurable: !0
						}), o.prototype.addInstance = function(f) {
							f.runtimeInstance != null && (this._viewModelInstanceValue.addInstance(f.runtimeInstance), f.addParent(this._parentViewModel))
						}, o.prototype.addInstanceAt = function(f, p) {
							return f.runtimeInstance != null && this._viewModelInstanceValue.addInstanceAt(f.runtimeInstance, p) ? (f.addParent(this._parentViewModel), !0) : !1
						}, o.prototype.removeInstance = function(f) {
							f.runtimeInstance != null && (this._viewModelInstanceValue.removeInstance(f.runtimeInstance), f.removeParent(this._parentViewModel))
						}, o.prototype.removeInstanceAt = function(f) {
							this._viewModelInstanceValue.removeInstanceAt(f)
						}, o.prototype.instanceAt = function(f) {
							var p = this._viewModelInstanceValue.instanceAt(f);
							if (p != null) {
								var M = new Zt(p, this._parentViewModel);
								return (0, Y.createFinalization)(M, p), M
							}
							return null
						}, o.prototype.swap = function(f, p) {
							this._viewModelInstanceValue.swap(f, p)
						}, o.prototype.internalHandleCallback = function(f) {
							f()
						}, o
					})(te),
					Kn = (function(d) {
						vt(o, d);

						function o(f, p) {
							return d.call(this, f, p) || this
						}
						return Object.defineProperty(o.prototype, "value", {
							get: function() {
								return this._viewModelInstanceValue.value
							},
							set: function(f) {
								this._viewModelInstanceValue.value = f
							},
							enumerable: !1,
							configurable: !0
						}), o.prototype.rgb = function(f, p, M) {
							this._viewModelInstanceValue.rgb(f, p, M)
						}, o.prototype.rgba = function(f, p, M, q) {
							this._viewModelInstanceValue.argb(q, f, p, M)
						}, o.prototype.argb = function(f, p, M, q) {
							this._viewModelInstanceValue.argb(f, p, M, q)
						}, o.prototype.alpha = function(f) {
							this._viewModelInstanceValue.alpha(f)
						}, o.prototype.opacity = function(f) {
							this._viewModelInstanceValue.alpha(Math.round(Math.max(0, Math.min(1, f)) * 255))
						}, o.prototype.internalHandleCallback = function(f) {
							f(this.value)
						}, o
					})(te),
					Oe = (function(d) {
						vt(o, d);

						function o(f, p) {
							return d.call(this, f, p) || this
						}
						return Object.defineProperty(o.prototype, "value", {
							set: function(f) {
								var p;
								this._viewModelInstanceValue.value((p = f?.nativeImage) !== null && p !== void 0 ? p : null)
							},
							enumerable: !1,
							configurable: !0
						}), o.prototype.internalHandleCallback = function(f) {
							f()
						}, o
					})(te),
					qt = (function(d) {
						vt(o, d);

						function o(f, p) {
							return d.call(this, f, p) || this
						}
						return Object.defineProperty(o.prototype, "value", {
							set: function(f) {
								var p, M;
								f.isBindableArtboard ? M = f : M = f.file.internalBindableArtboardFromArtboard(f.nativeArtboard), this._viewModelInstanceValue.value((p = M?.nativeArtboard) !== null && p !== void 0 ? p : null)
							},
							enumerable: !1,
							configurable: !0
						}), o.prototype.internalHandleCallback = function(f) {
							f()
						}, o
					})(te),
					xn = function(d) {
						return ot(void 0, void 0, void 0, function() {
							var o, f, p;
							return yt(this, function(M) {
								switch (M.label) {
									case 0:
										return o = new Request(d), [4, fetch(o)];
									case 1:
										return f = M.sent(), [4, f.arrayBuffer()];
									case 2:
										return p = M.sent(), [2, p]
								}
							})
						})
					},
					Qe = function(d) {
						return typeof d == "string" ? [d] : d instanceof Array ? d : []
					},
					Ua = {
						EventManager: x,
						TaskQueueManager: _
					},
					gn = function(d) {
						return ot(void 0, void 0, void 0, function() {
							var o, f, p;
							return yt(this, function(M) {
								switch (M.label) {
									case 0:
										return o = new Promise(function(q) {
											return Dt.getInstance(function(et) {
												et.decodeAudio(d, q)
											})
										}), [4, o];
									case 1:
										return f = M.sent(), p = new Y.AudioWrapper(f), Y.finalizationRegistry.register(p, f), [2, p]
								}
							})
						})
					},
					Ae = function(d) {
						return ot(void 0, void 0, void 0, function() {
							var o, f, p;
							return yt(this, function(M) {
								switch (M.label) {
									case 0:
										return o = new Promise(function(q) {
											return Dt.getInstance(function(et) {
												et.decodeImage(d, q)
											})
										}), [4, o];
									case 1:
										return f = M.sent(), p = new Y.ImageWrapper(f), Y.finalizationRegistry.register(p, f), [2, p]
								}
							})
						})
					},
					tn = function(d) {
						return ot(void 0, void 0, void 0, function() {
							var o, f, p;
							return yt(this, function(M) {
								switch (M.label) {
									case 0:
										return o = new Promise(function(q) {
											return Dt.getInstance(function(et) {
												et.decodeFont(d, q)
											})
										}), [4, o];
									case 1:
										return f = M.sent(), p = new Y.FontWrapper(f), Y.finalizationRegistry.register(p, f), [2, p]
								}
							})
						})
					}
			})(), Ht
		})())
	})(ho)), ho.exports
}
var Bd;

function hm() {
	return Bd || (Bd = 1, (function(rt) {
		Object.defineProperty(rt, "__esModule", {
			value: !0
		});
		var I = vo(),
			Xt = sm();

		function B(E) {
			return E && typeof E == "object" && "default" in E ? E : {
				default: E
			}
		}
		var Mt = B(I),
			Ht = function() {
				return Ht = Object.assign || function(E) {
					for (var Z, V = 1, z = arguments.length; V < z; V++)
						for (var x in Z = arguments[V]) Object.prototype.hasOwnProperty.call(Z, x) && (E[x] = Z[x]);
					return E
				}, Ht.apply(this, arguments)
			};

		function Nt(E, Z) {
			var V = {};
			for (var z in E) Object.prototype.hasOwnProperty.call(E, z) && Z.indexOf(z) < 0 && (V[z] = E[z]);
			if (E != null && typeof Object.getOwnPropertySymbols == "function") {
				var x = 0;
				for (z = Object.getOwnPropertySymbols(E); x < z.length; x++) Z.indexOf(z[x]) < 0 && Object.prototype.propertyIsEnumerable.call(E, z[x]) && (V[z[x]] = E[z[x]])
			}
			return V
		}

		function Ct(E, Z, V, z) {
			return new(V || (V = Promise))(function(x, _) {
				function R(P) {
					try {
						G(z.next(P))
					} catch (y) {
						_(y)
					}
				}

				function K(P) {
					try {
						G(z.throw(P))
					} catch (y) {
						_(y)
					}
				}

				function G(P) {
					var y;
					P.done ? x(P.value) : (y = P.value, y instanceof V ? y : new V(function(L) {
						L(y)
					})).then(R, K)
				}
				G((z = z.apply(E, [])).next())
			})
		}

		function at(E, Z) {
			var V, z, x, _, R = {
				label: 0,
				sent: function() {
					if (1 & x[0]) throw x[1];
					return x[1]
				},
				trys: [],
				ops: []
			};
			return _ = {
				next: K(0),
				throw: K(1),
				return: K(2)
			}, typeof Symbol == "function" && (_[Symbol.iterator] = function() {
				return this
			}), _;

			function K(G) {
				return function(P) {
					return (function(y) {
						if (V) throw new TypeError("Generator is already executing.");
						for (; R;) try {
							if (V = 1, z && (x = 2 & y[0] ? z.return : y[0] ? z.throw || ((x = z.return) && x.call(z), 0) : z.next) && !(x = x.call(z, y[1])).done) return x;
							switch (z = 0, x && (y = [2 & y[0], x.value]), y[0]) {
								case 0:
								case 1:
									x = y;
									break;
								case 4:
									return R.label++, {
										value: y[1],
										done: !1
									};
								case 5:
									R.label++, z = y[1], y = [0];
									continue;
								case 7:
									y = R.ops.pop(), R.trys.pop();
									continue;
								default:
									if (x = R.trys, !((x = x.length > 0 && x[x.length - 1]) || y[0] !== 6 && y[0] !== 2)) {
										R = 0;
										continue
									}
									if (y[0] === 3 && (!x || y[1] > x[0] && y[1] < x[3])) {
										R.label = y[1];
										break
									}
									if (y[0] === 6 && R.label < x[1]) {
										R.label = x[1], x = y;
										break
									}
									if (x && R.label < x[2]) {
										R.label = x[2], R.ops.push(y);
										break
									}
									x[2] && R.ops.pop(), R.trys.pop();
									continue
							}
							y = Z.call(E, R)
						} catch (L) {
							y = [6, L], z = 0
						} finally {
							V = x = 0
						}
						if (5 & y[0]) throw y[1];
						return {
							value: y[0] ? y[1] : void 0,
							done: !0
						}
					})([G, P])
				}
			}
		}

		function Y(E) {
			var Z = E || vt(),
				V = I.useState(Z),
				z = V[0],
				x = V[1];
			return I.useEffect(function() {
				if (typeof window < "u" && "matchMedia" in window) {
					var _ = function() {
							var K = E || vt();
							x(K)
						},
						R = window.matchMedia("screen and (resolution: ".concat(z, "dppx)"));
					return R.hasOwnProperty("addEventListener") ? R.addEventListener("change", _) : R.addListener(_),
						function() {
							R.hasOwnProperty("removeEventListener") ? R.removeEventListener("change", _) : R.removeListener(_)
						}
				}
			}, [z, E]), z
		}

		function vt() {
			var E = typeof window < "u" && typeof window.devicePixelRatio == "number" ? window.devicePixelRatio : 1;
			return Math.min(Math.max(1, E), 3)
		}
		var it = (function() {
				function E() {}
				return E.prototype.observe = function() {}, E.prototype.unobserve = function() {}, E.prototype.disconnect = function() {}, E
			})(),
			ot = globalThis.ResizeObserver || it,
			yt = globalThis.ResizeObserver !== void 0,
			S = !yt;

		function Pt(E, Z) {
			Z === void 0 && (Z = !0);
			var V = I.useState({
					width: 0,
					height: 0
				}),
				z = V[0],
				x = V[1];
			I.useEffect(function() {
				if (typeof window < "u" && Z) {
					var P = function() {
						x({
							width: window.innerWidth,
							height: window.innerHeight
						})
					};
					return S && (P(), window.addEventListener("resize", P)),
						function() {
							return window.removeEventListener("resize", P)
						}
				}
			}, []);
			var _, R, K, G = I.useRef(new ot((_ = function(P) {
				yt && x({
					width: P[P.length - 1].contentRect.width,
					height: P[P.length - 1].contentRect.height
				})
			}, R = 0, K = 0, function() {
				for (var P = this, y = [], L = 0; L < arguments.length; L++) y[L] = arguments[L];
				clearTimeout(K), K = window.setTimeout(function() {
					return _.apply(P, y)
				}, R)
			})));
			return I.useEffect(function() {
				var P = G.current;
				if (Z) {
					var y = E.current;
					return E.current && yt && P.observe(E.current),
						function() {
							P.disconnect(), y && yt && P.unobserve(y)
						}
				}
				P.disconnect()
			}, [E, G]), z
		}
		var re = {
			useDevicePixelRatio: !0,
			fitCanvasToArtboardHeight: !1,
			useOffscreenRenderer: !0,
			shouldResizeCanvasToContainer: !0
		};

		function xt(E) {
			return Object.assign({}, re, E)
		}

		function Yt(E) {
			var Z = E.riveLoaded,
				V = Z !== void 0 && Z,
				z = E.canvasElem,
				x = E.containerRef,
				_ = E.options,
				R = _ === void 0 ? {} : _,
				K = E.onCanvasHasResized,
				G = E.artboardBounds,
				P = xt(R),
				y = I.useState({
					height: 0,
					width: 0
				}),
				L = y[0],
				k = L.height,
				W = L.width,
				tt = y[1],
				gt = I.useState({
					height: 0,
					width: 0
				}),
				zt = gt[0],
				Bt = zt.height,
				Zt = zt.width,
				te = gt[1],
				Le = I.useState(!0),
				Rt = Le[0],
				ee = Le[1],
				_e = P.fitCanvasToArtboardHeight,
				ve = P.shouldResizeCanvasToContainer,
				on = P.useDevicePixelRatio,
				Kn = P.customDevicePixelRatio,
				Oe = Pt(x, ve),
				qt = Y(Kn),
				xn = G ?? {},
				Qe = xn.maxX,
				Ua = xn.maxY,
				gn = I.useCallback(function() {
					var Ae, tn, d, o, f = (tn = (Ae = x.current) === null || Ae === void 0 ? void 0 : Ae.clientWidth) !== null && tn !== void 0 ? tn : 0,
						p = (o = (d = x.current) === null || d === void 0 ? void 0 : d.clientHeight) !== null && o !== void 0 ? o : 0;
					return _e && G ? {
						width: f,
						height: f * (G.maxY / G.maxX)
					} : {
						width: f,
						height: p
					}
				}, [x, _e, Qe, Ua]);
			I.useEffect(function() {
				if (ve && x.current && V) {
					var Ae = gn(),
						tn = Ae.width,
						d = Ae.height,
						o = !1;
					if (z) {
						var f = tn !== W || d !== k;
						if (P.fitCanvasToArtboardHeight && f && (x.current.style.height = d + "px", o = !0), P.useDevicePixelRatio) {
							if (f || tn * qt !== Zt || d * qt !== Bt) {
								var p = qt * tn,
									M = qt * d;
								z.width = p, z.height = M, z.style.width = tn + "px", z.style.height = d + "px", te({
									width: p,
									height: M
								}), o = !0
							}
						} else f && (z.width = tn, z.height = d, te({
							width: tn,
							height: d
						}), o = !0);
						tt({
							width: tn,
							height: d
						})
					}
					K && (Rt || o) && K && K(), Rt && ee(!1)
				}
			}, [z, x, Oe, qt, gn, Rt, ee, Bt, Zt, k, W, K, ve, _e, on, V]), I.useEffect(function() {
				te({
					width: 0,
					height: 0
				})
			}, [z])
		}
		var Gt, Dt = (function() {
				function E() {}
				return E.prototype.observe = function() {}, E.prototype.unobserve = function() {}, E.prototype.disconnect = function() {}, E
			})(),
			It = globalThis.IntersectionObserver || Dt,
			ae = (function() {
				function E() {
					var Z = this;
					this.elementsMap = new Map, this.onObserved = function(V) {
						V.forEach(function(z) {
							var x = Z.elementsMap.get(z.target);
							x && x(z)
						})
					}, this.observer = new It(this.onObserved)
				}
				return E.prototype.registerCallback = function(Z, V) {
					this.observer.observe(Z), this.elementsMap.set(Z, V)
				}, E.prototype.removeCallback = function(Z) {
					this.observer.unobserve(Z), this.elementsMap.delete(Z)
				}, E
			})(),
			Ut = function() {
				return Gt || (Gt = new ae), Gt
			};

		function Me(E) {
			var Z = E.setContainerRef,
				V = E.setCanvasRef,
				z = E.className,
				x = z === void 0 ? "" : z,
				_ = E.style,
				R = E.children,
				K = Nt(E, ["setContainerRef", "setCanvasRef", "className", "style", "children"]),
				G = Ht({
					width: "100%",
					height: "100%"
				}, _);
			return Mt.default.createElement("div", Ht({
				ref: Z,
				className: x
			}, !x && {
				style: G
			}), Mt.default.createElement("canvas", Ht({
				ref: V,
				style: {
					verticalAlign: "top",
					width: 0,
					height: 0
				}
			}, K), R))
		}

		function ct(E, Z) {
			Z === void 0 && (Z = {});
			var V = I.useState(null),
				z = V[0],
				x = V[1],
				_ = I.useRef(null),
				R = I.useRef(null),
				K = I.useState(null),
				G = K[0],
				P = K[1],
				y = !!E,
				L = xt(Z),
				k = Y(),
				W = I.useCallback(function() {
					if (G) {
						if (G.layout && G.layout.fit === Xt.Fit.Layout && z) {
							var Rt = k * G.layout.layoutScaleFactor;
							G.devicePixelRatioUsed = k, G.artboardWidth = z?.width / Rt, G.artboardHeight = z?.height / Rt
						}
						G.startRendering(), G.resizeToCanvas()
					}
				}, [G, k]);
			Yt({
				riveLoaded: !!G,
				canvasElem: z,
				containerRef: _,
				options: L,
				onCanvasHasResized: W,
				artboardBounds: G?.bounds
			});
			var tt = I.useCallback(function(Rt) {
				Rt === null && z && (z.height = 0, z.width = 0), x(Rt)
			}, []);
			I.useEffect(function() {
				if (z && E) {
					var Rt, ee = G != null;
					if (G == null) {
						var _e = L.useOffscreenRenderer,
							ve = E.onRiveReady,
							on = Nt(E, ["onRiveReady"]);
						Rt = new Xt.Rive(Ht(Ht({
							useOffscreenRenderer: _e
						}, on), {
							canvas: z
						})), R.current != null && R.current.cleanup(), R.current = Rt, Rt.on(Xt.EventType.Load, function() {
							ee = !0, ve && ve(Rt), z ? P(Rt) : Rt.cleanup()
						})
					}
					return function() {
						ee || Rt == null || Rt.cleanup()
					}
				}
			}, [z, y, G]);
			var gt = I.useCallback(function(Rt) {
					_.current = Rt
				}, []),
				zt = {
					observe: I.useCallback(function(Rt, ee) {
						Ut().registerCallback(Rt, ee)
					}, []),
					unobserve: I.useCallback(function(Rt) {
						Ut().removeCallback(Rt)
					}, [])
				},
				Bt = zt.observe,
				Zt = zt.unobserve;
			I.useEffect(function() {
				var Rt, ee = !1,
					_e = function() {
						if (z && ee) {
							var ve = z.getBoundingClientRect();
							ve.width > 0 && ve.height > 0 && ve.top < (window.innerHeight || document.documentElement.clientHeight) && ve.bottom > 0 && ve.left < (window.innerWidth || document.documentElement.clientWidth) && ve.right > 0 && (G?.startRendering(), ee = !1)
						}
					};
				return z && L.shouldUseIntersectionObserver !== !1 && Bt(z, function(ve) {
						ve.isIntersecting ? G && G.startRendering() : G && G.stopRendering(), ee = !ve.isIntersecting, clearTimeout(Rt), ve.isIntersecting || ve.boundingClientRect.width !== 0 || (Rt = setTimeout(_e, 10))
					}),
					function() {
						z && Zt(z)
					}
			}, [Bt, Zt, G, z, L.shouldUseIntersectionObserver]), I.useEffect(function() {
				return function() {
					G && (G.cleanup(), P(null))
				}
			}, [G, z]), I.useEffect(function() {
				return function() {
					R.current != null && R.current.cleanup()
				}
			}, []);
			var te = E?.animations;
			I.useEffect(function() {
				G && te && (G.isPlaying ? (G.stop(G.animationNames), G.play(te)) : G.isPaused && (G.stop(G.animationNames), G.pause(te)))
			}, [te, G]);
			var Le = I.useCallback(function(Rt) {
				return Mt.default.createElement(Me, Ht({
					setContainerRef: gt,
					setCanvasRef: tt
				}, Rt))
			}, [tt, gt]);
			return {
				canvas: z,
				container: _.current,
				setCanvasRef: tt,
				setContainerRef: gt,
				rive: G,
				RiveComponent: Le
			}
		}

		function ft(E, Z, V) {
			var z = I.useState(null),
				x = z[0],
				_ = z[1],
				R = I.useState(V.defaultValue),
				K = R[0],
				G = R[1],
				P = I.useState(null),
				y = P[0],
				L = P[1],
				k = I.useRef(null),
				W = I.useRef(E),
				tt = I.useRef(V);
			I.useEffect(function() {
				tt.current = V
			}, [V]);
			var gt = I.useCallback(function() {
				var te = k.current,
					Le = W.current,
					Rt = tt.current;
				if (!te || !Le) return _(null), G(Rt.defaultValue), L(null),
					function() {};
				var ee = Rt.getProperty(te, Le);
				if (ee) {
					_(ee), G(Rt.getValue(ee)), Rt.getExtendedData && L(Rt.getExtendedData(ee));
					var _e = function() {
						G(Rt.getValue(ee)), Rt.getExtendedData && L(Rt.getExtendedData(ee)), Rt.onPropertyEvent && Rt.onPropertyEvent()
					};
					return ee.on(_e),
						function() {
							ee.off(_e)
						}
				}
				return function() {}
			}, []);
			I.useEffect(function() {
				return k.current = Z, W.current = E, gt()
			}, [Z, E, gt]);
			var zt = I.useCallback(function(te) {
					if (x && k.current === Z) try {
						return te(x), void(tt.current.getExtendedData && L(tt.current.getExtendedData(x)))
					} catch {}
					if (k.current) try {
						var Le = tt.current.getProperty(k.current, W.current);
						Le && (_(Le), te(Le), tt.current.getExtendedData && L(tt.current.getExtendedData(Le)))
					} catch {}
				}, [x, Z]),
				Bt = I.useMemo(function() {
					return tt.current.buildPropertyOperations(zt)
				}, [zt]),
				Zt = Ht({
					value: K
				}, Bt);
			return V.getExtendedData && (Zt.extendedData = y), Zt
		}
		rt.default = function(E) {
			var Z = E.src,
				V = E.artboard,
				z = E.animations,
				x = E.stateMachines,
				_ = E.layout,
				R = E.useOffscreenRenderer,
				K = R === void 0 || R,
				G = E.shouldDisableRiveListeners,
				P = G !== void 0 && G,
				y = E.shouldResizeCanvasToContainer,
				L = y === void 0 || y,
				k = E.automaticallyHandleEvents,
				W = k !== void 0 && k,
				tt = E.children,
				gt = Nt(E, ["src", "artboard", "animations", "stateMachines", "layout", "useOffscreenRenderer", "shouldDisableRiveListeners", "shouldResizeCanvasToContainer", "automaticallyHandleEvents", "children"]),
				zt = ct({
					src: Z,
					artboard: V,
					animations: z,
					layout: _,
					stateMachines: x,
					autoplay: !0,
					shouldDisableRiveListeners: P,
					automaticallyHandleEvents: W
				}, {
					useOffscreenRenderer: K,
					shouldResizeCanvasToContainer: L
				}).RiveComponent;
			return Mt.default.createElement(zt, Ht({}, gt), tt)
		}, rt.useResizeCanvas = Yt, rt.useRive = ct, rt.useRiveFile = function(E) {
			var Z = this,
				V = I.useState(null),
				z = V[0],
				x = V[1],
				_ = I.useState("idle"),
				R = _[0],
				K = _[1];
			return I.useEffect(function() {
				var G = null;
				return Ct(Z, void 0, void 0, function() {
						return at(this, function(P) {
							try {
								K("loading"), (G = new Xt.RiveFile(E)).init(), G.on(Xt.EventType.Load, function() {
									G?.getInstance(), x(G), K("success")
								}), G.on(Xt.EventType.LoadError, function() {
									K("failed")
								}), x(G)
							} catch (y) {
								console.error(y), K("failed")
							}
							return [2]
						})
					}),
					function() {
						G?.cleanup()
					}
			}, [E.src, E.buffer]), {
				riveFile: z,
				status: R
			}
		}, rt.useStateMachineInput = function(E, Z, V, z) {
			var x = I.useState(null),
				_ = x[0],
				R = x[1];
			return I.useEffect(function() {
				function K() {
					if (E && Z && V || R(null), E && Z && V) {
						var G = E.stateMachineInputs(Z);
						if (G) {
							var P = G.find(function(y) {
								return y.name === V
							});
							z !== void 0 && P && (P.value = z), R(P || null)
						}
					} else R(null)
				}
				K(), E && E.on(Xt.EventType.Load, function() {
					K()
				})
			}, [E]), _
		}, rt.useViewModel = function(E, Z) {
			var V = Z ?? {},
				z = V.name,
				x = V.useDefault,
				_ = x !== void 0 && x,
				R = I.useState(null),
				K = R[0],
				G = R[1];
			return I.useEffect(function() {
				function P() {
					var y;
					if (E) {
						var L = null;
						L = z != null ? ((y = E.viewModelByName) === null || y === void 0 ? void 0 : y.call(E, z)) || null : E.defaultViewModel() || null, G(L)
					} else G(null)
				}
				return P(), E && E.on(Xt.EventType.Load, P),
					function() {
						E && E.off(Xt.EventType.Load, P)
					}
			}, [E, z, _]), K
		}, rt.useViewModelInstance = function(E, Z) {
			var V = Z ?? {},
				z = V.name,
				x = V.useDefault,
				_ = x !== void 0 && x,
				R = V.useNew,
				K = R !== void 0 && R,
				G = V.rive,
				P = I.useState(null),
				y = P[0],
				L = P[1];
			return I.useEffect(function() {
				var k, W, tt;
				if (E) {
					var gt = null;
					gt = z != null ? E.instanceByName(z) || null : _ ? ((k = E.defaultInstance) === null || k === void 0 ? void 0 : k.call(E)) || null : K ? ((W = E.instance) === null || W === void 0 ? void 0 : W.call(E)) || null : ((tt = E.defaultInstance) === null || tt === void 0 ? void 0 : tt.call(E)) || null, L(gt), G && gt && G.viewModelInstance !== gt && G.bindViewModelInstance(gt)
				} else L(null)
			}, [E, z, _, K, G]), y
		}, rt.useViewModelInstanceArtboard = function(E, Z) {
			return {
				setValue: ft(E, Z, {
					getProperty: I.useCallback(function(V, z) {
						return V.artboard(z)
					}, []),
					getValue: I.useCallback(function() {}, []),
					defaultValue: null,
					buildPropertyOperations: I.useCallback(function(V) {
						return {
							setValue: function(z) {
								V(function(x) {
									x.value = z
								})
							}
						}
					}, [])
				}).setValue
			}
		}, rt.useViewModelInstanceBoolean = function(E, Z) {
			var V = ft(E, Z, {
				getProperty: I.useCallback(function(z, x) {
					return z.boolean(x)
				}, []),
				getValue: I.useCallback(function(z) {
					return z.value
				}, []),
				defaultValue: null,
				buildPropertyOperations: I.useCallback(function(z) {
					return {
						setValue: function(x) {
							z(function(_) {
								_.value = x
							})
						}
					}
				}, [])
			});
			return {
				value: V.value,
				setValue: V.setValue
			}
		}, rt.useViewModelInstanceColor = function(E, Z) {
			var V = ft(E, Z, {
				getProperty: I.useCallback(function(z, x) {
					return z.color(x)
				}, []),
				getValue: I.useCallback(function(z) {
					return z.value
				}, []),
				defaultValue: null,
				buildPropertyOperations: I.useCallback(function(z) {
					return {
						setValue: function(x) {
							z(function(_) {
								_.value = x
							})
						},
						setRgb: function(x, _, R) {
							z(function(K) {
								K.rgb(x, _, R)
							})
						},
						setRgba: function(x, _, R, K) {
							z(function(G) {
								G.rgba(x, _, R, K)
							})
						},
						setAlpha: function(x) {
							z(function(_) {
								_.alpha(x)
							})
						},
						setOpacity: function(x) {
							z(function(_) {
								_.opacity(x)
							})
						}
					}
				}, [])
			});
			return {
				value: V.value,
				setValue: V.setValue,
				setRgb: V.setRgb,
				setRgba: V.setRgba,
				setAlpha: V.setAlpha,
				setOpacity: V.setOpacity
			}
		}, rt.useViewModelInstanceEnum = function(E, Z) {
			var V = ft(E, Z, {
				getProperty: I.useCallback(function(z, x) {
					return z.enum(x)
				}, []),
				getValue: I.useCallback(function(z) {
					return z.value
				}, []),
				defaultValue: null,
				getExtendedData: I.useCallback(function(z) {
					return z.values
				}, []),
				buildPropertyOperations: I.useCallback(function(z) {
					return {
						setValue: function(x) {
							z(function(_) {
								_.value = x
							})
						}
					}
				}, [])
			});
			return {
				value: V.value,
				values: V.extendedData || [],
				setValue: V.setValue
			}
		}, rt.useViewModelInstanceImage = function(E, Z) {
			return {
				setValue: ft(E, Z, {
					getProperty: I.useCallback(function(V, z) {
						return V.image(z)
					}, []),
					getValue: I.useCallback(function() {}, []),
					defaultValue: null,
					buildPropertyOperations: I.useCallback(function(V) {
						return {
							setValue: function(z) {
								V(function(x) {
									x.value = z
								})
							}
						}
					}, [])
				}).setValue
			}
		}, rt.useViewModelInstanceList = function(E, Z) {
			var V, z = I.useState(0)[1],
				x = ft(E, Z, {
					getProperty: I.useCallback(function(_, R) {
						return _.list(R)
					}, []),
					getValue: I.useCallback(function(_) {
						return _.length
					}, []),
					defaultValue: null,
					onPropertyEvent: function() {
						z(function(_) {
							return _ + 1
						})
					},
					buildPropertyOperations: I.useCallback(function(_) {
						return {
							addInstance: function(R) {
								_(function(K) {
									return K.addInstance(R)
								})
							},
							addInstanceAt: function(R, K) {
								var G = !1;
								return _(function(P) {
									G = P.addInstanceAt(R, K)
								}), G
							},
							removeInstance: function(R) {
								_(function(K) {
									return K.removeInstance(R)
								})
							},
							removeInstanceAt: function(R) {
								_(function(K) {
									return K.removeInstanceAt(R)
								})
							},
							getInstanceAt: function(R) {
								var K = null;
								return _(function(G) {
									K = G.instanceAt(R)
								}), K
							},
							swap: function(R, K) {
								_(function(G) {
									return G.swap(R, K)
								})
							}
						}
					}, [])
				});
			return {
				length: (V = x.value) !== null && V !== void 0 ? V : 0,
				addInstance: x.addInstance,
				addInstanceAt: x.addInstanceAt,
				removeInstance: x.removeInstance,
				removeInstanceAt: x.removeInstanceAt,
				getInstanceAt: x.getInstanceAt,
				swap: x.swap
			}
		}, rt.useViewModelInstanceNumber = function(E, Z) {
			var V = ft(E, Z, {
				getProperty: I.useCallback(function(z, x) {
					return z.number(x)
				}, []),
				getValue: I.useCallback(function(z) {
					return z.value
				}, []),
				defaultValue: null,
				buildPropertyOperations: I.useCallback(function(z) {
					return {
						setValue: function(x) {
							z(function(_) {
								_.value = x
							})
						}
					}
				}, [])
			});
			return {
				value: V.value,
				setValue: V.setValue
			}
		}, rt.useViewModelInstanceString = function(E, Z) {
			var V = ft(E, Z, {
				getProperty: I.useCallback(function(z, x) {
					return z.string(x)
				}, []),
				getValue: I.useCallback(function(z) {
					return z.value
				}, []),
				defaultValue: null,
				buildPropertyOperations: I.useCallback(function(z) {
					return {
						setValue: function(x) {
							z(function(_) {
								_.value = x
							})
						}
					}
				}, [])
			});
			return {
				value: V.value,
				setValue: V.setValue
			}
		}, rt.useViewModelInstanceTrigger = function(E, Z, V) {
			var z = (V ?? {}).onTrigger;
			return {
				trigger: ft(E, Z, {
					getProperty: I.useCallback(function(x, _) {
						return x.trigger(_)
					}, []),
					getValue: I.useCallback(function() {}, []),
					defaultValue: null,
					onPropertyEvent: z,
					buildPropertyOperations: I.useCallback(function(x) {
						return {
							trigger: function() {
								x(function(_) {
									_.trigger()
								})
							}
						}
					}, [])
				}).trigger
			}
		}, Object.keys(Xt).forEach(function(E) {
			E === "default" || rt.hasOwnProperty(E) || Object.defineProperty(rt, E, {
				enumerable: !0,
				get: function() {
					return Xt[E]
				}
			})
		})
	})(wf)), wf
}
var ei = hm();
const au = "Login Machine",
	dm = "teddy",
	Hd = "Login",
	vm = (rt = {}) => {
		const {
			rive: I,
			RiveComponent: Xt
		} = ei.useRive({
			src: "./assets/resources/login-teddy1.riv",
			stateMachines: au,
			autoplay: !0,
			layout: new ei.Layout({
				fit: ei.Fit.Cover,
				alignment: ei.Alignment.Center
			}),
			...rt
		}), [B, Mt] = hl.useState(""), [Ht, Nt] = hl.useState(""), [Ct, at] = hl.useState(0), [Y, vt] = hl.useState(Hd), it = hl.useRef(null), ot = ei.useStateMachineInput(I, au, "isChecking"), yt = ei.useStateMachineInput(I, au, "numLook"), S = ei.useStateMachineInput(I, au, "trigSuccess"), Pt = ei.useStateMachineInput(I, au, "trigFail"), re = ei.useStateMachineInput(I, au, "isHandsUp");
		hl.useEffect(() => {
			it?.current && !Ct && at(it.current.offsetWidth / 100)
		}, [it]);
		const xt = Dt => {
				const It = Dt.target.value;
				Mt(It), ot.value || (ot.value = !0);
				const ae = It.length;
				yt.value = ae * Ct
			},
			Yt = () => {
				ot.value = !0, yt.value !== B.length * Ct && (yt.value = B.length * Ct)
			};
			const Gt = async (e) => {
				e.preventDefault();
				
				vt("Checking...");
				ot.value = true;

				const usuario = B.trim();
				const password = Ht.trim();

				if (!usuario || !password) {
					alertify.warning("⚠️ Ingrese usuario y contraseña");
					ot.value = false;
					vt(Hd);
					return;
				}

				const formData = new FormData();
				formData.append("usuario", usuario);
				formData.append("password", password);

				try {
					const res = await fetch("controller/acceso.php", {
						method: "POST",
						body: formData
					});

					const data = await res.json();

					if (data.ok) {
						S.fire();
						alertify.success("✅ Acceso correcto, redirigiendo...");

						vt("Ingresando...");

						setTimeout(() => {
							window.location.href = "home.php";
						}, 1000);

					} else {
						Pt.fire();
						alertify.error(data.message || "❌ Usuario o contraseña incorrectos");
						vt(Hd);
					}

				} catch (err) {
					Pt.fire();
					alertify.error("❌ Error al conectar con el servidor");
					console.error(err);
					vt(Hd);
				} finally {
					ot.value = false;
				}
			};

		return Rn.jsx("div", {
			className: "login-form-component-root",
			children: Rn.jsxs("div", {
				className: "login-form-wrapper",
				children: [Rn.jsx("div", {
					className: "rive-wrapper",
					children: Rn.jsx(Xt, {
						className: "rive-container"
					})
				}), Rn.jsx("div", {
					className: "form-container",
					children: Rn.jsxs("form", {
						onSubmit: Gt,
						children: [Rn.jsx("label", {
							children: Rn.jsx("input", {
								type: "text",
								className: "form-username",
								name: "username",
								placeholder: "Username",
								onFocus: Yt,
								value: B,
								onChange: xt,
								onBlur: () => ot.value = !1,
								ref: it
							})
						}), Rn.jsx("label", {
							children: Rn.jsx("input", {
								type: "password",
								className: "form-pass",
								name: "password",
								placeholder: "Password",
								value: Ht,
								onFocus: () => re.value = !0,
								onBlur: () => re.value = !1,
								onChange: Dt => Nt(Dt.target.value)
							})
						}), Rn.jsx("button", {
							className: "login-btn",
							children: Y
						})]
					})
				})]
			})
		})
	};

function mm() {
	return Rn.jsx("div", {
		className: "App",
		children: Rn.jsx(vm, {})
	})
}
cm.createRoot(document.getElementById("root")).render(Rn.jsx(hl.StrictMode, {
	children: Rn.jsx(mm, {})
}));