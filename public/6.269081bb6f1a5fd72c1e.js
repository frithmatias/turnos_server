(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{"1c7N":function(e,t,c){"use strict";c.r(t),c.d(t,"PublicModule",(function(){return P}));var i=c("SVse"),n=c("s7LF"),s=c("iInd"),a=c("8Y7J"),r=c("Gyf/"),o=c("TGE+"),b=c("zHaW");function l(e,t){1&e&&(a.Rb(0,"h5",9),a.Rb(1,"span",10),a.sc(2," Cargando... "),a.Qb(),a.Qb())}function d(e,t){if(1&e&&(a.Rb(0,"div"),a.Rb(1,"p",11),a.sc(2," \xa1Bienvenido! Usted esta por sacar un turno para ser atendido en "),a.Qb(),a.Rb(3,"div",12),a.Rb(4,"p",13),a.sc(5),a.Qb(),a.Rb(6,"p",14),a.sc(7),a.Qb(),a.Qb(),a.Qb()),2&e){const e=a.ac(2);a.zb(5),a.uc(" ",e.ticketsService.companyData.tx_company_name," "),a.zb(2),a.wc(" ",e.ticketsService.companyData.tx_address_street," ",e.ticketsService.companyData.tx_address_number," ",e.ticketsService.companyData.cd_city," ")}}function u(e,t){if(1&e){const e=a.Sb();a.Rb(0,"button",15),a.Yb("click",(function(){a.lc(e);const c=t.$implicit;return a.ac(2).nuevoTicket(c._id,c.cd_skill)})),a.sc(1),a.Qb()}if(2&e){const e=t.$implicit;a.zb(1),a.uc(" ",e.tx_skill," ")}}function m(e,t){if(1&e){const e=a.Sb();a.Rb(0,"div"),a.rc(1,l,3,0,"h5",5),a.rc(2,d,8,4,"div",4),a.rc(3,u,2,1,"button",6),a.Rb(4,"button",7),a.sc(5,"Pantalla"),a.Qb(),a.Rb(6,"button",8),a.Yb("click",(function(){return a.lc(e),a.ac().salir()})),a.sc(7,"Salir"),a.Qb(),a.Qb()}if(2&e){const e=a.ac();a.zb(1),a.fc("ngIf",e.loading),a.zb(1),a.fc("ngIf",!e.loading),a.zb(1),a.fc("ngForOf",e.skills)}}let p=(()=>{class e{constructor(e,t,c,i){this.wsService=e,this.ticketsService=t,this.router=c,this.snack=i,this.loading=!1}ngOnInit(){if(this.ticketsService.myTicket)this.snack.open("Usted ya tiene un turno!",null,{duration:5e3}),this.router.navigate(["/public/screen"]);else if(this.ticketsService.companyData){let e=this.ticketsService.companyData._id;this.wsService.emit("enterCompany",e),this.ticketsService.readSkills(e).subscribe(e=>{this.skills=e.skills})}else this.snack.open("Por favor ingrese una empresa primero.",null,{duration:5e3}),this.router.navigate(["/public"])}nuevoTicket(e,t){this.loading=!0,this.ticketsService.nuevoTicket(this.ticketsService.companyData._id,e,t,this.wsService.idSocket).subscribe(e=>{e.ok&&(localStorage.setItem("ticket",JSON.stringify(e.ticket)),this.ticketsService.myTicket=e.ticket,this.loading=!1,this.router.navigate(["/public/screen"]))})}salir(){localStorage.getItem("company")&&localStorage.removeItem("company"),this.router.navigate(["/public"])}}return e.\u0275fac=function(t){return new(t||e)(a.Lb(r.a),a.Lb(o.a),a.Lb(s.b),a.Lb(b.a))},e.\u0275cmp=a.Fb({type:e,selectors:[["app-tickets"]],decls:6,vars:1,consts:[[1,"turno-container","p-2","animated","fadeIn",2,"text-align","-webkit-center"],[1,"card","bg-light","mb-3",2,"min-width","18rem","max-width","30rem"],[1,"card-header"],[1,"card-body"],[4,"ngIf"],["class","card-title",4,"ngIf"],["class","btn btn-primary btn-block btn-lg",3,"click",4,"ngFor","ngForOf"],["routerLink","/public/screen",1,"btn","btn-info","btn-lg","btn-block"],[1,"btn","btn-danger","btn-block","btn-lg",3,"click"],[1,"card-title"],["id","lblNuevoTicket"],[1,"lead"],[1,"card","border-success","py-4","my-4"],[1,"text-company"],[2,"color","darkblue","font-size","1rem","font-weight","400"],[1,"btn","btn-primary","btn-block","btn-lg",3,"click"]],template:function(e,t){1&e&&(a.Rb(0,"div",0),a.Rb(1,"div",1),a.Rb(2,"div",2),a.sc(3,"OBTENER TURNO"),a.Qb(),a.Rb(4,"div",3),a.rc(5,m,8,3,"div",4),a.Qb(),a.Qb(),a.Qb()),2&e&&(a.zb(5),a.fc("ngIf",t.ticketsService.companyData))},directives:[i.j,i.i,s.c],styles:[".turno-container[_ngcontent-%COMP%]{max-width:100%;height:100%;justify-content:center;text-align:center;background-color:#fff}"]}),e})();var k=c("qfBg"),v=c("Tj54");function f(e,t){if(1&e&&(a.Rb(0,"div"),a.Rb(1,"span",7),a.sc(2),a.Qb(),a.Qb()),2&e){const e=a.ac(2);a.zb(2),a.vc(" ",null==e.ticketsService.myTicket?null:e.ticketsService.myTicket.cd_skill," ",null==e.ticketsService.myTicket?null:e.ticketsService.myTicket.id_ticket," ")}}function g(e,t){if(1&e&&(a.Rb(0,"div",18),a.Rb(1,"div",12),a.Rb(2,"div",13),a.sc(3," Por favor pase por el escritorio "),a.Qb(),a.Qb(),a.Rb(4,"div",12),a.Rb(5,"div",19),a.sc(6),a.Qb(),a.Qb(),a.Qb()),2&e){const e=a.ac(2);a.zb(6),a.uc(" ",null==e.ticketsService.myTicket?null:e.ticketsService.myTicket.cd_desk," ")}}function h(e,t){1&e&&(a.Rb(0,"div",18),a.Rb(1,"div",20),a.Rb(2,"div",21),a.sc(3,"Su turno ha finalizado"),a.Qb(),a.Qb(),a.Qb())}function y(e,t){if(1&e&&(a.Rb(0,"div",15),a.Rb(1,"div",4),a.sc(2,"SU TURNO"),a.Qb(),a.Rb(3,"div",16),a.rc(4,f,3,2,"div",6),a.rc(5,g,7,1,"div",17),a.rc(6,h,4,0,"div",17),a.Qb(),a.Qb()),2&e){const e=a.ac();a.zb(4),a.fc("ngIf",!(null!=e.ticketsService.myTicket&&e.ticketsService.myTicket.id_desk)),a.zb(1),a.fc("ngIf",null==e.ticketsService.myTicket?null:e.ticketsService.myTicket.id_desk),a.zb(1),a.fc("ngIf",!e.ticketsService.myTicket&&e.ticketsService.myTicket_end)}}function S(e,t){1&e&&(a.Rb(0,"div"),a.Rb(1,"span",7),a.sc(2," -- -- "),a.Qb(),a.Qb())}function R(e,t){1&e&&(a.Rb(0,"tr"),a.Rb(1,"td"),a.sc(2,"--"),a.Qb(),a.Mb(3,"td"),a.Rb(4,"td"),a.sc(5,"--"),a.Qb(),a.Qb())}function Q(e,t){1&e&&(a.Rb(0,"span",25),a.Rb(1,"mat-icon"),a.sc(2,"check"),a.Qb(),a.Qb())}function T(e,t){if(1&e&&(a.Rb(0,"tr"),a.Rb(1,"td",22),a.sc(2),a.Qb(),a.Rb(3,"td",23),a.rc(4,Q,3,0,"span",24),a.Qb(),a.Rb(5,"td",22),a.sc(6),a.Qb(),a.Qb()),2&e){const e=t.$implicit;a.zb(2),a.vc(" ",e.cd_skill,"",e.id_ticket,""),a.zb(2),a.fc("ngIf",e.tm_end),a.zb(2),a.tc(e.cd_desk)}}function w(e,t){if(1&e){const e=a.Sb();a.Rb(0,"div",26),a.Rb(1,"button",27),a.Yb("click",(function(){return a.lc(e),a.ac().cancelTicket()})),a.sc(2,"Cancelar Turno"),a.Qb(),a.Rb(3,"button",28),a.Yb("click",(function(){return a.lc(e),a.ac().enCamino()})),a.sc(4,"en camino"),a.Qb(),a.Qb()}if(2&e){const e=a.ac();a.zb(3),a.fc("disabled",!(null!=e.ticketsService.myTicket&&e.ticketsService.myTicket.id_desk)||e.coming)}}let I=(()=>{class e{constructor(e,t,c,i,n){this.wsService=e,this.ticketsService=t,this.userService=c,this.snack=i,this.router=n,this.loading=!1,this.coming=!1,this.publicMode=!1}ngOnInit(){this.coming=!1,document.getElementsByTagName("body")[0].classList.remove("container"),this.userService.usuario||(this.ticketsService.companyData||(this.router.navigate(["/public"]),this.snack.open("Por favor ingrese una empresa primero!",null,{duration:5e3})),this.publicMode=!0),this.ticketsService.getTickets()}toggle(e){e.toggle()}enCamino(){this.coming=!0,this.wsService.emit("cliente-en-camino",this.ticketsService.myTicket.id_socket_desk)}cancelTicket(){this.snack.open("Desea cancelar el turno?","SI, CANCELAR",{duration:5e3}).afterDismissed().subscribe(e=>{e.dismissedByAction&&this.ticketsService.cancelTicket(this.ticketsService.myTicket._id).subscribe(e=>{e.ok&&(this.snack.open(e.msg,"ACEPTAR",{duration:5e3}),this.ticketsService.clearPublicSession(),this.router.navigate(["/public"]))})})}}return e.\u0275fac=function(t){return new(t||e)(a.Lb(r.a),a.Lb(o.a),a.Lb(k.a),a.Lb(b.a),a.Lb(s.b))},e.\u0275cmp=a.Fb({type:e,selectors:[["app-screen"]],decls:29,vars:7,consts:[[1,"row","p-3","animated","fadeIn"],[1,"col-md-6"],["class","card text-white bg-success mb-4",4,"ngIf"],[1,"card","text-white","bg-danger","mb-4"],[1,"card-header","banner-title"],[1,"banner-content",2,"background-color","rgb(141, 51, 51)"],[4,"ngIf"],[1,"xxxxl"],[1,"card","text-white","bg-primary","mb-4"],[1,"card-body","card-tickets-info","table-responsive-sm",2,"background-color","rgb(54, 77, 194)"],[1,"table","table","text-white","text-center",2,"font-size","x-large"],[4,"ngFor","ngForOf"],[1,"row"],[1,"col"],["class","text-center footer-panel",4,"ngIf"],[1,"card","text-white","bg-success","mb-4"],[1,"banner-content",2,"background-color","rgb(51, 141, 51)"],["class","banner-content",4,"ngIf"],[1,"banner-content"],[1,"col","xxxxl"],[1,"container"],[1,"text-white","my-4","py-2"],[2,"text-align","center","width","50%"],[2,"padding","0","vertical-align","middle"],["style","color: greenyellow",4,"ngIf"],[2,"color","greenyellow"],[1,"text-center","footer-panel"],[1,"btn","btn-danger","text-uppercase","m-2",3,"click"],[1,"btn","btn-success","text-uppercase","m-2",3,"disabled","click"]],template:function(e,t){1&e&&(a.Rb(0,"div",0),a.Rb(1,"div",1),a.rc(2,y,7,3,"div",2),a.Rb(3,"div",3),a.Rb(4,"div",4),a.sc(5,"ULTIMO TURNO"),a.Qb(),a.Rb(6,"div",5),a.rc(7,S,3,0,"div",6),a.Rb(8,"div"),a.Rb(9,"span",7),a.sc(10),a.Qb(),a.Qb(),a.Qb(),a.Qb(),a.Mb(11,"div"),a.Qb(),a.Rb(12,"div",1),a.Rb(13,"div",8),a.Rb(14,"div",4),a.sc(15,"HISTORIAL DE LLAMADOS"),a.Qb(),a.Rb(16,"div",9),a.Rb(17,"table",10),a.Rb(18,"tr"),a.Rb(19,"td"),a.sc(20," Turno "),a.Qb(),a.Mb(21,"td"),a.Rb(22,"td"),a.sc(23," Escritorio "),a.Qb(),a.Qb(),a.rc(24,R,6,0,"tr",6),a.rc(25,T,7,4,"tr",11),a.Qb(),a.Qb(),a.Qb(),a.Qb(),a.Qb(),a.Rb(26,"div",12),a.Rb(27,"div",13),a.rc(28,w,5,1,"div",14),a.Qb(),a.Qb()),2&e&&(a.zb(2),a.fc("ngIf",t.ticketsService.myTicket),a.zb(5),a.fc("ngIf",!t.ticketsService.lastTicket),a.zb(3),a.vc(" ",null==t.ticketsService.lastTicket?null:t.ticketsService.lastTicket.cd_skill," ",null==t.ticketsService.lastTicket?null:t.ticketsService.lastTicket.id_ticket," "),a.zb(14),a.fc("ngIf",0===t.ticketsService.ticketsTail.length),a.zb(1),a.fc("ngForOf",t.ticketsService.ticketsTail),a.zb(3),a.fc("ngIf",t.ticketsService.myTicket))},directives:[i.j,i.i,v.a],styles:[".example-button-container[_ngcontent-%COMP%]{display:flex;justify-content:right;width:120px}"]}),e})();var _=c("Q2Ze"),x=c("e6WT"),z=c("vrAh"),C=c("UhP/");function L(e,t){if(1&e&&(a.Rb(0,"mat-option",16),a.sc(1),a.Qb()),2&e){const e=t.$implicit;a.fc("value",e),a.zb(1),a.uc(" ",e.tx_company_name," ")}}function O(e,t){if(1&e){const e=a.Sb();a.Rb(0,"div",3),a.Rb(1,"h1",4),a.sc(2,"Ingrese la empresa"),a.Qb(),a.Rb(3,"p",5),a.sc(4," Puede utilizar el buscador o ingresar directamente a la empresa ingresando a su web p\xfablica por ejemplo:"),a.Mb(5,"br"),a.Rb(6,"b"),a.sc(7,"webturnos.herokuapp.com/public/suempresa"),a.Qb(),a.Qb(),a.Mb(8,"hr",6),a.Rb(9,"div",7),a.Rb(10,"mat-form-field",8),a.Rb(11,"mat-label"),a.sc(12,"Ingrese la empresa"),a.Qb(),a.Rb(13,"input",9,10),a.Yb("keyup",(function(){a.lc(e);const t=a.kc(14);return a.ac().findCompany(t)})),a.Qb(),a.Rb(15,"span",11),a.Mb(16,"i",12),a.Qb(),a.Qb(),a.Rb(17,"mat-autocomplete",13,14),a.Yb("optionSelected",(function(t){return a.lc(e),a.ac().setCompany(t.option.value)})),a.rc(19,L,2,2,"mat-option",15),a.Qb(),a.Qb(),a.Qb()}if(2&e){const e=a.kc(18),t=a.ac();a.zb(13),a.fc("matAutocomplete",e)("value",null==t.companySelected?null:t.companySelected.tx_company_name),a.zb(6),a.fc("ngForOf",t.companies)}}function A(e,t){if(1&e){const e=a.Sb();a.Rb(0,"div",3),a.Rb(1,"p",17),a.sc(2," Usted esta por ir hacia la recepci\xf3n de turnos de "),a.Qb(),a.Rb(3,"div",18),a.Rb(4,"p",19),a.sc(5),a.Qb(),a.Rb(6,"p",20),a.sc(7),a.Qb(),a.Qb(),a.Rb(8,"button",21),a.Yb("click",(function(){return a.lc(e),a.ac().goToCompany()})),a.sc(9),a.Qb(),a.Rb(10,"button",22),a.Yb("click",(function(){return a.lc(e),a.ac().companySelected=null})),a.sc(11," Volver "),a.Qb(),a.Qb()}if(2&e){const e=a.ac();a.zb(5),a.uc(" ",e.companySelected.tx_company_name," "),a.zb(2),a.wc(" ",e.companySelected.tx_address_street," ",e.companySelected.tx_address_number," ",e.companySelected.cd_city," "),a.zb(2),a.uc("Ir hacia ",e.companySelected.tx_company_name," ")}}let D=(()=>{class e{constructor(e,t,c,i){this.router=e,this.ticketsService=t,this.wsService=c,this.snack=i,this.companies=[]}ngOnInit(){}ngAfterViewInit(){document.getElementById("inputCompany").focus()}findCompany(e){e.value.length>1&&this.ticketsService.findCompany(e.value).subscribe(t=>{t.ok?this.companies=t.companies:(e.value="",this.snack.open("No existen resultados.",null,{duration:1e3}))},()=>{this.snack.open("Ocurrio un error al buscar la empresa",null,{duration:2e3})})}goToCompany(){this.companySelected&&(localStorage.setItem("company",JSON.stringify(this.companySelected)),this.ticketsService.companyData=this.companySelected,this.router.navigate(["/public/",this.companySelected.tx_public_name]))}setCompany(e){this.companySelected=e}}return e.\u0275fac=function(t){return new(t||e)(a.Lb(s.b),a.Lb(o.a),a.Lb(r.a),a.Lb(b.a))},e.\u0275cmp=a.Fb({type:e,selectors:[["app-search"]],decls:4,vars:2,consts:[[1,"turno-container","p-2","animated","fadeIn",2,"text-align","-webkit-center"],[1,"card","bg-light","mb-3",2,"min-width","18rem","max-width","30rem"],["class","jumbotron m-2",4,"ngIf"],[1,"jumbotron","m-2"],[1,"display-4"],[1,"p-3",2,"background-color","whitesmoke","border-radius",".2rem"],[1,"my-4"],[1,"my-2"],["color","warn","appearance","fill","logincss","",1,"w-100"],["id","inputCompany","matInput","","placeholder","Empresa S.A.",3,"matAutocomplete","value","keyup"],["inputCompany",""],[1,"input-icon"],[1,"mdi","mdi-close"],[3,"optionSelected"],["auto","matAutocomplete"],[3,"value",4,"ngFor","ngForOf"],[3,"value"],[1,"lead"],[1,"card","border-success","py-4","my-4"],[1,"text-company"],[2,"color","darkblue","font-size","1rem","font-weight","400"],[1,"btn","btn-success","btn-lg","btn-block",3,"click"],[1,"btn","btn-danger","btn-lg","btn-block",3,"click"]],template:function(e,t){1&e&&(a.Rb(0,"div",0),a.Rb(1,"div",1),a.rc(2,O,20,3,"div",2),a.rc(3,A,12,5,"div",2),a.Qb(),a.Qb()),2&e&&(a.zb(2),a.fc("ngIf",!t.companySelected),a.zb(1),a.fc("ngIf",t.companySelected))},directives:[i.j,_.c,_.f,x.a,z.c,z.a,i.i,C.h],styles:[""]}),e})();var F=c("AIE+");const M=[{path:"tickets",component:p},{path:"screen",component:I},{path:"",component:D},{path:":userCompanyName",component:c("R44i").a},{path:"**",component:F.a}];let j=(()=>{class e{}return e.\u0275mod=a.Jb({type:e}),e.\u0275inj=a.Ib({factory:function(t){return new(t||e)},imports:[[s.e.forChild(M)],s.e]}),e})();var N=c("1+r1"),E=c("j1ZV");let P=(()=>{class e{}return e.\u0275mod=a.Jb({type:e}),e.\u0275inj=a.Ib({factory:function(t){return new(t||e)},imports:[[i.b,n.q,n.h,N.a,E.a,j]]}),e})()}}]);