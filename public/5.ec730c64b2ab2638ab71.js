(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{w8Di:function(t,e,i){"use strict";i.r(e),i.d(e,"AssistantModule",(function(){return N}));var s=i("SVse"),c=i("iInd");function n(t,e,i,s){return new(i||(i=Promise))((function(c,n){function o(t){try{a(s.next(t))}catch(e){n(e)}}function r(t){try{a(s.throw(t))}catch(e){n(e)}}function a(t){var e;t.done?c(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,r)}a((s=s.apply(t,e||[])).next())}))}var o=i("HDdC"),r=i("D0XW"),a=i("Y7HM");function b(t=0,e=r.a){return(!Object(a.a)(t)||t<0)&&(t=0),e&&"function"==typeof e.schedule||(e=r.a),new o.a(i=>(i.add(e.schedule(d,t,{subscriber:i,counter:0,period:t})),i))}function d(t){const{subscriber:e,counter:i,period:s}=t;e.next(i),this.schedule({subscriber:e,counter:i+1,period:s},s)}var l=i("lJxs"),u=i("IzEk"),k=i("vkgz"),h=i("1G5W"),p=i("8Y7J"),m=i("TGE+"),v=i("qfBg"),g=i("Gyf/"),f=i("zHaW"),R=i("Tj54");function Q(t,e){1&t&&(p.Rb(0,"span"),p.Rb(1,"mat-icon",29),p.tc(2,"directions_walk"),p.Qb(),p.Qb())}function S(t,e){if(1&t&&(p.Rb(0,"div"),p.Rb(1,"div",25),p.Rb(2,"div",26),p.tc(3," Atendiendo turno "),p.Qb(),p.Qb(),p.Rb(4,"div",25),p.Rb(5,"div",30),p.tc(6),p.Qb(),p.Qb(),p.Qb()),2&t){const t=p.ac();p.zb(6),p.wc(" ",t.ticketsService.myTicket.cd_skill," ",t.ticketsService.myTicket.id_ticket," ")}}function y(t,e){if(1&t&&(p.Rb(0,"div",31),p.tc(1),p.Qb()),2&t){const t=p.ac();p.zb(1),p.uc(t.message)}}function w(t,e){if(1&t&&(p.Rb(0,"tr"),p.Rb(1,"td",32),p.tc(2),p.Qb(),p.Rb(3,"td",33),p.tc(4),p.Qb(),p.Qb()),2&t){const t=e.$implicit;p.zb(2),p.vc(" ",t.tx_skill," "),p.zb(2),p.vc(" ",t.tickets.length," ")}}let T=(()=>{class t{constructor(t,e,i,s,c){this.ticketsService=t,this.userService=e,this.wsService=i,this.snack=s,this.router=c,this.waitForClient=!1,this.comingClient=!1,this.pendingTicketsCount=0,this.pendingTicketsBySkill=[],this.timerCount=10,this.tmWaiting="--:--:--",this.tmAttention="--:--:--"}ngOnInit(){var t;(null===(t=this.userService.desktop)||void 0===t?void 0:t.cd_desktop)?this.cdDesk=this.userService.desktop.cd_desktop:(this.snack.open("No tiene un escritorio asignado",null,{duration:2e3}),this.router.navigate(["/assistant/home"])),this.getTickets(),this.wsService.escucharTurnos().subscribe(t=>{this.getTickets()})}getTickets(){return n(this,void 0,void 0,(function*(){yield this.ticketsService.getTickets().then(t=>{const e=t.filter(t=>t.cd_desk===this.cdDesk&&null===t.tm_end)[0];e&&(this.message="Existe un ticket pendiente de resoluci\xf3n",localStorage.setItem("ticket",JSON.stringify(e)));const i=t.filter(t=>null===t.tm_end);this.pendingTicketsCount=i.length,i.length>0&&(this.message=`Hay ${i.length} tickets en espera`),this.pendingTicketsBySkill=[];const s=this.userService.user.id_skills;for(let c of s)this.pendingTicketsBySkill.push({cd_skill:c.cd_skill,tx_skill:c.tx_skill,tickets:i.filter(t=>t.id_skill===c._id&&null===t.tm_end)})}).catch(()=>{this.message="Error al obtener los tickets"})}))}askForEndTicket(){return new Promise((t,e)=>{this.snack.open("Desea finalizar el ticket en curso?","ACEPTAR",{duration:1e4}).afterDismissed().subscribe(i=>{i.dismissedByAction&&this.ticketsService.endTicket(this.ticketsService.myTicket._id).subscribe(i=>{this.message=i.msg,i.ok?t():e()})})})}takeTicket(){return n(this,void 0,void 0,(function*(){this.ticketsService.myTicket&&(yield this.askForEndTicket().then(()=>{this.clearSession()}).catch(()=>{})),this.ticketsService.takeTicket(this.cdDesk,this.userService.desktop._id,this.userService.user._id,this.wsService.idSocket).subscribe(t=>{if(this.snack.open(t.msg,null,{duration:2e3}),this.getTickets(),t.ok){this.waitForClient=!0,this.message="",this.ticketsService.myTicket=t.ticket,localStorage.setItem("ticket",JSON.stringify(t.ticket)),this.tmWaiting=this.ticketsService.getTimeInterval(t.ticket.tm_start,t.ticket.tm_att);const e=this.wsService.escucharEnCamino(),i=b(1e3).pipe(Object(l.a)(t=>t+1),Object(u.a)(10));let s=!1;i.pipe(Object(k.a)(t=>this.timerCount=10-t),Object(h.a)(e)).subscribe(t=>{t>=9&&(s=!0)},void 0,()=>{new Promise(t=>{s?(this.waitForClient=!1,this.comingClient=!1,t()):(this.waitForClient=!0,this.comingClient=!0,b(1e3).pipe(Object(l.a)(t=>t+1),Object(u.a)(20)).subscribe(t=>this.timerCount=20-t,void 0,()=>{this.waitForClient=!1,this.comingClient=!1,t()}))}).then(()=>{const t=b(1e3),e=(new Date).getTime();this.tmRun=t.subscribe(t=>{this.tmAttention=this.ticketsService.getTimeInterval(e,+new Date)})})})}else this.waitForClient=!1,this.message=t.msg,this.clearSession()}),this.getTickets()}))}assignTicket(){}releaseTicket(){this.ticketsService.releaseTicket(this.ticketsService.myTicket._id).subscribe(t=>{t.ok&&(this.clearSession(),this.message=t.msg)})}endTicket(){this.ticketsService.endTicket(this.ticketsService.myTicket._id).subscribe(t=>{t.ok&&(this.clearSession(),this.message=t.msg)})}clearSession(){this.getTickets(),this.ticketsService.myTicket=null,localStorage.getItem("ticket")&&localStorage.removeItem("ticket"),this.ticketsService.chatMessages=[],this.tmWaiting="--:--:--",this.tmAttention="--:--:--",this.tmRun&&this.tmRun.unsubscribe()}releaseDesktop(){this.userService.releaseDesktop(this.userService.desktop._id).subscribe(t=>{t.ok&&(this.clearSession(),this.router.navigate(["assistant/home"]))})}}return t.\u0275fac=function(e){return new(e||t)(p.Lb(m.a),p.Lb(v.a),p.Lb(g.a),p.Lb(f.a),p.Lb(c.b))},t.\u0275cmp=p.Fb({type:t,selectors:[["app-desktop"]],decls:62,vars:13,consts:[[1,"m-4","row","animated","fadeIn"],[1,"col-lg-6"],[1,"card","bg-light","mb-4",2,"min-width","18rem","max-width","30rem"],[1,"card-header","banner-title"],[4,"ngIf"],[1,"banner-content"],[1,"container"],["class","card text-white my-4 p-2","style","background-color: darkcyan;",4,"ngIf"],[1,"row","banner-footer"],[1,"col","p-0"],[1,"content"],[1,"my-1"],[1,"row",2,"justify-content","space-between"],[1,"col","col-6","col-md-3","p-1"],[1,"btn","btn-block","btn-danger",3,"disabled","click"],[1,"btn","btn-block","btn-info",3,"disabled","click"],[1,"btn","btn-block","btn-primary",3,"disabled","click"],[1,"btn","btn-block","btn-success",3,"disabled","click"],[1,"card","bg-primary","mb-4",2,"min-width","18rem","max-width","30rem"],[1,"card-content","table-responsive-sm","p-2"],[1,"table","table-sm","text-white","text-center",2,"font-size","large"],[2,"border-top","0px","color","yellow"],[2,"text-align","left","border","none"],[2,"text-align","center","border","none"],[4,"ngFor","ngForOf"],[1,"row"],[1,"col"],[1,"text-center","footer-panel"],[1,"btn","btn-danger","text-uppercase","m-2",3,"click"],[2,"float","right","color","blueviolet","font-size","x-large"],[1,"col","xxxxl"],[1,"card","text-white","my-4","p-2",2,"background-color","darkcyan"],[2,"text-align","left"],[2,"text-align","center"]],template:function(t,e){1&t&&(p.Rb(0,"div",0),p.Rb(1,"div",1),p.Rb(2,"div",2),p.Rb(3,"div",3),p.Rb(4,"span"),p.tc(5),p.Qb(),p.sc(6,Q,3,0,"span",4),p.Qb(),p.Rb(7,"div",5),p.Rb(8,"div",6),p.sc(9,S,7,2,"div",4),p.sc(10,y,2,1,"div",7),p.Rb(11,"div",8),p.Rb(12,"div",9),p.Rb(13,"div"),p.tc(14,"TE"),p.Qb(),p.Rb(15,"div"),p.tc(16),p.Qb(),p.Qb(),p.Rb(17,"div",9),p.Rb(18,"div"),p.tc(19,"TA"),p.Qb(),p.Rb(20,"div"),p.tc(21),p.Qb(),p.Qb(),p.Rb(22,"div",9),p.Rb(23,"div"),p.tc(24,"Tm"),p.Qb(),p.Rb(25,"div"),p.tc(26),p.Qb(),p.Qb(),p.Rb(27,"div",9),p.Rb(28,"div"),p.tc(29,"TC"),p.Qb(),p.Rb(30,"div"),p.tc(31),p.Qb(),p.Qb(),p.Qb(),p.Rb(32,"div",10),p.Mb(33,"hr",11),p.Rb(34,"div",12),p.Rb(35,"div",13),p.Rb(36,"button",14),p.Yb("click",(function(){return e.releaseTicket()})),p.tc(37," Soltar "),p.Qb(),p.Qb(),p.Rb(38,"div",13),p.Rb(39,"button",15),p.Yb("click",(function(){return e.assignTicket()})),p.tc(40," Reasignar "),p.Qb(),p.Qb(),p.Rb(41,"div",13),p.Rb(42,"button",16),p.Yb("click",(function(){return e.endTicket()})),p.tc(43," Finalizar "),p.Qb(),p.Qb(),p.Rb(44,"div",13),p.Rb(45,"button",17),p.Yb("click",(function(){return e.takeTicket()})),p.tc(46," Siguiente "),p.Qb(),p.Qb(),p.Qb(),p.Qb(),p.Qb(),p.Qb(),p.Qb(),p.Qb(),p.Rb(47,"div",1),p.Rb(48,"div",18),p.Rb(49,"div",19),p.Rb(50,"table",20),p.Rb(51,"tr",21),p.Rb(52,"td",22),p.tc(53," Skill "),p.Qb(),p.Rb(54,"td",23),p.tc(55," Cola "),p.Qb(),p.Qb(),p.sc(56,w,5,2,"tr",24),p.Qb(),p.Qb(),p.Qb(),p.Qb(),p.Qb(),p.Rb(57,"div",25),p.Rb(58,"div",26),p.Rb(59,"div",27),p.Rb(60,"button",28),p.Yb("click",(function(){return e.releaseDesktop()})),p.tc(61,"Abandonar Escritorio"),p.Qb(),p.Qb(),p.Qb(),p.Qb()),2&t&&(p.zb(5),p.vc(" ESCRITORIO ",e.cdDesk," "),p.zb(1),p.gc("ngIf",e.comingClient),p.zb(3),p.gc("ngIf",e.ticketsService.myTicket),p.zb(1),p.gc("ngIf",e.message),p.zb(6),p.uc(e.tmWaiting),p.zb(5),p.uc(e.tmAttention),p.zb(5),p.uc(e.timerCount),p.zb(5),p.uc(e.pendingTicketsCount),p.zb(5),p.gc("disabled",e.waitForClient||!e.ticketsService.myTicket),p.zb(3),p.gc("disabled",!0),p.zb(3),p.gc("disabled",!e.ticketsService.myTicket||e.waitForClient),p.zb(3),p.gc("disabled",e.waitForClient),p.zb(11),p.gc("ngForOf",e.pendingTicketsBySkill))},directives:[s.j,s.i,R.a],styles:[".desktop-panel-buttons[_ngcontent-%COMP%]{font-size:1.5rem;position:relative;top:-.3rem;left:-.3rem}"]}),t})();var _=i("AIE+"),z=i("Q2Ze"),I=i("ZTz/"),D=i("UhP/");function x(t,e){1&t&&(p.Rb(0,"div",7),p.tc(1," La empresa seleccionada no tiene escritorios creados. "),p.Qb())}function C(t,e){if(1&t){const t=p.Sb();p.Rb(0,"div",5),p.tc(1),p.Rb(2,"div"),p.Rb(3,"button",10),p.Yb("click",(function(){p.mc(t);const e=p.ac(2);return e.takeDesktop(e.myDesktop)})),p.tc(4,"Ingresar"),p.Qb(),p.Rb(5,"button",11),p.Yb("click",(function(){p.mc(t);const e=p.ac(2);return e.releaseDesktop(e.myDesktop)})),p.tc(6,"Finalizar"),p.Qb(),p.Qb(),p.Qb()}if(2&t){const t=p.ac(2);p.zb(1),p.vc(" Usted tiene tomado el escritorio ",t.myDesktop.cd_desktop," ")}}function F(t,e){1&t&&(p.Rb(0,"div",7),p.tc(1," Todos los escritorios estan tomados. "),p.Qb())}function O(t,e){if(1&t&&(p.Rb(0,"mat-option",17),p.tc(1),p.Qb()),2&t){const t=e.$implicit;p.gc("value",t),p.zb(1),p.vc(" ",t.cd_desktop," ")}}function A(t,e){if(1&t){const t=p.Sb();p.Rb(0,"div",5),p.Rb(1,"mat-form-field",12),p.Rb(2,"mat-label"),p.tc(3,"Seleccione un escritorio"),p.Qb(),p.Rb(4,"mat-select",13,14),p.sc(6,O,2,2,"mat-option",15),p.Qb(),p.Qb(),p.Rb(7,"div"),p.Rb(8,"button",16),p.Yb("click",(function(){p.mc(t);const e=p.lc(5);return p.ac(3).takeDesktop(null==e?null:e.value)})),p.tc(9," Ingresar "),p.Qb(),p.Qb(),p.Qb()}if(2&t){const t=p.ac(3);p.zb(6),p.gc("ngForOf",t.desktopsAvailable)}}function j(t,e){if(1&t&&(p.Rb(0,"div",5),p.sc(1,F,2,0,"div",3),p.sc(2,A,10,1,"div",8),p.Qb()),2&t){const t=p.ac(2);p.zb(1),p.gc("ngIf",0===t.desktopsAvailable.length),p.zb(1),p.gc("ngIf",t.desktopsAvailable.length>0)}}function E(t,e){if(1&t&&(p.Rb(0,"div"),p.tc(1),p.Qb()),2&t){const t=p.ac().$implicit;p.zb(1),p.wc(" Escritorio ",t.cd_desktop," tomado por ",null==t.id_assistant?null:t.id_assistant.tx_name," ")}}function J(t,e){if(1&t&&(p.Rb(0,"div"),p.tc(1),p.Qb()),2&t){const t=p.ac().$implicit;p.zb(1),p.vc(" Escritorio ",t.cd_desktop," libre ")}}function L(t,e){if(1&t&&(p.Rb(0,"div"),p.sc(1,E,2,2,"div",4),p.sc(2,J,2,1,"div",4),p.Qb()),2&t){const t=e.$implicit;p.zb(1),p.gc("ngIf",t.id_assistant),p.zb(1),p.gc("ngIf",!t.id_assistant)}}function Y(t,e){if(1&t&&(p.Rb(0,"div"),p.sc(1,C,7,1,"div",8),p.sc(2,j,3,2,"div",8),p.sc(3,L,3,2,"div",9),p.Qb()),2&t){const t=p.ac();p.zb(1),p.gc("ngIf",t.myDesktop),p.zb(1),p.gc("ngIf",!t.myDesktop),p.zb(1),p.gc("ngForOf",t.desktops)}}const W=[{path:"home",component:(()=>{class t{constructor(t,e,i){this.router=t,this.userService=e,this.snack=i,this.desktops=[],this.desktopsAvailable=[]}ngOnInit(){this.userService.user.id_company._id&&this.readDesktops(this.userService.user.id_company._id),this.userService.user$.subscribe(t=>{t&&this.readDesktops(t.id_company._id)})}takeDesktop(t){t&&(this.userService.desktop?this.router.navigate(["/assistant/desktop"]):this.userService.takeDesktop(t._id,this.userService.user._id).subscribe(t=>{this.snack.open(t.msg,null,{duration:2e3}),t.ok?(this.userService.desktop=t.desktop,localStorage.setItem("desktop",JSON.stringify(t.desktop)),this.router.navigate(["/assistant/desktop"])):this.snack.open("No se pudo tomar un escritorio",null,{duration:2e3})}))}readDesktops(t){this.userService.readDesktops(t).subscribe(t=>{t.ok&&(this.desktops=t.desktops,this.desktopsAvailable=this.desktops.filter(t=>null===t.id_assistant),this.myDesktop=this.desktops.filter(t=>{var e;return(null===(e=t.id_assistant)||void 0===e?void 0:e._id)===this.userService.user._id})[0]),this.myDesktop?(this.userService.desktop=this.myDesktop,localStorage.setItem("desktop",JSON.stringify(this.myDesktop))):(this.userService.desktop=null,localStorage.getItem("desktop")&&localStorage.removeItem("desktop"))})}releaseDesktop(t){let e=this.userService.user.id_company._id;this.userService.releaseDesktop(t._id).subscribe(t=>{this.readDesktops(e)})}}return t.\u0275fac=function(e){return new(e||t)(p.Lb(c.b),p.Lb(v.a),p.Lb(f.a))},t.\u0275cmp=p.Fb({type:t,selectors:[["app-home"]],decls:11,vars:2,consts:[[1,"animated","fadeIn","p-2",2,"min-width","18rem","max-width","30rem"],[1,"jumbotron","animated","fadeIn"],[1,"lead"],["class","card bg-danger text-white p-2 my-4",4,"ngIf"],[4,"ngIf"],[1,"my-4"],["routerLink","/assistant/dashboard","role","button",1,"btn","btn-primary","btn-lg","btn-block"],[1,"card","bg-danger","text-white","p-2","my-4"],["class","my-4",4,"ngIf"],[4,"ngFor","ngForOf"],["role","button",1,"btn","btn-success","btn-lg","m-1",3,"click"],["role","button",1,"btn","btn-danger","btn-lg","m-1",3,"click"],["appearance","fill"],["matNativeControl","","required",""],["selectDesktop",""],[3,"value",4,"ngFor","ngForOf"],["role","button",1,"btn","btn-success","btn-lg","btn-block",3,"click"],[3,"value"]],template:function(t,e){1&t&&(p.Rb(0,"div",0),p.Rb(1,"div",1),p.Rb(2,"p",2),p.tc(3,"Bienvenido, desde aqu\xed puede tomar escritorios y atender turnos."),p.Qb(),p.sc(4,x,2,0,"div",3),p.sc(5,Y,4,3,"div",4),p.Mb(6,"hr",5),p.Rb(7,"p"),p.tc(8," Recuerde que si se ausenta del escritorio debe finalizar la sesi\xf3n del escritorio. Si usted finaliza la sesi\xf3n de user se finalizar\xe1 tambi\xe9n la sesi\xf3n del escritorio. Si la sesi\xf3n del escritorio ten\xeda asignada una sesi\xf3n de turno, este turno finalizar\xe1. "),p.Qb(),p.Rb(9,"a",6),p.tc(10,"Dashboard"),p.Qb(),p.Qb(),p.Qb()),2&t&&(p.zb(4),p.gc("ngIf",0===(null==e.desktops?null:e.desktops.length)),p.zb(1),p.gc("ngIf",(null==e.desktops?null:e.desktops.length)>0))},directives:[s.j,c.d,s.i,z.c,z.f,I.a,D.h],styles:[""]}),t})()},{path:"desktop",component:T},{path:"dashboard",component:(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=p.Fb({type:t,selectors:[["app-dashboard"]],decls:4,vars:0,consts:[[1,"container","animated","fadeIn"],[1,"row"],[1,"col"]],template:function(t,e){1&t&&(p.Rb(0,"div",0),p.Rb(1,"div",1),p.Rb(2,"div",2),p.tc(3," Working on it "),p.Qb(),p.Qb(),p.Qb())},styles:[""]}),t})()},{path:"",redirectTo:"/assistant/home",pathMatch:"full"},{path:"**",component:_.a}];let B=(()=>{class t{}return t.\u0275mod=p.Jb({type:t}),t.\u0275inj=p.Ib({factory:function(e){return new(e||t)},imports:[[c.e.forChild(W)],c.e]}),t})();var M=i("1+r1");let N=(()=>{class t{}return t.\u0275mod=p.Jb({type:t}),t.\u0275inj=p.Ib({factory:function(e){return new(e||t)},imports:[[s.b,M.a,B]]}),t})()}}]);