import{d as l,r as o,j as s}from"./index-JvT0CUVe.js";import{a as p,B as c}from"./button-CHl_c3uP.js";import{I as h}from"./input-DQ2JEjjA.js";import{E as m}from"./eye-C3Ckyv7Z.js";const w=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],y=l("eye-off",w),u=o.forwardRef(({className:r,...e},d)=>{const[a,i]=o.useState(!1),t=e.value===""||e.value===void 0||e.disabled;return s.jsxs("div",{className:"relative",children:[s.jsx(h,{type:a?"text":"password",className:p("hide-password-toggle pr-10",r),ref:d,...e}),s.jsxs(c,{type:"button",variant:"ghost",size:"sm",className:"absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",onClick:()=>i(n=>!n),disabled:t,children:[a&&!t?s.jsx(m,{className:"h-4 w-4","aria-hidden":"true"}):s.jsx(y,{className:"h-4 w-4","aria-hidden":"true"}),s.jsx("span",{className:"sr-only",children:a?"Hide password":"Show password"})]}),s.jsx("style",{children:`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`})]})});u.displayName="PasswordInput";export{u as P};
