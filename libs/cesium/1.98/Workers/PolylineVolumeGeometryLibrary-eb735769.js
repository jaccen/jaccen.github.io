/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.98
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
define(["exports","./Matrix2-7dfd434a","./EllipsoidTangentPlane-03ebf5f4","./ComponentDatatype-9b23164a","./PolylinePipeline-92970340","./Transforms-f305a473","./defaultValue-50f7432c"],(function(e,a,t,n,r,i,s){"use strict";var o=Object.freeze({ROUNDED:0,MITERED:1,BEVELED:2});const l={};function c(e,a){s.defined(l[e])||(l[e]=!0,console.warn(s.defaultValue(a,e)))}c.geometryOutlines="Entity geometry outlines are unsupported on terrain. Outlines will be disabled. To enable outlines, disable geometry terrain clamping by explicitly setting height to 0.",c.geometryZIndex="Entity geometry with zIndex are unsupported when height or extrudedHeight are defined.  zIndex will be ignored",c.geometryHeightReference="Entity corridor, ellipse, polygon or rectangle with heightReference must also have a defined height.  heightReference will be ignored",c.geometryExtrudedHeightReference="Entity corridor, ellipse, polygon or rectangle with extrudedHeightReference must also have a defined extrudedHeight.  extrudedHeightReference will be ignored";const C=[new a.Cartesian3,new a.Cartesian3],u=new a.Cartesian3,d=new a.Cartesian3,g=new a.Cartesian3,y=new a.Cartesian3,f=new a.Cartesian3,m=new a.Cartesian3,h=new a.Cartesian3,p=new a.Cartesian3,w=new a.Cartesian3,x=new a.Cartesian3,E=new a.Cartesian3,P={};let M=new a.Cartographic;function b(e,t,n,r){const i=e[0],s=e[1],o=a.Cartesian3.angleBetween(i,s),l=Math.ceil(o/r),c=new Array(l);let C;if(t===n){for(C=0;C<l;C++)c[C]=t;return c.push(n),c}const u=(n-t)/l;for(C=1;C<l;C++){const e=t+C*u;c[C]=e}return c[0]=t,c.push(n),c}const T=new a.Cartesian3,B=new a.Cartesian3;const z=new a.Cartesian3(-1,0,0);let S=new a.Matrix4;const A=new a.Matrix4;let D=new a.Matrix3;const R=a.Matrix3.IDENTITY.clone(),O=new a.Cartesian3,V=new a.Cartesian4,I=new a.Cartesian3;function v(e,n,r,s,o,l,c,C){let u=O,d=V;S=i.Transforms.eastNorthUpToFixedFrame(e,o,S),u=a.Matrix4.multiplyByPointAsVector(S,z,u),u=a.Cartesian3.normalize(u,u);const g=function(e,n,r,i){const s=new t.EllipsoidTangentPlane(r,i),o=s.projectPointOntoPlane(a.Cartesian3.add(r,e,T),T),l=s.projectPointOntoPlane(a.Cartesian3.add(r,n,B),B),c=a.Cartesian2.angleBetween(o,l);return l.x*o.y-l.y*o.x>=0?-c:c}(u,n,e,o);D=a.Matrix3.fromRotationZ(g,D),I.z=l,S=a.Matrix4.multiplyTransformation(S,a.Matrix4.fromRotationTranslation(D,I,A),S);const y=R;y[0]=c;for(let e=0;e<C;e++)for(let e=0;e<r.length;e+=3)d=a.Cartesian3.fromArray(r,e,d),d=a.Matrix3.multiplyByVector(y,d,d),d=a.Matrix4.multiplyByPoint(S,d,d),s.push(d.x,d.y,d.z);return s}const N=new a.Cartesian3;function G(e,t,n,r,i,s,o){for(let l=0;l<e.length;l+=3){r=v(a.Cartesian3.fromArray(e,l,N),t,n,r,i,s[l/3],o,1)}return r}function H(e,a){const t=e.length,n=new Array(3*t);let r=0;const i=a.x+a.width/2,s=a.y+a.height/2;for(let a=0;a<t;a++)n[r++]=e[a].x-i,n[r++]=0,n[r++]=e[a].y-s;return n}const L=new i.Quaternion,j=new a.Cartesian3,Q=new a.Matrix3;function q(e,t,r,s,l,c,C,u,d,g){const y=a.Cartesian3.angleBetween(a.Cartesian3.subtract(t,e,x),a.Cartesian3.subtract(r,e,E)),f=s===o.BEVELED?0:Math.ceil(y/n.CesiumMath.toRadians(5));let m,h,p;if(m=l?a.Matrix3.fromQuaternion(i.Quaternion.fromAxisAngle(a.Cartesian3.negate(e,x),y/(f+1),L),Q):a.Matrix3.fromQuaternion(i.Quaternion.fromAxisAngle(e,y/(f+1),L),Q),t=a.Cartesian3.clone(t,j),f>0){const n=g?2:1;for(let r=0;r<f;r++)t=a.Matrix3.multiplyByVector(m,t,t),h=a.Cartesian3.subtract(t,e,x),h=a.Cartesian3.normalize(h,h),l||(h=a.Cartesian3.negate(h,h)),p=c.scaleToGeodeticSurface(t,E),C=v(p,h,u,C,c,d,1,n)}else h=a.Cartesian3.subtract(t,e,x),h=a.Cartesian3.normalize(h,h),l||(h=a.Cartesian3.negate(h,h)),p=c.scaleToGeodeticSurface(t,E),C=v(p,h,u,C,c,d,1,1),r=a.Cartesian3.clone(r,j),h=a.Cartesian3.subtract(r,e,x),h=a.Cartesian3.normalize(h,h),l||(h=a.Cartesian3.negate(h,h)),p=c.scaleToGeodeticSurface(r,E),C=v(p,h,u,C,c,d,1,1);return C}P.removeDuplicatesFromShape=function(e){const t=e.length,n=[];for(let r=t-1,i=0;i<t;r=i++){const t=e[r],s=e[i];a.Cartesian2.equals(t,s)||n.push(s)}return n},P.angleIsGreaterThanPi=function(e,n,r,i){const s=new t.EllipsoidTangentPlane(r,i),o=s.projectPointOntoPlane(a.Cartesian3.add(r,e,T),T),l=s.projectPointOntoPlane(a.Cartesian3.add(r,n,B),B);return l.x*o.y-l.y*o.x>=0};const F=new a.Cartesian3,U=new a.Cartesian3;P.computePositions=function(e,t,i,s,l){const E=s._ellipsoid,T=function(e,a){const t=new Array(e.length);for(let n=0;n<e.length;n++){const r=e[n];M=a.cartesianToCartographic(r,M),t[n]=M.height,e[n]=a.scaleToGeodeticSurface(r,r)}return t}(e,E),B=s._granularity,z=s._cornerType,S=l?function(e,a){const t=e.length,n=new Array(6*t);let r=0;const i=a.x+a.width/2,s=a.y+a.height/2;let o=e[0];n[r++]=o.x-i,n[r++]=0,n[r++]=o.y-s;for(let a=1;a<t;a++){o=e[a];const t=o.x-i,l=o.y-s;n[r++]=t,n[r++]=0,n[r++]=l,n[r++]=t,n[r++]=0,n[r++]=l}return o=e[0],n[r++]=o.x-i,n[r++]=0,n[r++]=o.y-s,n}(t,i):H(t,i),A=l?H(t,i):void 0,D=i.height/2,R=i.width/2;let O=e.length,V=[],I=l?[]:void 0,N=u,L=d,j=g,Q=y,_=f,Z=m,W=h,Y=p,k=w,J=e[0],K=e[1];Q=E.geodeticSurfaceNormal(J,Q),N=a.Cartesian3.subtract(K,J,N),N=a.Cartesian3.normalize(N,N),Y=a.Cartesian3.cross(Q,N,Y),Y=a.Cartesian3.normalize(Y,Y);let X,$,ee=T[0],ae=T[1];l&&(I=v(J,Y,A,I,E,ee+D,1,1)),k=a.Cartesian3.clone(J,k),J=K,L=a.Cartesian3.negate(N,L);for(let t=1;t<O-1;t++){const i=l?2:1;if(K=e[t+1],J.equals(K)){c("Positions are too close and are considered equivalent with rounding error.");continue}N=a.Cartesian3.subtract(K,J,N),N=a.Cartesian3.normalize(N,N),j=a.Cartesian3.add(N,L,j),j=a.Cartesian3.normalize(j,j),Q=E.geodeticSurfaceNormal(J,Q);const s=a.Cartesian3.multiplyByScalar(Q,a.Cartesian3.dot(N,Q),F);a.Cartesian3.subtract(N,s,s),a.Cartesian3.normalize(s,s);const u=a.Cartesian3.multiplyByScalar(Q,a.Cartesian3.dot(L,Q),U);a.Cartesian3.subtract(L,u,u),a.Cartesian3.normalize(u,u);if(!n.CesiumMath.equalsEpsilon(Math.abs(a.Cartesian3.dot(s,u)),1,n.CesiumMath.EPSILON7)){j=a.Cartesian3.cross(j,Q,j),j=a.Cartesian3.cross(Q,j,j),j=a.Cartesian3.normalize(j,j);const e=1/Math.max(.25,a.Cartesian3.magnitude(a.Cartesian3.cross(j,L,x))),t=P.angleIsGreaterThanPi(N,L,J,E);t?(_=a.Cartesian3.add(J,a.Cartesian3.multiplyByScalar(j,e*R,j),_),Z=a.Cartesian3.add(_,a.Cartesian3.multiplyByScalar(Y,R,Z),Z),C[0]=a.Cartesian3.clone(k,C[0]),C[1]=a.Cartesian3.clone(Z,C[1]),X=b(C,ee+D,ae+D,B),$=r.PolylinePipeline.generateArc({positions:C,granularity:B,ellipsoid:E}),V=G($,Y,S,V,E,X,1),Y=a.Cartesian3.cross(Q,N,Y),Y=a.Cartesian3.normalize(Y,Y),W=a.Cartesian3.add(_,a.Cartesian3.multiplyByScalar(Y,R,W),W),z===o.ROUNDED||z===o.BEVELED?q(_,Z,W,z,t,E,V,S,ae+D,l):(j=a.Cartesian3.negate(j,j),V=v(J,j,S,V,E,ae+D,e,i)),k=a.Cartesian3.clone(W,k)):(_=a.Cartesian3.add(J,a.Cartesian3.multiplyByScalar(j,e*R,j),_),Z=a.Cartesian3.add(_,a.Cartesian3.multiplyByScalar(Y,-R,Z),Z),C[0]=a.Cartesian3.clone(k,C[0]),C[1]=a.Cartesian3.clone(Z,C[1]),X=b(C,ee+D,ae+D,B),$=r.PolylinePipeline.generateArc({positions:C,granularity:B,ellipsoid:E}),V=G($,Y,S,V,E,X,1),Y=a.Cartesian3.cross(Q,N,Y),Y=a.Cartesian3.normalize(Y,Y),W=a.Cartesian3.add(_,a.Cartesian3.multiplyByScalar(Y,-R,W),W),z===o.ROUNDED||z===o.BEVELED?q(_,Z,W,z,t,E,V,S,ae+D,l):V=v(J,j,S,V,E,ae+D,e,i),k=a.Cartesian3.clone(W,k)),L=a.Cartesian3.negate(N,L)}else V=v(k,Y,S,V,E,ee+D,1,1),k=J;ee=ae,ae=T[t+1],J=K}C[0]=a.Cartesian3.clone(k,C[0]),C[1]=a.Cartesian3.clone(J,C[1]),X=b(C,ee+D,ae+D,B),$=r.PolylinePipeline.generateArc({positions:C,granularity:B,ellipsoid:E}),V=G($,Y,S,V,E,X,1),l&&(I=v(J,Y,A,I,E,ae+D,1,1)),O=V.length;const te=l?O+I.length:O,ne=new Float64Array(te);return ne.set(V),l&&ne.set(I,O),ne};var _=P;e.CornerType=o,e.PolylineVolumeGeometryLibrary=_,e.oneTimeWarning=c}));
