const express = require("express");
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../../helpers/auth");

let date = require("date-and-time");


module.exports = (function () {

  'use strict';
  var posBranch_1 = require('express').Router();

  // Admin Panel
  posBranch_1.get("/adminPanel", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'RedPigeons') {
      POS_TodaySale.find({})
        .then(pos_TodaySale => {
          res.render("pos/posBranch_1/adminPanel", {
            pos_TodaySale: pos_TodaySale,
            name: req.user.name,
          });
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // Take Order posBranch_1 (Brach to POS)
  posBranch_1.get("/takeOrder", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS.find({ branchName: req.user.branchName /**/ })
        .sort({ _id: -1 })
        .limit(1)
        .then(pos => {
          POS_TodaySale.find({ branchName: req.user.branchName /**/ })
            .then(pos_TodaySale => {
              Menu.find({ branchName: req.user.branchName /**/ })
                .sort({ _id: -1 })
                .limit(1)
                .then(menu => {
                  POS.find({ orderStatus: "Pending Bill", branchName: req.user.branchName /**/ })
                    .then(posForTable => {
                      res.render("pos/posBranch_1/takeOrder", {
                        pos_TodaySale: pos_TodaySale,
                        pos: pos,
                        menu: menu,
                        posForTable: posForTable,
                        name: req.user.name,
                        branchToShow: req.user.branchName /**/
                      });
                    });
                });
            });
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // Pending Bills Log + Search
  posBranch_1.get("/pendingBillLog", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      if (req.query.searchType) {
        var z = req.query.searchType;

        if (req.query.search) {
          const regex = new RegExp(escapeRegex(req.query.search), "gi");

          POS.find({ [z]: regex, orderStatus: "Pending Bill", branchName: req.user.branchName /**/ }, function (err, pos) {
            if (err) {
              console.log(err);
            } else {
              Menu.find({ branchName: req.user.branchName /**/ })
                .sort({ _id: -1 })
                .limit(1)
                .then(menu => {
                  res.render("pos/posBranch_1/pendingBillLog", {
                    pos: pos,
                    menu: menu,
                    name: req.user.name,
                    branchToShow: req.user.branchName /**/
                  });
                });
            }
          });
        }
      } else {
        POS.find({ orderStatus: "Pending Bill", branchName: req.user.branchName /**/ })
          .sort({ _id: -1 })
          .then(pos => {
            Menu.find({ branchName: req.user.branchName /**/ })
              .sort({ _id: -1 })
              .limit(1)
              .then(menu => {
                res.render("pos/posBranch_1/pendingBillLog", {
                  pos: pos,
                  menu: menu,
                  name: req.user.name,
                  branchToShow: req.user.branchName /**/
                });
              });
          });
      }
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // Paid Bills Log + Search
  posBranch_1.get("/paidBillLog", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      if (req.query.searchType) {
        var z = req.query.searchType;

        if (req.query.search) {
          const regex = new RegExp(escapeRegex(req.query.search), "gi");

          POS.find({ [z]: regex, orderStatus: "Paid Bill ✔", branchName: req.user.branchName /**/ }, function (err, pos) {
            if (err) {
              console.log(err);
            } else {
              res.render("pos/posBranch_1/paidBillLog", {
                pos: pos,
                name: req.user.name,
                branchToShow: req.user.branchName /**/
              });
            }
          });
        }
      } else {
        POS.find({ orderStatus: "Paid Bill ✔", branchName: req.user.branchName /**/ })
          .sort({ _id: -1 })
          .then(pos => {
            res.render("pos/posBranch_1/paidBillLog", {
              pos: pos,
              name: req.user.name,
              branchToShow: req.user.branchName /**/
            });
          });
      }
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // bill View Order
  posBranch_1.get("/billViewOrder/:id", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS.find({ _id: req.params.id, branchName: req.user.branchName /**/ }).then(pos => {
        res.render("pos/posBranch_1/billViewOrder", {
          pos: pos,
          name: req.user.name,
          branchToShow: req.user.branchName /**/
        });
      });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // bill Invoice Order
  posBranch_1.get("/billInvoiceOrder/:id", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS.find({ _id: req.params.id, branchName: req.user.branchName /**/ }).then(pos => {
        res.render("pos/posBranch_1/billInvoiceOrder", {
          pos: pos,
          name: req.user.name,
          branchToShow: req.user.branchName /**/
        });
      });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // bill Paid Order
  posBranch_1.get("/billPaidOrder/:id", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS.find({ _id: req.params.id, branchName: req.user.branchName /**/ }).then(pos => {
        res.render("pos/posBranch_1/billPaidOrder", {
          pos: pos,
          name: req.user.name,
          branchToShow: req.user.branchName /**/
        });
      });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // bill Bar Order Ticket
  posBranch_1.get("/billBarOrderTicket", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS.find({ /* _id: req.params.id, */ branchName: req.user.branchName /**/ })
        .sort({ _id: -1 })
        .limit(1)
        .then(pos => {

          res.render("pos/posBranch_1/billBarOrderTicket", {
            pos: pos,
            name: req.user.name,
            branchToShow: req.user.branchName /**/
          });
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // bill Kitchen Order Ticket
  posBranch_1.get("/billKitchenOrderTicket", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {
      POS.find({/*  _id: req.params.id, */ branchName: req.user.branchName /**/ })
        .sort({ _id: -1 })
        .limit(1)
        .then(pos => {
          res.render("pos/posBranch_1/billKitchenOrderTicket", {
            pos: pos,
            name: req.user.name,
            branchToShow: req.user.branchName /**/
          });
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });


  // Today Sale posBranch_1 
  posBranch_1.get('/admin_BillTodaySaleReport/:id', ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS_TodaySale.find({ _id: req.params.id })
        .sort({ _id: -1 })
        .limit(1)
        .then(pos_TodaySale => {
          res.render('pos/posBranch_1/billTodaySaleReport', {
            pos_TodaySale: pos_TodaySale,
            name: req.user.name,
            branchToShow: req.user.branchName /**/
          });
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

    


  // Process Form Taking Order
  posBranch_1.post("/", ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      var v_countNetAmountMenuBaked = 0, v_countNetAmountMenuFried = 0, v_countNetAmountMenuBar = 0;

      var v_countNetAmount = 0;
      var first = "a", last = "z";
      var v_unversalOrderNumber = 0;

      let errors = [];

      function POS_TodaySaleCount(
        string_Check_Name, string_Check_Quantity, string_Check_TotalPrice, string_Check_Type
      ) {
        // today POS Sale Start
        POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
          POS_TodaySale => {



            /* var fields =  req.body[string_Check_Name].split(',');

            var name = fields[0];
            var street = fields[1];

            console.log(`(${name}) and (${street}) with length ${fields.length} `);
 */
            console.log(req.body[string_Check_Name].split(','));

            POS_TodaySale[string_Check_Name] = req.body[string_Check_Name];
            POS_TodaySale[string_Check_Quantity] += parseInt(req.body[string_Check_Quantity]);
            POS_TodaySale[string_Check_TotalPrice] += parseInt(req.body[string_Check_TotalPrice]);
            POS_TodaySale[req.body[string_Check_Type]] += parseInt(req.body[string_Check_Quantity]);

            switch (req.body[string_Check_Type]) {
              case "menuBaked":
                POS_TodaySale.countMenuBaked += v_countNetAmountMenuBaked;
                break;
              case "menuFried":
                POS_TodaySale.countMenuFried += v_countNetAmountMenuFried;
                break;
              case "menuBar":
                POS_TodaySale.countMenuBar += v_countNetAmountMenuBar;
                break;
              default:
                POS_TodaySale.countMenuBaked += v_countNetAmountMenuBaked;
            }

            POS_TodaySale.save();
          }
        );
      }

      ///////////////////////////////////////////////////////////////////////////////////////////////////
      //**********************   Loop for A section item Count Data   **********************//  a1Quantity_Deal
      for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
        for (var i = 0; i <= 90; i++) {
          var string_Check_Name = eval("String.fromCharCode(" + j + ")") + i + "Name";
          var string_Check_Type = eval("String.fromCharCode(" + j + ")") + i + "Type";
          var string_Check_Quantity = eval("String.fromCharCode(" + j + ")") + i + "Quantity";
          var string_Check_TotalPrice = eval("String.fromCharCode(" + j + ")") + i + "TotalPrice";

          if (req.body[string_Check_Quantity] != null) {
            v_countNetAmount += parseInt(req.body[string_Check_TotalPrice]);

            switch (req.body[string_Check_Type]) {
              case "menuBaked":
                v_countNetAmountMenuBaked += parseInt(req.body[string_Check_TotalPrice]);
                break;
              case "menuFried":
                v_countNetAmountMenuFried += parseInt(req.body[string_Check_TotalPrice]);
                break;
              case "menuBar":
                v_countNetAmountMenuBar += parseInt(req.body[string_Check_TotalPrice]);
                break;
              default:
                v_countNetAmountMenuBaked += parseInt(req.body[string_Check_TotalPrice]);
            }
            POS_TodaySaleCount(string_Check_Name, string_Check_Quantity, string_Check_TotalPrice, string_Check_Type);
          }
        }
      }

      Menu.findOne({ branchName: req.user.branchName /**/ })
        .sort({ _id: -1 })
        .limit(1)
        .then(
          menu => {

            switch (req.body.severName) {
              case menu.serverName1:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName1 = menu.serverName1;
                    POS_TodaySale.countOrder_serverName1 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName2:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName2 = menu.serverName2;
                    POS_TodaySale.countOrder_serverName2 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName3:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName3 = menu.serverName3;
                    POS_TodaySale.countOrder_serverName3 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName4:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName4 = menu.serverName4;
                    POS_TodaySale.countOrder_serverName4 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName5:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName5 = menu.serverName5;
                    POS_TodaySale.countOrder_serverName5 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName6:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName6 = menu.serverName6;
                    POS_TodaySale.countOrder_serverName6 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName7:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName7 = menu.serverName7;
                    POS_TodaySale.countOrder_serverName7 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName8:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName8 = menu.serverName8;
                    POS_TodaySale.countOrder_serverName8 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName9:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName9 = menu.serverName9;
                    POS_TodaySale.countOrder_serverName9 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName10:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName10 = menu.serverName10;
                    POS_TodaySale.countOrder_serverName10 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName11:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName11 = menu.serverName11;
                    POS_TodaySale.countOrder_serverName11 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName12:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName12 = menu.serverName12;
                    POS_TodaySale.countOrder_serverName12 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName13:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName13 = menu.serverName13;
                    POS_TodaySale.countOrder_serverName13 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName14:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName14 = menu.serverName14;
                    POS_TodaySale.countOrder_serverName14 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName15:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName15 = menu.serverName15;
                    POS_TodaySale.countOrder_serverName15 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName16:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName16 = menu.serverName16;
                    POS_TodaySale.countOrder_serverName16 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName17:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName17 = menu.serverName17;
                    POS_TodaySale.countOrder_serverName17 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName18:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName18 = menu.serverName18;
                    POS_TodaySale.countOrder_serverName18 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName19:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName19 = menu.serverName19;
                    POS_TodaySale.countOrder_serverName19 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;
              case menu.serverName20:
                POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
                  POS_TodaySale => {
                    POS_TodaySale.serverName20 = menu.serverName20;
                    POS_TodaySale.countOrder_serverName20 += parseInt(1);
                    POS_TodaySale.save();
                  });
                break;

            }
          }
        );
      /* 
              console.log('hello');
              console.log(req.body); */

      POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
        POS_TodaySale => {
          POS_TodaySale.countNetAmount += v_countNetAmount;
          POS_TodaySale.countPendingCash += parseInt(v_countNetAmount + parseInt(v_countNetAmount * ((req.body.GST) / 100)));

          POS_TodaySale.orderNumberTodaySale += 1;
          POS_TodaySale.countOrders += 1;
          POS_TodaySale.countCovers += parseInt(req.body.cover);

          POS_TodaySale.save();
        }
      );
      //**********************   Ending Loop for A section item Count Data   **********************//
      ///////////////////////////////////////////////////////////////////////////////////////////////////

      if (errors.length > 0) {
        res.render("/pos/posBranch_1/takeOrder", {
          a0Name: req.body.a0Name,
          a1Name: req.body.a1Name,
          a0Price: req.body.a0Price,
          a1Price: req.body.a1Price,
          a0Quantity: req.body.a0Quantity,
          a1Quantity: req.body.a1Quantity
        });
      } else {
        v_unversalOrderNumber = req.body.orderNumberUniversal;
        v_unversalOrderNumber++;

        const newOrder = {
          orderNumber: req.body.orderNumber,
          orderNumberBranchShow: req.body.orderNumber + "_" + req.user.branchName,
          branchName: req.user.branchName,
          orderNumberUniversal: v_unversalOrderNumber,

          orderType: req.body.orderType,
          tableNo: req.body.tableNo,
          cover: req.body.cover,
          severName: req.body.severName,
          cashierName: req.body.cashierName,
          posSuggestionForKitchen: req.body.posSuggestionForKitchen,
          posSuggestionForBar: req.body.posSuggestionForBar,

          orderStatus: "Pending Bill",
          invoiceStatus: "Invoice | Disc",

          a0Name: req.body.a0Name,
          a1Name: req.body.a1Name,
          a2Name: req.body.a2Name,
          a3Name: req.body.a3Name,
          a4Name: req.body.a4Name,
          a5Name: req.body.a5Name,
          a6Name: req.body.a6Name,
          a7Name: req.body.a7Name,
          a8Name: req.body.a8Name,
          a9Name: req.body.a9Name,
          a10Name: req.body.a10Name,
          a11Name: req.body.a11Name,
          a12Name: req.body.a12Name,
          a13Name: req.body.a13Name,
          a14Name: req.body.a14Name,
          a15Name: req.body.a15Name,
          a16Name: req.body.a16Name,
          a17Name: req.body.a17Name,
          a18Name: req.body.a18Name,
          a19Name: req.body.a19Name,
          a20Name: req.body.a20Name,
          a21Name: req.body.a21Name,
          a22Name: req.body.a22Name,
          a23Name: req.body.a23Name,
          a24Name: req.body.a24Name,
          a25Name: req.body.a25Name,
          a26Name: req.body.a26Name,
          a27Name: req.body.a27Name,
          a28Name: req.body.a28Name,
          a29Name: req.body.a29Name,
          a30Name: req.body.a30Name,
          a31Name: req.body.a31Name,
          a32Name: req.body.a32Name,
          a33Name: req.body.a33Name,
          a34Name: req.body.a34Name,
          a35Name: req.body.a35Name,
          a36Name: req.body.a36Name,
          a37Name: req.body.a37Name,
          a38Name: req.body.a38Name,
          a39Name: req.body.a39Name,
          a40Name: req.body.a40Name,
          a41Name: req.body.a41Name,
          a42Name: req.body.a42Name,
          a43Name: req.body.a43Name,
          a44Name: req.body.a44Name,
          a45Name: req.body.a45Name,
          a46Name: req.body.a46Name,
          a47Name: req.body.a47Name,
          a48Name: req.body.a48Name,
          a49Name: req.body.a49Name,
          a50Name: req.body.a50Name,
          a51Name: req.body.a51Name,
          a52Name: req.body.a52Name,
          a53Name: req.body.a53Name,
          a54Name: req.body.a54Name,
          a55Name: req.body.a55Name,
          a56Name: req.body.a56Name,
          a57Name: req.body.a57Name,
          a58Name: req.body.a58Name,
          a59Name: req.body.a59Name,
          a60Name: req.body.a60Name,
          a61Name: req.body.a61Name,
          a62Name: req.body.a62Name,
          a63Name: req.body.a63Name,
          a64Name: req.body.a64Name,
          a65Name: req.body.a65Name,
          a66Name: req.body.a66Name,
          a67Name: req.body.a67Name,
          a68Name: req.body.a68Name,
          a69Name: req.body.a69Name,
          a70Name: req.body.a70Name,
          a71Name: req.body.a71Name,
          a72Name: req.body.a72Name,
          a73Name: req.body.a73Name,
          a74Name: req.body.a74Name,

          b0Name: req.body.b0Name,
          b1Name: req.body.b1Name,
          b2Name: req.body.b2Name,
          b3Name: req.body.b3Name,
          b4Name: req.body.b4Name,
          b5Name: req.body.b5Name,
          b6Name: req.body.b6Name,
          b7Name: req.body.b7Name,
          b8Name: req.body.b8Name,
          b9Name: req.body.b9Name,
          b10Name: req.body.b10Name,
          b11Name: req.body.b11Name,
          b12Name: req.body.b12Name,
          b13Name: req.body.b13Name,
          b14Name: req.body.b14Name,
          b15Name: req.body.b15Name,
          b16Name: req.body.b16Name,
          b17Name: req.body.b17Name,
          b18Name: req.body.b18Name,
          b19Name: req.body.b19Name,
          b20Name: req.body.b20Name,
          b21Name: req.body.b21Name,
          b22Name: req.body.b22Name,
          b23Name: req.body.b23Name,
          b24Name: req.body.b24Name,

          c0Name: req.body.c0Name,
          c1Name: req.body.c1Name,
          c2Name: req.body.c2Name,
          c3Name: req.body.c3Name,
          c4Name: req.body.c4Name,
          c5Name: req.body.c5Name,
          c6Name: req.body.c6Name,
          c7Name: req.body.c7Name,
          c8Name: req.body.c8Name,
          c9Name: req.body.c9Name,
          c10Name: req.body.c10Name,
          c11Name: req.body.c11Name,
          c12Name: req.body.c12Name,
          c13Name: req.body.c13Name,
          c14Name: req.body.c14Name,
          c15Name: req.body.c15Name,
          c16Name: req.body.c16Name,
          c17Name: req.body.c17Name,
          c18Name: req.body.c18Name,
          c19Name: req.body.c19Name,
          c20Name: req.body.c20Name,
          c21Name: req.body.c21Name,
          c22Name: req.body.c22Name,
          c23Name: req.body.c23Name,
          c24Name: req.body.c24Name,

          d0Name: req.body.d0Name,
          d1Name: req.body.d1Name,
          d2Name: req.body.d2Name,
          d3Name: req.body.d3Name,
          d4Name: req.body.d4Name,
          d5Name: req.body.d5Name,
          d6Name: req.body.d6Name,
          d7Name: req.body.d7Name,
          d8Name: req.body.d8Name,
          d9Name: req.body.d9Name,
          d10Name: req.body.d10Name,
          d11Name: req.body.d11Name,
          d12Name: req.body.d12Name,
          d13Name: req.body.d13Name,
          d14Name: req.body.d14Name,
          d15Name: req.body.d15Name,
          d16Name: req.body.d16Name,
          d17Name: req.body.d17Name,
          d18Name: req.body.d18Name,
          d19Name: req.body.d19Name,
          d20Name: req.body.d20Name,
          d21Name: req.body.d21Name,
          d22Name: req.body.d22Name,
          d23Name: req.body.d23Name,
          d24Name: req.body.d24Name,

          e0Name: req.body.e0Name,
          e1Name: req.body.e1Name,
          e2Name: req.body.e2Name,
          e3Name: req.body.e3Name,
          e4Name: req.body.e4Name,
          e5Name: req.body.e5Name,
          e6Name: req.body.e6Name,
          e7Name: req.body.e7Name,
          e8Name: req.body.e8Name,
          e9Name: req.body.e9Name,
          e10Name: req.body.e10Name,
          e11Name: req.body.e11Name,
          e12Name: req.body.e12Name,
          e13Name: req.body.e13Name,
          e14Name: req.body.e14Name,
          e15Name: req.body.e15Name,
          e16Name: req.body.e16Name,
          e17Name: req.body.e17Name,
          e18Name: req.body.e18Name,
          e19Name: req.body.e19Name,
          e20Name: req.body.e20Name,
          e21Name: req.body.e21Name,
          e22Name: req.body.e22Name,
          e23Name: req.body.e23Name,
          e24Name: req.body.e24Name,

          f0Name: req.body.f0Name,
          f1Name: req.body.f1Name,
          f2Name: req.body.f2Name,
          f3Name: req.body.f3Name,
          f4Name: req.body.f4Name,
          f5Name: req.body.f5Name,
          f6Name: req.body.f6Name,
          f7Name: req.body.f7Name,
          f8Name: req.body.f8Name,
          f9Name: req.body.f9Name,
          f10Name: req.body.f10Name,
          f11Name: req.body.f11Name,
          f12Name: req.body.f12Name,
          f13Name: req.body.f13Name,
          f14Name: req.body.f14Name,
          f15Name: req.body.f15Name,
          f16Name: req.body.f16Name,
          f17Name: req.body.f17Name,
          f18Name: req.body.f18Name,
          f19Name: req.body.f19Name,
          f20Name: req.body.f20Name,
          f21Name: req.body.f21Name,
          f22Name: req.body.f22Name,
          f23Name: req.body.f23Name,
          f24Name: req.body.f24Name,

          g0Name: req.body.g0Name,
          g1Name: req.body.g1Name,
          g2Name: req.body.g2Name,
          g3Name: req.body.g3Name,
          g4Name: req.body.g4Name,
          g5Name: req.body.g5Name,
          g6Name: req.body.g6Name,
          g7Name: req.body.g7Name,
          g8Name: req.body.g8Name,
          g9Name: req.body.g9Name,
          g10Name: req.body.g10Name,
          g11Name: req.body.g11Name,
          g12Name: req.body.g12Name,
          g13Name: req.body.g13Name,
          g14Name: req.body.g14Name,
          g15Name: req.body.g15Name,
          g16Name: req.body.g16Name,
          g17Name: req.body.g17Name,
          g18Name: req.body.g18Name,
          g19Name: req.body.g19Name,
          g20Name: req.body.g20Name,
          g21Name: req.body.g21Name,
          g22Name: req.body.g22Name,
          g23Name: req.body.g23Name,
          g24Name: req.body.g24Name,

          h0Name: req.body.h0Name,
          h1Name: req.body.h1Name,
          h2Name: req.body.h2Name,
          h3Name: req.body.h3Name,
          h4Name: req.body.h4Name,
          h5Name: req.body.h5Name,
          h6Name: req.body.h6Name,
          h7Name: req.body.h7Name,
          h8Name: req.body.h8Name,
          h9Name: req.body.h9Name,
          h10Name: req.body.h10Name,
          h11Name: req.body.h11Name,
          h12Name: req.body.h12Name,
          h13Name: req.body.h13Name,
          h14Name: req.body.h14Name,
          h15Name: req.body.h15Name,
          h16Name: req.body.h16Name,
          h17Name: req.body.h17Name,
          h18Name: req.body.h18Name,
          h19Name: req.body.h19Name,
          h20Name: req.body.h20Name,
          h21Name: req.body.h21Name,
          h22Name: req.body.h22Name,
          h23Name: req.body.h23Name,
          h24Name: req.body.h24Name,

          i0Name: req.body.i0Name,
          i1Name: req.body.i1Name,
          i2Name: req.body.i2Name,
          i3Name: req.body.i3Name,
          i4Name: req.body.i4Name,
          i5Name: req.body.i5Name,
          i6Name: req.body.i6Name,
          i7Name: req.body.i7Name,
          i8Name: req.body.i8Name,
          i9Name: req.body.i9Name,
          i10Name: req.body.i10Name,
          i11Name: req.body.i11Name,
          i12Name: req.body.i12Name,
          i13Name: req.body.i13Name,
          i14Name: req.body.i14Name,
          i15Name: req.body.i15Name,
          i16Name: req.body.i16Name,
          i17Name: req.body.i17Name,
          i18Name: req.body.i18Name,
          i19Name: req.body.i19Name,
          i20Name: req.body.i20Name,
          i21Name: req.body.i21Name,
          i22Name: req.body.i22Name,
          i23Name: req.body.i23Name,
          i24Name: req.body.i24Name,

          j0Name: req.body.j0Name,
          j1Name: req.body.j1Name,
          j2Name: req.body.j2Name,
          j3Name: req.body.j3Name,
          j4Name: req.body.j4Name,
          j5Name: req.body.j5Name,
          j6Name: req.body.j6Name,
          j7Name: req.body.j7Name,
          j8Name: req.body.j8Name,
          j9Name: req.body.j9Name,
          j10Name: req.body.j10Name,
          j11Name: req.body.j11Name,
          j12Name: req.body.j12Name,
          j13Name: req.body.j13Name,
          j14Name: req.body.j14Name,
          j15Name: req.body.j15Name,
          j16Name: req.body.j16Name,
          j17Name: req.body.j17Name,
          j18Name: req.body.j18Name,
          j19Name: req.body.j19Name,
          j20Name: req.body.j20Name,
          j21Name: req.body.j21Name,
          j22Name: req.body.j22Name,
          j23Name: req.body.j23Name,
          j24Name: req.body.j24Name,



          a0Price: req.body.a0Price,
          a1Price: req.body.a1Price,
          a2Price: req.body.a2Price,
          a3Price: req.body.a3Price,
          a4Price: req.body.a4Price,
          a5Price: req.body.a5Price,
          a6Price: req.body.a6Price,
          a7Price: req.body.a7Price,
          a8Price: req.body.a8Price,
          a9Price: req.body.a9Price,
          a10Price: req.body.a10Price,
          a11Price: req.body.a11Price,
          a12Price: req.body.a12Price,
          a13Price: req.body.a13Price,
          a14Price: req.body.a14Price,
          a15Price: req.body.a15Price,
          a16Price: req.body.a16Price,
          a17Price: req.body.a17Price,
          a18Price: req.body.a18Price,
          a19Price: req.body.a19Price,
          a20Price: req.body.a20Price,
          a21Price: req.body.a21Price,
          a22Price: req.body.a22Price,
          a23Price: req.body.a23Price,
          a24Price: req.body.a24Price,
          a25Price: req.body.a25Price,
          a26Price: req.body.a26Price,
          a27Price: req.body.a27Price,
          a28Price: req.body.a28Price,
          a29Price: req.body.a29Price,
          a30Price: req.body.a30Price,
          a31Price: req.body.a31Price,
          a32Price: req.body.a32Price,
          a33Price: req.body.a33Price,
          a34Price: req.body.a34Price,
          a35Price: req.body.a35Price,
          a36Price: req.body.a36Price,
          a37Price: req.body.a37Price,
          a38Price: req.body.a38Price,
          a39Price: req.body.a39Price,
          a40Price: req.body.a40Price,
          a41Price: req.body.a41Price,
          a42Price: req.body.a42Price,
          a43Price: req.body.a43Price,
          a44Price: req.body.a44Price,
          a45Price: req.body.a45Price,
          a46Price: req.body.a46Price,
          a47Price: req.body.a47Price,
          a48Price: req.body.a48Price,
          a49Price: req.body.a49Price,
          a50Price: req.body.a50Price,
          a51Price: req.body.a51Price,
          a52Price: req.body.a52Price,
          a53Price: req.body.a53Price,
          a54Price: req.body.a54Price,
          a55Price: req.body.a55Price,
          a56Price: req.body.a56Price,
          a57Price: req.body.a57Price,
          a58Price: req.body.a58Price,
          a59Price: req.body.a59Price,
          a60Price: req.body.a60Price,
          a61Price: req.body.a61Price,
          a62Price: req.body.a62Price,
          a63Price: req.body.a63Price,
          a64Price: req.body.a64Price,
          a65Price: req.body.a65Price,
          a66Price: req.body.a66Price,
          a67Price: req.body.a67Price,
          a68Price: req.body.a68Price,
          a69Price: req.body.a69Price,
          a70Price: req.body.a70Price,
          a71Price: req.body.a71Price,
          a72Price: req.body.a72Price,
          a73Price: req.body.a73Price,
          a74Price: req.body.a74Price,

          b0Price: req.body.b0Price,
          b1Price: req.body.b1Price,
          b2Price: req.body.b2Price,
          b3Price: req.body.b3Price,
          b4Price: req.body.b4Price,
          b5Price: req.body.b5Price,
          b6Price: req.body.b6Price,
          b7Price: req.body.b7Price,
          b8Price: req.body.b8Price,
          b9Price: req.body.b9Price,
          b10Price: req.body.b10Price,
          b11Price: req.body.b11Price,
          b12Price: req.body.b12Price,
          b13Price: req.body.b13Price,
          b14Price: req.body.b14Price,
          b15Price: req.body.b15Price,
          b16Price: req.body.b16Price,
          b17Price: req.body.b17Price,
          b18Price: req.body.b18Price,
          b19Price: req.body.b19Price,
          b20Price: req.body.b20Price,
          b21Price: req.body.b21Price,
          b22Price: req.body.b22Price,
          b23Price: req.body.b23Price,
          b24Price: req.body.b24Price,

          c0Price: req.body.c0Price,
          c1Price: req.body.c1Price,
          c2Price: req.body.c2Price,
          c3Price: req.body.c3Price,
          c4Price: req.body.c4Price,
          c5Price: req.body.c5Price,
          c6Price: req.body.c6Price,
          c7Price: req.body.c7Price,
          c8Price: req.body.c8Price,
          c9Price: req.body.c9Price,
          c10Price: req.body.c10Price,
          c11Price: req.body.c11Price,
          c12Price: req.body.c12Price,
          c13Price: req.body.c13Price,
          c14Price: req.body.c14Price,
          c15Price: req.body.c15Price,
          c16Price: req.body.c16Price,
          c17Price: req.body.c17Price,
          c18Price: req.body.c18Price,
          c19Price: req.body.c19Price,
          c20Price: req.body.c20Price,
          c21Price: req.body.c21Price,
          c22Price: req.body.c22Price,
          c23Price: req.body.c23Price,
          c24Price: req.body.c24Price,

          d0Price: req.body.d0Price,
          d1Price: req.body.d1Price,
          d2Price: req.body.d2Price,
          d3Price: req.body.d3Price,
          d4Price: req.body.d4Price,
          d5Price: req.body.d5Price,
          d6Price: req.body.d6Price,
          d7Price: req.body.d7Price,
          d8Price: req.body.d8Price,
          d9Price: req.body.d9Price,
          d10Price: req.body.d10Price,
          d11Price: req.body.d11Price,
          d12Price: req.body.d12Price,
          d13Price: req.body.d13Price,
          d14Price: req.body.d14Price,
          d15Price: req.body.d15Price,
          d16Price: req.body.d16Price,
          d17Price: req.body.d17Price,
          d18Price: req.body.d18Price,
          d19Price: req.body.d19Price,
          d20Price: req.body.d20Price,
          d21Price: req.body.d21Price,
          d22Price: req.body.d22Price,
          d23Price: req.body.d23Price,
          d24Price: req.body.d24Price,

          e0Price: req.body.e0Price,
          e1Price: req.body.e1Price,
          e2Price: req.body.e2Price,
          e3Price: req.body.e3Price,
          e4Price: req.body.e4Price,
          e5Price: req.body.e5Price,
          e6Price: req.body.e6Price,
          e7Price: req.body.e7Price,
          e8Price: req.body.e8Price,
          e9Price: req.body.e9Price,
          e10Price: req.body.e10Price,
          e11Price: req.body.e11Price,
          e12Price: req.body.e12Price,
          e13Price: req.body.e13Price,
          e14Price: req.body.e14Price,
          e15Price: req.body.e15Price,
          e16Price: req.body.e16Price,
          e17Price: req.body.e17Price,
          e18Price: req.body.e18Price,
          e19Price: req.body.e19Price,
          e20Price: req.body.e20Price,
          e21Price: req.body.e21Price,
          e22Price: req.body.e22Price,
          e23Price: req.body.e23Price,
          e24Price: req.body.e24Price,

          f0Price: req.body.f0Price,
          f1Price: req.body.f1Price,
          f2Price: req.body.f2Price,
          f3Price: req.body.f3Price,
          f4Price: req.body.f4Price,
          f5Price: req.body.f5Price,
          f6Price: req.body.f6Price,
          f7Price: req.body.f7Price,
          f8Price: req.body.f8Price,
          f9Price: req.body.f9Price,
          f10Price: req.body.f10Price,
          f11Price: req.body.f11Price,
          f12Price: req.body.f12Price,
          f13Price: req.body.f13Price,
          f14Price: req.body.f14Price,
          f15Price: req.body.f15Price,
          f16Price: req.body.f16Price,
          f17Price: req.body.f17Price,
          f18Price: req.body.f18Price,
          f19Price: req.body.f19Price,
          f20Price: req.body.f20Price,
          f21Price: req.body.f21Price,
          f22Price: req.body.f22Price,
          f23Price: req.body.f23Price,
          f24Price: req.body.f24Price,

          g0Price: req.body.g0Price,
          g1Price: req.body.g1Price,
          g2Price: req.body.g2Price,
          g3Price: req.body.g3Price,
          g4Price: req.body.g4Price,
          g5Price: req.body.g5Price,
          g6Price: req.body.g6Price,
          g7Price: req.body.g7Price,
          g8Price: req.body.g8Price,
          g9Price: req.body.g9Price,
          g10Price: req.body.g10Price,
          g11Price: req.body.g11Price,
          g12Price: req.body.g12Price,
          g13Price: req.body.g13Price,
          g14Price: req.body.g14Price,
          g15Price: req.body.g15Price,
          g16Price: req.body.g16Price,
          g17Price: req.body.g17Price,
          g18Price: req.body.g18Price,
          g19Price: req.body.g19Price,
          g20Price: req.body.g20Price,
          g21Price: req.body.g21Price,
          g22Price: req.body.g22Price,
          g23Price: req.body.g23Price,
          g24Price: req.body.g24Price,

          h0Price: req.body.h0Price,
          h1Price: req.body.h1Price,
          h2Price: req.body.h2Price,
          h3Price: req.body.h3Price,
          h4Price: req.body.h4Price,
          h5Price: req.body.h5Price,
          h6Price: req.body.h6Price,
          h7Price: req.body.h7Price,
          h8Price: req.body.h8Price,
          h9Price: req.body.h9Price,
          h10Price: req.body.h10Price,
          h11Price: req.body.h11Price,
          h12Price: req.body.h12Price,
          h13Price: req.body.h13Price,
          h14Price: req.body.h14Price,
          h15Price: req.body.h15Price,
          h16Price: req.body.h16Price,
          h17Price: req.body.h17Price,
          h18Price: req.body.h18Price,
          h19Price: req.body.h19Price,
          h20Price: req.body.h20Price,
          h21Price: req.body.h21Price,
          h22Price: req.body.h22Price,
          h23Price: req.body.h23Price,
          h24Price: req.body.h24Price,

          i0Price: req.body.i0Price,
          i1Price: req.body.i1Price,
          i2Price: req.body.i2Price,
          i3Price: req.body.i3Price,
          i4Price: req.body.i4Price,
          i5Price: req.body.i5Price,
          i6Price: req.body.i6Price,
          i7Price: req.body.i7Price,
          i8Price: req.body.i8Price,
          i9Price: req.body.i9Price,
          i10Price: req.body.i10Price,
          i11Price: req.body.i11Price,
          i12Price: req.body.i12Price,
          i13Price: req.body.i13Price,
          i14Price: req.body.i14Price,
          i15Price: req.body.i15Price,
          i16Price: req.body.i16Price,
          i17Price: req.body.i17Price,
          i18Price: req.body.i18Price,
          i19Price: req.body.i19Price,
          i20Price: req.body.i20Price,
          i21Price: req.body.i21Price,
          i22Price: req.body.i22Price,
          i23Price: req.body.i23Price,
          i24Price: req.body.i24Price,

          j0Price: req.body.j0Price,
          j1Price: req.body.j1Price,
          j2Price: req.body.j2Price,
          j3Price: req.body.j3Price,
          j4Price: req.body.j4Price,
          j5Price: req.body.j5Price,
          j6Price: req.body.j6Price,
          j7Price: req.body.j7Price,
          j8Price: req.body.j8Price,
          j9Price: req.body.j9Price,
          j10Price: req.body.j10Price,
          j11Price: req.body.j11Price,
          j12Price: req.body.j12Price,
          j13Price: req.body.j13Price,
          j14Price: req.body.j14Price,
          j15Price: req.body.j15Price,
          j16Price: req.body.j16Price,
          j17Price: req.body.j17Price,
          j18Price: req.body.j18Price,
          j19Price: req.body.j19Price,
          j20Price: req.body.j20Price,
          j21Price: req.body.j21Price,
          j22Price: req.body.j22Price,
          j23Price: req.body.j23Price,
          j24Price: req.body.j24Price,

          a0Quantity: req.body.a0Quantity,
          a1Quantity: req.body.a1Quantity,
          a2Quantity: req.body.a2Quantity,
          a3Quantity: req.body.a3Quantity,
          a4Quantity: req.body.a4Quantity,
          a5Quantity: req.body.a5Quantity,
          a6Quantity: req.body.a6Quantity,
          a7Quantity: req.body.a7Quantity,
          a8Quantity: req.body.a8Quantity,
          a9Quantity: req.body.a9Quantity,
          a10Quantity: req.body.a10Quantity,
          a11Quantity: req.body.a11Quantity,
          a12Quantity: req.body.a12Quantity,
          a13Quantity: req.body.a13Quantity,
          a14Quantity: req.body.a14Quantity,
          a15Quantity: req.body.a15Quantity,
          a16Quantity: req.body.a16Quantity,
          a17Quantity: req.body.a17Quantity,
          a18Quantity: req.body.a18Quantity,
          a19Quantity: req.body.a19Quantity,
          a20Quantity: req.body.a20Quantity,
          a21Quantity: req.body.a21Quantity,
          a22Quantity: req.body.a22Quantity,
          a23Quantity: req.body.a23Quantity,
          a24Quantity: req.body.a24Quantity,
          a25Quantity: req.body.a25Quantity,
          a26Quantity: req.body.a26Quantity,
          a27Quantity: req.body.a27Quantity,
          a28Quantity: req.body.a28Quantity,
          a29Quantity: req.body.a29Quantity,
          a30Quantity: req.body.a30Quantity,
          a31Quantity: req.body.a31Quantity,
          a32Quantity: req.body.a32Quantity,
          a33Quantity: req.body.a33Quantity,
          a34Quantity: req.body.a34Quantity,
          a35Quantity: req.body.a35Quantity,
          a36Quantity: req.body.a36Quantity,
          a37Quantity: req.body.a37Quantity,
          a38Quantity: req.body.a38Quantity,
          a39Quantity: req.body.a39Quantity,
          a40Quantity: req.body.a40Quantity,
          a41Quantity: req.body.a41Quantity,
          a42Quantity: req.body.a42Quantity,
          a43Quantity: req.body.a43Quantity,
          a44Quantity: req.body.a44Quantity,
          a45Quantity: req.body.a45Quantity,
          a46Quantity: req.body.a46Quantity,
          a47Quantity: req.body.a47Quantity,
          a48Quantity: req.body.a48Quantity,
          a49Quantity: req.body.a49Quantity,
          a50Quantity: req.body.a50Quantity,
          a51Quantity: req.body.a51Quantity,
          a52Quantity: req.body.a52Quantity,
          a53Quantity: req.body.a53Quantity,
          a54Quantity: req.body.a54Quantity,
          a55Quantity: req.body.a55Quantity,
          a56Quantity: req.body.a56Quantity,
          a57Quantity: req.body.a57Quantity,
          a58Quantity: req.body.a58Quantity,
          a59Quantity: req.body.a59Quantity,
          a60Quantity: req.body.a60Quantity,
          a61Quantity: req.body.a61Quantity,
          a62Quantity: req.body.a62Quantity,
          a63Quantity: req.body.a63Quantity,
          a64Quantity: req.body.a64Quantity,
          a65Quantity: req.body.a65Quantity,
          a66Quantity: req.body.a66Quantity,
          a67Quantity: req.body.a67Quantity,
          a68Quantity: req.body.a68Quantity,
          a69Quantity: req.body.a69Quantity,
          a70Quantity: req.body.a70Quantity,
          a71Quantity: req.body.a71Quantity,
          a72Quantity: req.body.a72Quantity,
          a73Quantity: req.body.a73Quantity,
          a74Quantity: req.body.a74Quantity,

          b0Quantity: req.body.b0Quantity,
          b1Quantity: req.body.b1Quantity,
          b2Quantity: req.body.b2Quantity,
          b3Quantity: req.body.b3Quantity,
          b4Quantity: req.body.b4Quantity,
          b5Quantity: req.body.b5Quantity,
          b6Quantity: req.body.b6Quantity,
          b7Quantity: req.body.b7Quantity,
          b8Quantity: req.body.b8Quantity,
          b9Quantity: req.body.b9Quantity,
          b10Quantity: req.body.b10Quantity,
          b11Quantity: req.body.b11Quantity,
          b12Quantity: req.body.b12Quantity,
          b13Quantity: req.body.b13Quantity,
          b14Quantity: req.body.b14Quantity,
          b15Quantity: req.body.b15Quantity,
          b16Quantity: req.body.b16Quantity,
          b17Quantity: req.body.b17Quantity,
          b18Quantity: req.body.b18Quantity,
          b19Quantity: req.body.b19Quantity,
          b20Quantity: req.body.b20Quantity,
          b21Quantity: req.body.b21Quantity,
          b22Quantity: req.body.b22Quantity,
          b23Quantity: req.body.b23Quantity,
          b24Quantity: req.body.b24Quantity,

          c0Quantity: req.body.c0Quantity,
          c1Quantity: req.body.c1Quantity,
          c2Quantity: req.body.c2Quantity,
          c3Quantity: req.body.c3Quantity,
          c4Quantity: req.body.c4Quantity,
          c5Quantity: req.body.c5Quantity,
          c6Quantity: req.body.c6Quantity,
          c7Quantity: req.body.c7Quantity,
          c8Quantity: req.body.c8Quantity,
          c9Quantity: req.body.c9Quantity,
          c10Quantity: req.body.c10Quantity,
          c11Quantity: req.body.c11Quantity,
          c12Quantity: req.body.c12Quantity,
          c13Quantity: req.body.c13Quantity,
          c14Quantity: req.body.c14Quantity,
          c15Quantity: req.body.c15Quantity,
          c16Quantity: req.body.c16Quantity,
          c17Quantity: req.body.c17Quantity,
          c18Quantity: req.body.c18Quantity,
          c19Quantity: req.body.c19Quantity,
          c20Quantity: req.body.c20Quantity,
          c21Quantity: req.body.c21Quantity,
          c22Quantity: req.body.c22Quantity,
          c23Quantity: req.body.c23Quantity,
          c24Quantity: req.body.c24Quantity,

          d0Quantity: req.body.d0Quantity,
          d1Quantity: req.body.d1Quantity,
          d2Quantity: req.body.d2Quantity,
          d3Quantity: req.body.d3Quantity,
          d4Quantity: req.body.d4Quantity,
          d5Quantity: req.body.d5Quantity,
          d6Quantity: req.body.d6Quantity,
          d7Quantity: req.body.d7Quantity,
          d8Quantity: req.body.d8Quantity,
          d9Quantity: req.body.d9Quantity,
          d10Quantity: req.body.d10Quantity,
          d11Quantity: req.body.d11Quantity,
          d12Quantity: req.body.d12Quantity,
          d13Quantity: req.body.d13Quantity,
          d14Quantity: req.body.d14Quantity,
          d15Quantity: req.body.d15Quantity,
          d16Quantity: req.body.d16Quantity,
          d17Quantity: req.body.d17Quantity,
          d18Quantity: req.body.d18Quantity,
          d19Quantity: req.body.d19Quantity,
          d20Quantity: req.body.d20Quantity,
          d21Quantity: req.body.d21Quantity,
          d22Quantity: req.body.d22Quantity,
          d23Quantity: req.body.d23Quantity,
          d24Quantity: req.body.d24Quantity,

          e0Quantity: req.body.e0Quantity,
          e1Quantity: req.body.e1Quantity,
          e2Quantity: req.body.e2Quantity,
          e3Quantity: req.body.e3Quantity,
          e4Quantity: req.body.e4Quantity,
          e5Quantity: req.body.e5Quantity,
          e6Quantity: req.body.e6Quantity,
          e7Quantity: req.body.e7Quantity,
          e8Quantity: req.body.e8Quantity,
          e9Quantity: req.body.e9Quantity,
          e10Quantity: req.body.e10Quantity,
          e11Quantity: req.body.e11Quantity,
          e12Quantity: req.body.e12Quantity,
          e13Quantity: req.body.e13Quantity,
          e14Quantity: req.body.e14Quantity,
          e15Quantity: req.body.e15Quantity,
          e16Quantity: req.body.e16Quantity,
          e17Quantity: req.body.e17Quantity,
          e18Quantity: req.body.e18Quantity,
          e19Quantity: req.body.e19Quantity,
          e20Quantity: req.body.e20Quantity,
          e21Quantity: req.body.e21Quantity,
          e22Quantity: req.body.e22Quantity,
          e23Quantity: req.body.e23Quantity,
          e24Quantity: req.body.e24Quantity,

          f0Quantity: req.body.f0Quantity,
          f1Quantity: req.body.f1Quantity,
          f2Quantity: req.body.f2Quantity,
          f3Quantity: req.body.f3Quantity,
          f4Quantity: req.body.f4Quantity,
          f5Quantity: req.body.f5Quantity,
          f6Quantity: req.body.f6Quantity,
          f7Quantity: req.body.f7Quantity,
          f8Quantity: req.body.f8Quantity,
          f9Quantity: req.body.f9Quantity,
          f10Quantity: req.body.f10Quantity,
          f11Quantity: req.body.f11Quantity,
          f12Quantity: req.body.f12Quantity,
          f13Quantity: req.body.f13Quantity,
          f14Quantity: req.body.f14Quantity,
          f15Quantity: req.body.f15Quantity,
          f16Quantity: req.body.f16Quantity,
          f17Quantity: req.body.f17Quantity,
          f18Quantity: req.body.f18Quantity,
          f19Quantity: req.body.f19Quantity,
          f20Quantity: req.body.f20Quantity,
          f21Quantity: req.body.f21Quantity,
          f22Quantity: req.body.f22Quantity,
          f23Quantity: req.body.f23Quantity,
          f24Quantity: req.body.f24Quantity,

          g0Quantity: req.body.g0Quantity,
          g1Quantity: req.body.g1Quantity,
          g2Quantity: req.body.g2Quantity,
          g3Quantity: req.body.g3Quantity,
          g4Quantity: req.body.g4Quantity,
          g5Quantity: req.body.g5Quantity,
          g6Quantity: req.body.g6Quantity,
          g7Quantity: req.body.g7Quantity,
          g8Quantity: req.body.g8Quantity,
          g9Quantity: req.body.g9Quantity,
          g10Quantity: req.body.g10Quantity,
          g11Quantity: req.body.g11Quantity,
          g12Quantity: req.body.g12Quantity,
          g13Quantity: req.body.g13Quantity,
          g14Quantity: req.body.g14Quantity,
          g15Quantity: req.body.g15Quantity,
          g16Quantity: req.body.g16Quantity,
          g17Quantity: req.body.g17Quantity,
          g18Quantity: req.body.g18Quantity,
          g19Quantity: req.body.g19Quantity,
          g20Quantity: req.body.g20Quantity,
          g21Quantity: req.body.g21Quantity,
          g22Quantity: req.body.g22Quantity,
          g23Quantity: req.body.g23Quantity,
          g24Quantity: req.body.g24Quantity,

          h0Quantity: req.body.h0Quantity,
          h1Quantity: req.body.h1Quantity,
          h2Quantity: req.body.h2Quantity,
          h3Quantity: req.body.h3Quantity,
          h4Quantity: req.body.h4Quantity,
          h5Quantity: req.body.h5Quantity,
          h6Quantity: req.body.h6Quantity,
          h7Quantity: req.body.h7Quantity,
          h8Quantity: req.body.h8Quantity,
          h9Quantity: req.body.h9Quantity,
          h10Quantity: req.body.h10Quantity,
          h11Quantity: req.body.h11Quantity,
          h12Quantity: req.body.h12Quantity,
          h13Quantity: req.body.h13Quantity,
          h14Quantity: req.body.h14Quantity,
          h15Quantity: req.body.h15Quantity,
          h16Quantity: req.body.h16Quantity,
          h17Quantity: req.body.h17Quantity,
          h18Quantity: req.body.h18Quantity,
          h19Quantity: req.body.h19Quantity,
          h20Quantity: req.body.h20Quantity,
          h21Quantity: req.body.h21Quantity,
          h22Quantity: req.body.h22Quantity,
          h23Quantity: req.body.h23Quantity,
          h24Quantity: req.body.h24Quantity,

          i0Quantity: req.body.i0Quantity,
          i1Quantity: req.body.i1Quantity,
          i2Quantity: req.body.i2Quantity,
          i3Quantity: req.body.i3Quantity,
          i4Quantity: req.body.i4Quantity,
          i5Quantity: req.body.i5Quantity,
          i6Quantity: req.body.i6Quantity,
          i7Quantity: req.body.i7Quantity,
          i8Quantity: req.body.i8Quantity,
          i9Quantity: req.body.i9Quantity,
          i10Quantity: req.body.i10Quantity,
          i11Quantity: req.body.i11Quantity,
          i12Quantity: req.body.i12Quantity,
          i13Quantity: req.body.i13Quantity,
          i14Quantity: req.body.i14Quantity,
          i15Quantity: req.body.i15Quantity,
          i16Quantity: req.body.i16Quantity,
          i17Quantity: req.body.i17Quantity,
          i18Quantity: req.body.i18Quantity,
          i19Quantity: req.body.i19Quantity,
          i20Quantity: req.body.i20Quantity,
          i21Quantity: req.body.i21Quantity,
          i22Quantity: req.body.i22Quantity,
          i23Quantity: req.body.i23Quantity,
          i24Quantity: req.body.i24Quantity,

          j0Quantity: req.body.j0Quantity,
          j1Quantity: req.body.j1Quantity,
          j2Quantity: req.body.j2Quantity,
          j3Quantity: req.body.j3Quantity,
          j4Quantity: req.body.j4Quantity,
          j5Quantity: req.body.j5Quantity,
          j6Quantity: req.body.j6Quantity,
          j7Quantity: req.body.j7Quantity,
          j8Quantity: req.body.j8Quantity,
          j9Quantity: req.body.j9Quantity,
          j10Quantity: req.body.j10Quantity,
          j11Quantity: req.body.j11Quantity,
          j12Quantity: req.body.j12Quantity,
          j13Quantity: req.body.j13Quantity,
          j14Quantity: req.body.j14Quantity,
          j15Quantity: req.body.j15Quantity,
          j16Quantity: req.body.j16Quantity,
          j17Quantity: req.body.j17Quantity,
          j18Quantity: req.body.j18Quantity,
          j19Quantity: req.body.j19Quantity,
          j20Quantity: req.body.j20Quantity,
          j21Quantity: req.body.j21Quantity,
          j22Quantity: req.body.j22Quantity,
          j23Quantity: req.body.j23Quantity,
          j24Quantity: req.body.j24Quantity,

          a0TotalPrice: req.body.a0TotalPrice,
          a1TotalPrice: req.body.a1TotalPrice,
          a2TotalPrice: req.body.a2TotalPrice,
          a3TotalPrice: req.body.a3TotalPrice,
          a4TotalPrice: req.body.a4TotalPrice,
          a5TotalPrice: req.body.a5TotalPrice,
          a6TotalPrice: req.body.a6TotalPrice,
          a7TotalPrice: req.body.a7TotalPrice,
          a8TotalPrice: req.body.a8TotalPrice,
          a9TotalPrice: req.body.a9TotalPrice,
          a10TotalPrice: req.body.a10TotalPrice,
          a11TotalPrice: req.body.a11TotalPrice,
          a12TotalPrice: req.body.a12TotalPrice,
          a13TotalPrice: req.body.a13TotalPrice,
          a14TotalPrice: req.body.a14TotalPrice,
          a15TotalPrice: req.body.a15TotalPrice,
          a16TotalPrice: req.body.a16TotalPrice,
          a17TotalPrice: req.body.a17TotalPrice,
          a18TotalPrice: req.body.a18TotalPrice,
          a19TotalPrice: req.body.a19TotalPrice,
          a20TotalPrice: req.body.a20TotalPrice,
          a21TotalPrice: req.body.a21TotalPrice,
          a22TotalPrice: req.body.a22TotalPrice,
          a23TotalPrice: req.body.a23TotalPrice,
          a24TotalPrice: req.body.a24TotalPrice,
          a25TotalPrice: req.body.a25TotalPrice,
          a26TotalPrice: req.body.a26TotalPrice,
          a27TotalPrice: req.body.a27TotalPrice,
          a28TotalPrice: req.body.a28TotalPrice,
          a29TotalPrice: req.body.a29TotalPrice,
          a30TotalPrice: req.body.a30TotalPrice,
          a31TotalPrice: req.body.a31TotalPrice,
          a32TotalPrice: req.body.a32TotalPrice,
          a33TotalPrice: req.body.a33TotalPrice,
          a34TotalPrice: req.body.a34TotalPrice,
          a35TotalPrice: req.body.a35TotalPrice,
          a36TotalPrice: req.body.a36TotalPrice,
          a37TotalPrice: req.body.a37TotalPrice,
          a38TotalPrice: req.body.a38TotalPrice,
          a39TotalPrice: req.body.a39TotalPrice,
          a40TotalPrice: req.body.a40TotalPrice,
          a41TotalPrice: req.body.a41TotalPrice,
          a42TotalPrice: req.body.a42TotalPrice,
          a43TotalPrice: req.body.a43TotalPrice,
          a44TotalPrice: req.body.a44TotalPrice,
          a45TotalPrice: req.body.a45TotalPrice,
          a46TotalPrice: req.body.a46TotalPrice,
          a47TotalPrice: req.body.a47TotalPrice,
          a48TotalPrice: req.body.a48TotalPrice,
          a49TotalPrice: req.body.a49TotalPrice,
          a50TotalPrice: req.body.a50TotalPrice,
          a51TotalPrice: req.body.a51TotalPrice,
          a52TotalPrice: req.body.a52TotalPrice,
          a53TotalPrice: req.body.a53TotalPrice,
          a54TotalPrice: req.body.a54TotalPrice,
          a55TotalPrice: req.body.a55TotalPrice,
          a56TotalPrice: req.body.a56TotalPrice,
          a57TotalPrice: req.body.a57TotalPrice,
          a58TotalPrice: req.body.a58TotalPrice,
          a59TotalPrice: req.body.a59TotalPrice,
          a60TotalPrice: req.body.a60TotalPrice,
          a61TotalPrice: req.body.a61TotalPrice,
          a62TotalPrice: req.body.a62TotalPrice,
          a63TotalPrice: req.body.a63TotalPrice,
          a64TotalPrice: req.body.a64TotalPrice,
          a65TotalPrice: req.body.a65TotalPrice,
          a66TotalPrice: req.body.a66TotalPrice,
          a67TotalPrice: req.body.a67TotalPrice,
          a68TotalPrice: req.body.a68TotalPrice,
          a69TotalPrice: req.body.a69TotalPrice,
          a70TotalPrice: req.body.a70TotalPrice,
          a71TotalPrice: req.body.a71TotalPrice,
          a72TotalPrice: req.body.a72TotalPrice,
          a73TotalPrice: req.body.a73TotalPrice,
          a74TotalPrice: req.body.a74TotalPrice,

          b0TotalPrice: req.body.b0TotalPrice,
          b1TotalPrice: req.body.b1TotalPrice,
          b2TotalPrice: req.body.b2TotalPrice,
          b3TotalPrice: req.body.b3TotalPrice,
          b4TotalPrice: req.body.b4TotalPrice,
          b5TotalPrice: req.body.b5TotalPrice,
          b6TotalPrice: req.body.b6TotalPrice,
          b7TotalPrice: req.body.b7TotalPrice,
          b8TotalPrice: req.body.b8TotalPrice,
          b9TotalPrice: req.body.b9TotalPrice,
          b10TotalPrice: req.body.b10TotalPrice,
          b11TotalPrice: req.body.b11TotalPrice,
          b12TotalPrice: req.body.b12TotalPrice,
          b13TotalPrice: req.body.b13TotalPrice,
          b14TotalPrice: req.body.b14TotalPrice,
          b15TotalPrice: req.body.b15TotalPrice,
          b16TotalPrice: req.body.b16TotalPrice,
          b17TotalPrice: req.body.b17TotalPrice,
          b18TotalPrice: req.body.b18TotalPrice,
          b19TotalPrice: req.body.b19TotalPrice,
          b20TotalPrice: req.body.b20TotalPrice,
          b21TotalPrice: req.body.b21TotalPrice,
          b22TotalPrice: req.body.b22TotalPrice,
          b23TotalPrice: req.body.b23TotalPrice,
          b24TotalPrice: req.body.b24TotalPrice,

          c0TotalPrice: req.body.c0TotalPrice,
          c1TotalPrice: req.body.c1TotalPrice,
          c2TotalPrice: req.body.c2TotalPrice,
          c3TotalPrice: req.body.c3TotalPrice,
          c4TotalPrice: req.body.c4TotalPrice,
          c5TotalPrice: req.body.c5TotalPrice,
          c6TotalPrice: req.body.c6TotalPrice,
          c7TotalPrice: req.body.c7TotalPrice,
          c8TotalPrice: req.body.c8TotalPrice,
          c9TotalPrice: req.body.c9TotalPrice,
          c10TotalPrice: req.body.c10TotalPrice,
          c11TotalPrice: req.body.c11TotalPrice,
          c12TotalPrice: req.body.c12TotalPrice,
          c13TotalPrice: req.body.c13TotalPrice,
          c14TotalPrice: req.body.c14TotalPrice,
          c15TotalPrice: req.body.c15TotalPrice,
          c16TotalPrice: req.body.c16TotalPrice,
          c17TotalPrice: req.body.c17TotalPrice,
          c18TotalPrice: req.body.c18TotalPrice,
          c19TotalPrice: req.body.c19TotalPrice,
          c20TotalPrice: req.body.c20TotalPrice,
          c21TotalPrice: req.body.c21TotalPrice,
          c22TotalPrice: req.body.c22TotalPrice,
          c23TotalPrice: req.body.c23TotalPrice,
          c24TotalPrice: req.body.c24TotalPrice,

          d0TotalPrice: req.body.d0TotalPrice,
          d1TotalPrice: req.body.d1TotalPrice,
          d2TotalPrice: req.body.d2TotalPrice,
          d3TotalPrice: req.body.d3TotalPrice,
          d4TotalPrice: req.body.d4TotalPrice,
          d5TotalPrice: req.body.d5TotalPrice,
          d6TotalPrice: req.body.d6TotalPrice,
          d7TotalPrice: req.body.d7TotalPrice,
          d8TotalPrice: req.body.d8TotalPrice,
          d9TotalPrice: req.body.d9TotalPrice,
          d10TotalPrice: req.body.d10TotalPrice,
          d11TotalPrice: req.body.d11TotalPrice,
          d12TotalPrice: req.body.d12TotalPrice,
          d13TotalPrice: req.body.d13TotalPrice,
          d14TotalPrice: req.body.d14TotalPrice,
          d15TotalPrice: req.body.d15TotalPrice,
          d16TotalPrice: req.body.d16TotalPrice,
          d17TotalPrice: req.body.d17TotalPrice,
          d18TotalPrice: req.body.d18TotalPrice,
          d19TotalPrice: req.body.d19TotalPrice,
          d20TotalPrice: req.body.d20TotalPrice,
          d21TotalPrice: req.body.d21TotalPrice,
          d22TotalPrice: req.body.d22TotalPrice,
          d23TotalPrice: req.body.d23TotalPrice,
          d24TotalPrice: req.body.d24TotalPrice,

          e0TotalPrice: req.body.e0TotalPrice,
          e1TotalPrice: req.body.e1TotalPrice,
          e2TotalPrice: req.body.e2TotalPrice,
          e3TotalPrice: req.body.e3TotalPrice,
          e4TotalPrice: req.body.e4TotalPrice,
          e5TotalPrice: req.body.e5TotalPrice,
          e6TotalPrice: req.body.e6TotalPrice,
          e7TotalPrice: req.body.e7TotalPrice,
          e8TotalPrice: req.body.e8TotalPrice,
          e9TotalPrice: req.body.e9TotalPrice,
          e10TotalPrice: req.body.e10TotalPrice,
          e11TotalPrice: req.body.e11TotalPrice,
          e12TotalPrice: req.body.e12TotalPrice,
          e13TotalPrice: req.body.e13TotalPrice,
          e14TotalPrice: req.body.e14TotalPrice,
          e15TotalPrice: req.body.e15TotalPrice,
          e16TotalPrice: req.body.e16TotalPrice,
          e17TotalPrice: req.body.e17TotalPrice,
          e18TotalPrice: req.body.e18TotalPrice,
          e19TotalPrice: req.body.e19TotalPrice,
          e20TotalPrice: req.body.e20TotalPrice,
          e21TotalPrice: req.body.e21TotalPrice,
          e22TotalPrice: req.body.e22TotalPrice,
          e23TotalPrice: req.body.e23TotalPrice,
          e24TotalPrice: req.body.e24TotalPrice,

          f0TotalPrice: req.body.f0TotalPrice,
          f1TotalPrice: req.body.f1TotalPrice,
          f2TotalPrice: req.body.f2TotalPrice,
          f3TotalPrice: req.body.f3TotalPrice,
          f4TotalPrice: req.body.f4TotalPrice,
          f5TotalPrice: req.body.f5TotalPrice,
          f6TotalPrice: req.body.f6TotalPrice,
          f7TotalPrice: req.body.f7TotalPrice,
          f8TotalPrice: req.body.f8TotalPrice,
          f9TotalPrice: req.body.f9TotalPrice,
          f10TotalPrice: req.body.f10TotalPrice,
          f11TotalPrice: req.body.f11TotalPrice,
          f12TotalPrice: req.body.f12TotalPrice,
          f13TotalPrice: req.body.f13TotalPrice,
          f14TotalPrice: req.body.f14TotalPrice,
          f15TotalPrice: req.body.f15TotalPrice,
          f16TotalPrice: req.body.f16TotalPrice,
          f17TotalPrice: req.body.f17TotalPrice,
          f18TotalPrice: req.body.f18TotalPrice,
          f19TotalPrice: req.body.f19TotalPrice,
          f20TotalPrice: req.body.f20TotalPrice,
          f21TotalPrice: req.body.f21TotalPrice,
          f22TotalPrice: req.body.f22TotalPrice,
          f23TotalPrice: req.body.f23TotalPrice,
          f24TotalPrice: req.body.f24TotalPrice,

          g0TotalPrice: req.body.g0TotalPrice,
          g1TotalPrice: req.body.g1TotalPrice,
          g2TotalPrice: req.body.g2TotalPrice,
          g3TotalPrice: req.body.g3TotalPrice,
          g4TotalPrice: req.body.g4TotalPrice,
          g5TotalPrice: req.body.g5TotalPrice,
          g6TotalPrice: req.body.g6TotalPrice,
          g7TotalPrice: req.body.g7TotalPrice,
          g8TotalPrice: req.body.g8TotalPrice,
          g9TotalPrice: req.body.g9TotalPrice,
          g10TotalPrice: req.body.g10TotalPrice,
          g11TotalPrice: req.body.g11TotalPrice,
          g12TotalPrice: req.body.g12TotalPrice,
          g13TotalPrice: req.body.g13TotalPrice,
          g14TotalPrice: req.body.g14TotalPrice,
          g15TotalPrice: req.body.g15TotalPrice,
          g16TotalPrice: req.body.g16TotalPrice,
          g17TotalPrice: req.body.g17TotalPrice,
          g18TotalPrice: req.body.g18TotalPrice,
          g19TotalPrice: req.body.g19TotalPrice,
          g20TotalPrice: req.body.g20TotalPrice,
          g21TotalPrice: req.body.g21TotalPrice,
          g22TotalPrice: req.body.g22TotalPrice,
          g23TotalPrice: req.body.g23TotalPrice,
          g24TotalPrice: req.body.g24TotalPrice,

          h0TotalPrice: req.body.h0TotalPrice,
          h1TotalPrice: req.body.h1TotalPrice,
          h2TotalPrice: req.body.h2TotalPrice,
          h3TotalPrice: req.body.h3TotalPrice,
          h4TotalPrice: req.body.h4TotalPrice,
          h5TotalPrice: req.body.h5TotalPrice,
          h6TotalPrice: req.body.h6TotalPrice,
          h7TotalPrice: req.body.h7TotalPrice,
          h8TotalPrice: req.body.h8TotalPrice,
          h9TotalPrice: req.body.h9TotalPrice,
          h10TotalPrice: req.body.h10TotalPrice,
          h11TotalPrice: req.body.h11TotalPrice,
          h12TotalPrice: req.body.h12TotalPrice,
          h13TotalPrice: req.body.h13TotalPrice,
          h14TotalPrice: req.body.h14TotalPrice,
          h15TotalPrice: req.body.h15TotalPrice,
          h16TotalPrice: req.body.h16TotalPrice,
          h17TotalPrice: req.body.h17TotalPrice,
          h18TotalPrice: req.body.h18TotalPrice,
          h19TotalPrice: req.body.h19TotalPrice,
          h20TotalPrice: req.body.h20TotalPrice,
          h21TotalPrice: req.body.h21TotalPrice,
          h22TotalPrice: req.body.h22TotalPrice,
          h23TotalPrice: req.body.h23TotalPrice,
          h24TotalPrice: req.body.h24TotalPrice,

          i0TotalPrice: req.body.i0TotalPrice,
          i1TotalPrice: req.body.i1TotalPrice,
          i2TotalPrice: req.body.i2TotalPrice,
          i3TotalPrice: req.body.i3TotalPrice,
          i4TotalPrice: req.body.i4TotalPrice,
          i5TotalPrice: req.body.i5TotalPrice,
          i6TotalPrice: req.body.i6TotalPrice,
          i7TotalPrice: req.body.i7TotalPrice,
          i8TotalPrice: req.body.i8TotalPrice,
          i9TotalPrice: req.body.i9TotalPrice,
          i10TotalPrice: req.body.i10TotalPrice,
          i11TotalPrice: req.body.i11TotalPrice,
          i12TotalPrice: req.body.i12TotalPrice,
          i13TotalPrice: req.body.i13TotalPrice,
          i14TotalPrice: req.body.i14TotalPrice,
          i15TotalPrice: req.body.i15TotalPrice,
          i16TotalPrice: req.body.i16TotalPrice,
          i17TotalPrice: req.body.i17TotalPrice,
          i18TotalPrice: req.body.i18TotalPrice,
          i19TotalPrice: req.body.i19TotalPrice,
          i20TotalPrice: req.body.i20TotalPrice,
          i21TotalPrice: req.body.i21TotalPrice,
          i22TotalPrice: req.body.i22TotalPrice,
          i23TotalPrice: req.body.i23TotalPrice,
          i24TotalPrice: req.body.i24TotalPrice,

          j0TotalPrice: req.body.j0TotalPrice,
          j1TotalPrice: req.body.j1TotalPrice,
          j2TotalPrice: req.body.j2TotalPrice,
          j3TotalPrice: req.body.j3TotalPrice,
          j4TotalPrice: req.body.j4TotalPrice,
          j5TotalPrice: req.body.j5TotalPrice,
          j6TotalPrice: req.body.j6TotalPrice,
          j7TotalPrice: req.body.j7TotalPrice,
          j8TotalPrice: req.body.j8TotalPrice,
          j9TotalPrice: req.body.j9TotalPrice,
          j10TotalPrice: req.body.j10TotalPrice,
          j11TotalPrice: req.body.j11TotalPrice,
          j12TotalPrice: req.body.j12TotalPrice,
          j13TotalPrice: req.body.j13TotalPrice,
          j14TotalPrice: req.body.j14TotalPrice,
          j15TotalPrice: req.body.j15TotalPrice,
          j16TotalPrice: req.body.j16TotalPrice,
          j17TotalPrice: req.body.j17TotalPrice,
          j18TotalPrice: req.body.j18TotalPrice,
          j19TotalPrice: req.body.j19TotalPrice,
          j20TotalPrice: req.body.j20TotalPrice,
          j21TotalPrice: req.body.j21TotalPrice,
          j22TotalPrice: req.body.j22TotalPrice,
          j23TotalPrice: req.body.j23TotalPrice,
          j24TotalPrice: req.body.j24TotalPrice,

          a0Type: req.body.a0Type,
          a1Type: req.body.a1Type,
          a2Type: req.body.a2Type,
          a3Type: req.body.a3Type,
          a4Type: req.body.a4Type,
          a5Type: req.body.a5Type,
          a6Type: req.body.a6Type,
          a7Type: req.body.a7Type,
          a8Type: req.body.a8Type,
          a9Type: req.body.a9Type,
          a10Type: req.body.a10Type,
          a11Type: req.body.a11Type,
          a12Type: req.body.a12Type,
          a13Type: req.body.a13Type,
          a14Type: req.body.a14Type,
          a15Type: req.body.a15Type,
          a16Type: req.body.a16Type,
          a17Type: req.body.a17Type,
          a18Type: req.body.a18Type,
          a19Type: req.body.a19Type,
          a20Type: req.body.a20Type,
          a21Type: req.body.a21Type,
          a22Type: req.body.a22Type,
          a23Type: req.body.a23Type,
          a24Type: req.body.a24Type,
          a25Type: req.body.a25Type,
          a26Type: req.body.a26Type,
          a27Type: req.body.a27Type,
          a28Type: req.body.a28Type,
          a29Type: req.body.a29Type,
          a30Type: req.body.a30Type,
          a31Type: req.body.a31Type,
          a32Type: req.body.a32Type,
          a33Type: req.body.a33Type,
          a34Type: req.body.a34Type,
          a35Type: req.body.a35Type,
          a36Type: req.body.a36Type,
          a37Type: req.body.a37Type,
          a38Type: req.body.a38Type,
          a39Type: req.body.a39Type,
          a40Type: req.body.a40Type,
          a41Type: req.body.a41Type,
          a42Type: req.body.a42Type,
          a43Type: req.body.a43Type,
          a44Type: req.body.a44Type,
          a45Type: req.body.a45Type,
          a46Type: req.body.a46Type,
          a47Type: req.body.a47Type,
          a48Type: req.body.a48Type,
          a49Type: req.body.a49Type,
          a50Type: req.body.a50Type,
          a51Type: req.body.a51Type,
          a52Type: req.body.a52Type,
          a53Type: req.body.a53Type,
          a54Type: req.body.a54Type,
          a55Type: req.body.a55Type,
          a56Type: req.body.a56Type,
          a57Type: req.body.a57Type,
          a58Type: req.body.a58Type,
          a59Type: req.body.a59Type,
          a60Type: req.body.a60Type,
          a61Type: req.body.a61Type,
          a62Type: req.body.a62Type,
          a63Type: req.body.a63Type,
          a64Type: req.body.a64Type,
          a65Type: req.body.a65Type,
          a66Type: req.body.a66Type,
          a67Type: req.body.a67Type,
          a68Type: req.body.a68Type,
          a69Type: req.body.a69Type,
          a70Type: req.body.a70Type,
          a71Type: req.body.a71Type,
          a72Type: req.body.a72Type,
          a73Type: req.body.a73Type,
          a74Type: req.body.a74Type,

          b0Type: req.body.b0Type,
          b1Type: req.body.b1Type,
          b2Type: req.body.b2Type,
          b3Type: req.body.b3Type,
          b4Type: req.body.b4Type,
          b5Type: req.body.b5Type,
          b6Type: req.body.b6Type,
          b7Type: req.body.b7Type,
          b8Type: req.body.b8Type,
          b9Type: req.body.b9Type,
          b10Type: req.body.b10Type,
          b11Type: req.body.b11Type,
          b12Type: req.body.b12Type,
          b13Type: req.body.b13Type,
          b14Type: req.body.b14Type,
          b15Type: req.body.b15Type,
          b16Type: req.body.b16Type,
          b17Type: req.body.b17Type,
          b18Type: req.body.b18Type,
          b19Type: req.body.b19Type,
          b20Type: req.body.b20Type,
          b21Type: req.body.b21Type,
          b22Type: req.body.b22Type,
          b23Type: req.body.b23Type,
          b24Type: req.body.b24Type,

          c0Type: req.body.c0Type,
          c1Type: req.body.c1Type,
          c2Type: req.body.c2Type,
          c3Type: req.body.c3Type,
          c4Type: req.body.c4Type,
          c5Type: req.body.c5Type,
          c6Type: req.body.c6Type,
          c7Type: req.body.c7Type,
          c8Type: req.body.c8Type,
          c9Type: req.body.c9Type,
          c10Type: req.body.c10Type,
          c11Type: req.body.c11Type,
          c12Type: req.body.c12Type,
          c13Type: req.body.c13Type,
          c14Type: req.body.c14Type,
          c15Type: req.body.c15Type,
          c16Type: req.body.c16Type,
          c17Type: req.body.c17Type,
          c18Type: req.body.c18Type,
          c19Type: req.body.c19Type,
          c20Type: req.body.c20Type,
          c21Type: req.body.c21Type,
          c22Type: req.body.c22Type,
          c23Type: req.body.c23Type,
          c24Type: req.body.c24Type,

          d0Type: req.body.d0Type,
          d1Type: req.body.d1Type,
          d2Type: req.body.d2Type,
          d3Type: req.body.d3Type,
          d4Type: req.body.d4Type,
          d5Type: req.body.d5Type,
          d6Type: req.body.d6Type,
          d7Type: req.body.d7Type,
          d8Type: req.body.d8Type,
          d9Type: req.body.d9Type,
          d10Type: req.body.d10Type,
          d11Type: req.body.d11Type,
          d12Type: req.body.d12Type,
          d13Type: req.body.d13Type,
          d14Type: req.body.d14Type,
          d15Type: req.body.d15Type,
          d16Type: req.body.d16Type,
          d17Type: req.body.d17Type,
          d18Type: req.body.d18Type,
          d19Type: req.body.d19Type,
          d20Type: req.body.d20Type,
          d21Type: req.body.d21Type,
          d22Type: req.body.d22Type,
          d23Type: req.body.d23Type,
          d24Type: req.body.d24Type,

          e0Type: req.body.e0Type,
          e1Type: req.body.e1Type,
          e2Type: req.body.e2Type,
          e3Type: req.body.e3Type,
          e4Type: req.body.e4Type,
          e5Type: req.body.e5Type,
          e6Type: req.body.e6Type,
          e7Type: req.body.e7Type,
          e8Type: req.body.e8Type,
          e9Type: req.body.e9Type,
          e10Type: req.body.e10Type,
          e11Type: req.body.e11Type,
          e12Type: req.body.e12Type,
          e13Type: req.body.e13Type,
          e14Type: req.body.e14Type,
          e15Type: req.body.e15Type,
          e16Type: req.body.e16Type,
          e17Type: req.body.e17Type,
          e18Type: req.body.e18Type,
          e19Type: req.body.e19Type,
          e20Type: req.body.e20Type,
          e21Type: req.body.e21Type,
          e22Type: req.body.e22Type,
          e23Type: req.body.e23Type,
          e24Type: req.body.e24Type,

          f0Type: req.body.f0Type,
          f1Type: req.body.f1Type,
          f2Type: req.body.f2Type,
          f3Type: req.body.f3Type,
          f4Type: req.body.f4Type,
          f5Type: req.body.f5Type,
          f6Type: req.body.f6Type,
          f7Type: req.body.f7Type,
          f8Type: req.body.f8Type,
          f9Type: req.body.f9Type,
          f10Type: req.body.f10Type,
          f11Type: req.body.f11Type,
          f12Type: req.body.f12Type,
          f13Type: req.body.f13Type,
          f14Type: req.body.f14Type,
          f15Type: req.body.f15Type,
          f16Type: req.body.f16Type,
          f17Type: req.body.f17Type,
          f18Type: req.body.f18Type,
          f19Type: req.body.f19Type,
          f20Type: req.body.f20Type,
          f21Type: req.body.f21Type,
          f22Type: req.body.f22Type,
          f23Type: req.body.f23Type,
          f24Type: req.body.f24Type,

          g0Type: req.body.g0Type,
          g1Type: req.body.g1Type,
          g2Type: req.body.g2Type,
          g3Type: req.body.g3Type,
          g4Type: req.body.g4Type,
          g5Type: req.body.g5Type,
          g6Type: req.body.g6Type,
          g7Type: req.body.g7Type,
          g8Type: req.body.g8Type,
          g9Type: req.body.g9Type,
          g10Type: req.body.g10Type,
          g11Type: req.body.g11Type,
          g12Type: req.body.g12Type,
          g13Type: req.body.g13Type,
          g14Type: req.body.g14Type,
          g15Type: req.body.g15Type,
          g16Type: req.body.g16Type,
          g17Type: req.body.g17Type,
          g18Type: req.body.g18Type,
          g19Type: req.body.g19Type,
          g20Type: req.body.g20Type,
          g21Type: req.body.g21Type,
          g22Type: req.body.g22Type,
          g23Type: req.body.g23Type,
          g24Type: req.body.g24Type,

          h0Type: req.body.h0Type,
          h1Type: req.body.h1Type,
          h2Type: req.body.h2Type,
          h3Type: req.body.h3Type,
          h4Type: req.body.h4Type,
          h5Type: req.body.h5Type,
          h6Type: req.body.h6Type,
          h7Type: req.body.h7Type,
          h8Type: req.body.h8Type,
          h9Type: req.body.h9Type,
          h10Type: req.body.h10Type,
          h11Type: req.body.h11Type,
          h12Type: req.body.h12Type,
          h13Type: req.body.h13Type,
          h14Type: req.body.h14Type,
          h15Type: req.body.h15Type,
          h16Type: req.body.h16Type,
          h17Type: req.body.h17Type,
          h18Type: req.body.h18Type,
          h19Type: req.body.h19Type,
          h20Type: req.body.h20Type,
          h21Type: req.body.h21Type,
          h22Type: req.body.h22Type,
          h23Type: req.body.h23Type,
          h24Type: req.body.h24Type,

          i0Type: req.body.i0Type,
          i1Type: req.body.i1Type,
          i2Type: req.body.i2Type,
          i3Type: req.body.i3Type,
          i4Type: req.body.i4Type,
          i5Type: req.body.i5Type,
          i6Type: req.body.i6Type,
          i7Type: req.body.i7Type,
          i8Type: req.body.i8Type,
          i9Type: req.body.i9Type,
          i10Type: req.body.i10Type,
          i11Type: req.body.i11Type,
          i12Type: req.body.i12Type,
          i13Type: req.body.i13Type,
          i14Type: req.body.i14Type,
          i15Type: req.body.i15Type,
          i16Type: req.body.i16Type,
          i17Type: req.body.i17Type,
          i18Type: req.body.i18Type,
          i19Type: req.body.i19Type,
          i20Type: req.body.i20Type,
          i21Type: req.body.i21Type,
          i22Type: req.body.i22Type,
          i23Type: req.body.i23Type,
          i24Type: req.body.i24Type,

          j0Type: req.body.j0Type,
          j1Type: req.body.j1Type,
          j2Type: req.body.j2Type,
          j3Type: req.body.j3Type,
          j4Type: req.body.j4Type,
          j5Type: req.body.j5Type,
          j6Type: req.body.j6Type,
          j7Type: req.body.j7Type,
          j8Type: req.body.j8Type,
          j9Type: req.body.j9Type,
          j10Type: req.body.j10Type,
          j11Type: req.body.j11Type,
          j12Type: req.body.j12Type,
          j13Type: req.body.j13Type,
          j14Type: req.body.j14Type,
          j15Type: req.body.j15Type,
          j16Type: req.body.j16Type,
          j17Type: req.body.j17Type,
          j18Type: req.body.j18Type,
          j19Type: req.body.j19Type,
          j20Type: req.body.j20Type,
          j21Type: req.body.j21Type,
          j22Type: req.body.j22Type,
          j23Type: req.body.j23Type,
          j24Type: req.body.j24Type,

          promotionalDiscount: req.body.promotionalDiscount,
          promotionalDiscountReason: req.body.promotionalDiscountReason,

          GST: req.body.GST,
          countGST: parseInt(v_countNetAmount * ((req.body.GST) / 100)),

          countNetAmount: parseInt(v_countNetAmount),
          countNetAmountForAfterDiscount: v_countNetAmount,

          countGrandTotal: parseInt(v_countNetAmount + parseInt(v_countNetAmount * ((req.body.GST) / 100))),

          orderDateToShow: date.format(new Date(), "DD-MM-YYYY"),
          orderTimeToShow: date.format(new Date(), "hh:mmA"),
          orderDateTimeToShow: date.format(new Date(), "DD-MM-YYYY hh:mmA"),

          DateForFilter: date.format(new Date(), "YYYY-MM-DD"),
          MonthForFilter: date.format(new Date(), "YYYY-MM"),

          expirationDate: new Date(Date.now() + (3456000000)), // Expire After 40 day
        };
        new POS(newOrder).save().then(idea => {
          req.flash("success_msg", "Order is Taken");
          res.redirect("/pos/posBranch_1/billKitchenOrderTicket");
        });
      }
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // Running Order posBranch_1
  posBranch_1.get('/runningOrder/:id', ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS.findOne({ _id: req.params.id })
        .then(pos => {
          Menu.find({ branchName: req.user.branchName /**/ })
            .sort({ _id: -1 })
            .limit(1)
            .then(menu => {
              res.render('pos/posBranch_1/runningOrder', {
                pos: pos,
                menu: menu,
                name: req.user.name,
                branchToShow: req.user.branchName /**/
              });
            });
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // Running Order Process
  posBranch_1.put('/runningOrderTaking/:id', ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      var v_countNetAmountMenuBaked = 0, v_countNetAmountMenuFried = 0, v_countNetAmountMenuBar = 0;
      var v_countNetAmount = 0;
      var first = "a", last = "z";

      POS.findOne({
        _id: req.params.id
      })
        .then(pos => {

          function POS_TodaySaleCount(
            string_Check_Name,
            string_Check_Quantity,
            string_Check_TotalPrice,
            string_Check_Type
          ) {
            // today POS Sale Start
            POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
              POS_TodaySale => {
                POS_TodaySale[string_Check_Name] = req.body[string_Check_Name];
                POS_TodaySale[string_Check_Quantity] += parseInt(
                  req.body[string_Check_Quantity]
                );
                POS_TodaySale[string_Check_TotalPrice] += parseInt(
                  req.body[string_Check_TotalPrice]
                );

                switch (req.body[string_Check_Type]) {
                  case "menuBaked":
                    POS_TodaySale.countMenuBaked += v_countNetAmountMenuBaked;
                    break;
                  case "menuFried":
                    POS_TodaySale.countMenuFried += v_countNetAmountMenuFried;
                    break;
                  case "menuBar":
                    POS_TodaySale.countMenuBar += v_countNetAmountMenuBar;
                    break;
                  default:
                    POS_TodaySale.countMenuBaked += v_countNetAmountMenuBaked;
                }

                POS_TodaySale.save();
              }
            );
          }

          ///////////////////////////////////////////////////////////////////////////////////////////////////
          //**********************   Loop for A section item Count Data   **********************//
          for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
            for (var i = 0; i <= 90; i++) {
              var string_Check_Name = eval("String.fromCharCode(" + j + ")") + i + "Name";
              var string_Check_Type = eval("String.fromCharCode(" + j + ")") + i + "Type";
              var string_Check_Price = eval("String.fromCharCode(" + j + ")") + i + "Price";
              var string_Check_Quantity = eval("String.fromCharCode(" + j + ")") + i + "Quantity";
              var string_Check_TotalPrice = eval("String.fromCharCode(" + j + ")") + i + "TotalPrice";

              if (req.body[string_Check_Quantity] != null) {

                v_countNetAmount += parseInt(req.body[string_Check_TotalPrice]);

                switch (req.body[string_Check_Type]) {
                  case "menuBaked":
                    v_countNetAmountMenuBaked += parseInt(req.body[string_Check_TotalPrice]);
                    break;
                  case "menuFried":
                    v_countNetAmountMenuFried += parseInt(req.body[string_Check_TotalPrice]);
                    break;
                  case "menuBar":
                    v_countNetAmountMenuBar += parseInt(req.body[string_Check_TotalPrice]);
                    break;
                  default:
                    v_countNetAmountMenuBaked += parseInt(req.body[string_Check_TotalPrice]);
                }

                if (pos[string_Check_Quantity] != null) {
                  pos[string_Check_Quantity] += parseInt(req.body[string_Check_Quantity]);
                  pos[string_Check_TotalPrice] += parseInt(req.body[string_Check_TotalPrice]);
                }
                else {
                  pos[string_Check_Name] = req.body[string_Check_Name];
                  pos[string_Check_Price] = parseInt(req.body[string_Check_Price]);
                  pos[string_Check_Quantity] = parseInt(req.body[string_Check_Quantity]);
                  pos[string_Check_TotalPrice] = parseInt(req.body[string_Check_TotalPrice]);
                }

                pos.countNetAmount += parseInt(req.body[string_Check_TotalPrice]);
                pos.countGrandTotal += parseInt(req.body[string_Check_TotalPrice]);
                pos.countNetAmountForAfterDiscount += parseInt(req.body[string_Check_TotalPrice]);

                POS_TodaySaleCount(string_Check_Name, string_Check_Quantity, string_Check_TotalPrice, string_Check_Type);
              }
            }
          }
          POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
            POS_TodaySale => {
              POS_TodaySale.countNetAmount += v_countNetAmount;
              POS_TodaySale.countNetAmountForAfterDiscount += v_countNetAmount;
              POS_TodaySale.save();
            }
          );
          //**********************   Ending Loop for A section item Count Data   **********************//
          ///////////////////////////////////////////////////////////////////////////////////////////////////


          pos.save()
            .then(pos => {
              //req.flash('success_msg', 'Item updated');

              res.redirect('/pos/posBranch_1/takeOrder');
            })
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });

  // discount + Invoiced Bill Form process
  posBranch_1.put('/orderInvoice/:id', ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS.findOne({ _id: req.params.id })
        .then(pos => {

          var v_grandtotalMinus = pos.countGrandTotal;

          pos.invoiceStatus = "Invoiced ✔";
          pos.invoiceColor = "#848484";
          pos.orderStatusColor = "#468b20";
          pos.openModelStatus = "open";

          pos.discountOrderInPrecentage = 0
          pos.discountOrderInPrice = 0;

          if (req.body.discountOrderInPrecentage != null && pos.promotionalDiscount == 0) {
            pos.discountOrderInPrecentage = ((parseInt(pos.countNetAmount) / 100) * parseInt(req.body.discountOrderInPrecentage)).toFixed();

            pos.countNetAmountForAfterDiscount -= pos.discountOrderInPrecentage;
            pos.discountOrderInPrecentageString = req.body.discountOrderInPrecentage;

            pos.discountReference = req.body.discountReference;

            pos.countGrandTotal = pos.countNetAmountForAfterDiscount + pos.countGST;
          }



          if (req.body.discountOrderInPrice != null) {
            pos.discountOrderInPrice = req.body.discountOrderInPrice;
            pos.countNetAmountForAfterDiscount -= pos.discountOrderInPrice;

            pos.discountReference = req.body.discountReference;

            pos.countGrandTotal = pos.countNetAmountForAfterDiscount + pos.countGST;
          }

          if (pos.promotionalDiscount > 0) {
            pos.discountOrderInPrecentage = ((parseInt(pos.countNetAmount) / 100) * parseInt(pos.promotionalDiscount)).toFixed();
            pos.discountOrderInPrecentageString = pos.promotionalDiscount;
            pos.countNetAmountForAfterDiscount -= pos.discountOrderInPrecentage;
            pos.discountReference = pos.promotionalDiscountReason;

            pos.countGrandTotal = pos.countNetAmountForAfterDiscount + pos.countGST;
          }

          if (pos.countGrandTotal != v_grandtotalMinus) {
            POS_TodaySale.findOne({ branchName: req.user.branchName /**/ }).then(
              POS_TodaySale => {
                POS_TodaySale.countPendingCash -= v_grandtotalMinus - pos.countGrandTotal;
                POS_TodaySale.save();
              }
            );
          }
          pos.save()
            .then(pos => {
              res.redirect('/pos/posBranch_1/billInvoiceOrder/' + pos._id);
            })
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }
  });
 

  // Edit Item Bill
  posBranch_1.get('/editItemBill/:id', ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS.findOne({ _id: req.params.id })
        .then(pos => {
          POS_TodaySale.find(function (err, pos_TodaySale) {
            res.render('pos/posBranch_1/editItemBill', {
              pos: pos,
              pos_TodaySale: pos_TodaySale
            });
          });
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }

  });

  //////////////////////////////////////////////////////////////

  // Running Order
  posBranch_1.put('/editItemBill/:id', ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      var first = "a", last = "z";
      var minus_string_CheckTotal_Bar_Price = 0, minus_string_CheckTotal_Baked_Price = 0, minus_string_CheckTotal_Fried_Price = 0, minus_string_CheckTotal_Total_Price = 0;

      POS.findOne({ _id: req.params.id })
        .then(pos => {
          ///////////////////////////////////////////////////////////////////////////////////////////////////
          //**********************   Loop for A section item Count Data   **********************//
          for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
            for (var i = 0; i <= 90; i++) {
              var string_Check_Type = eval("String.fromCharCode(" + j + ")") + i + "Type";
              var string_Check_Price = eval("String.fromCharCode(" + j + ")") + i + "Price";
              var string_Check_Quantity = eval("String.fromCharCode(" + j + ")") + i + "Quantity";
              var string_Check_TotalPrice = eval("String.fromCharCode(" + j + ")") + i + "TotalPrice";
              var string_Check_Del = eval("String.fromCharCode(" + j + ")") + i + "Del";



              if (req.body[string_Check_Del] == "yes") {
                //console.log(string_Check_Del + " <> "+ req.body[string_Check_Del] + " <> "+ pos[string_Check_Quantity]+ " <> "+ req.body[string_Check_Quantity])

                var diff = pos[string_Check_Quantity] - req.body[string_Check_Quantity];
                var minus_Quantity = pos[string_Check_Quantity] - diff;

                /* var minus_string_Check_TotalPrice = pos[string_Check_TotalPrice];  */
                /*  var minus_CheckType = pos[string_Check_Type];  */
                switch (pos[string_Check_Type]) {
                  case "menuBaked": {
                    minus_string_CheckTotal_Baked_Price += pos[string_Check_Price] * diff;
                    minus_string_CheckTotal_Total_Price += pos[string_Check_Price] * diff;
                  }
                    break;
                  case "menuFried": {
                    minus_string_CheckTotal_Fried_Price += pos[string_Check_Price] * diff;
                    minus_string_CheckTotal_Total_Price += pos[string_Check_Price] * diff;
                  }
                    break;
                  case "menuBar": {
                    minus_string_CheckTotal_Bar_Price += pos[string_Check_Price] * diff;
                    minus_string_CheckTotal_Total_Price += pos[string_Check_Price] * diff;
                  }
                    break;
                  default: {
                    minus_string_CheckTotal_Baked_Price += pos[string_Check_Price] * diff;
                    minus_string_CheckTotal_Total_Price += pos[string_Check_Price] * diff;
                  }

                }

                ////////////// 
                POS_TodaySaleCountEditItemBill111(string_Check_Quantity, string_Check_TotalPrice, diff, minus_string_CheckTotal_Total_Price);

                function POS_TodaySaleCountEditItemBill111(string_Check_Quantity, string_Check_TotalPrice, diff, minus_string_CheckTotal_Total_Price) {
                  POS_TodaySale.findOne({ branchName: req.user.branchName /**/ })

                    .then(POS_TodaySale => {
                      POS_TodaySale[string_Check_Quantity] -= diff;
                      POS_TodaySale[string_Check_TotalPrice] -= minus_string_CheckTotal_Total_Price;

                      POS_TodaySale.save()
                        .then(todaySale => {
                        })
                    });
                  //////////////
                }

                if (pos.GST > 0) {
                  pos.countGrandTotal -= (pos[string_Check_Price] * diff) + parseInt((pos[string_Check_Price] * diff) * (pos.GST / 100));
                  pos.countNetAmountForAfterDiscount -= (pos[string_Check_Price] * diff) + parseInt((pos[string_Check_Price] * diff) * (pos.GST / 100));
                  pos.countNetAmount -= (pos[string_Check_Price] * diff) + parseInt((pos[string_Check_Price] * diff) * (pos.GST / 100));
                  pos[string_Check_Quantity] -= minus_Quantity;
                  /* pos[string_Check_Price] = 0; */
                  pos[string_Check_TotalPrice] -= minus_string_CheckTotal_Total_Price;
                }
                else {
                  pos.countGrandTotal -= minus_string_CheckTotal_Total_Price;
                  pos.countNetAmountForAfterDiscount -= pos[string_Check_TotalPrice];
                  pos.countNetAmount -= pos[string_Check_TotalPrice];
                  pos[string_Check_Quantity] = minus_Quantity;
                  /* pos[string_Check_Price] = 0; */
                  pos[string_Check_TotalPrice] -= minus_string_CheckTotal_Total_Price;
                }


              }
            }
          }
          ///////////////////////////////////////////////////////
          POS_TodaySaleCountEditItemBill(string_Check_Quantity, diff, minus_string_CheckTotal_Total_Price, minus_string_CheckTotal_Baked_Price, minus_string_CheckTotal_Fried_Price, minus_string_CheckTotal_Bar_Price);
          function POS_TodaySaleCountEditItemBill(string_Check_Quantity, diff, minus_string_CheckTotal_Total_Price, minus_string_CheckTotal_Baked_Price, minus_string_CheckTotal_Fried_Price, minus_string_CheckTotal_Bar_Price) {
            POS_TodaySale.findOne({ branchName: req.user.branchName /**/ })

              .then(POS_TodaySale => {
                POS_TodaySale[string_Check_Quantity] -= diff;
                POS_TodaySale[string_Check_TotalPrice] -= minus_string_CheckTotal_Total_Price;

                /* console.log( POS_TodaySale.countPendingCash + " < UP > " + minus_string_CheckTotal_Total_Price); */
                POS_TodaySale.countPendingCash -= minus_string_CheckTotal_Total_Price;
                POS_TodaySale.countRefundCash += minus_string_CheckTotal_Total_Price;
                /*  console.log( POS_TodaySale.countPendingCash + " < Down > " + minus_string_CheckTotal_Total_Price); */

                POS_TodaySale.countMenuBaked -= minus_string_CheckTotal_Baked_Price;
                POS_TodaySale.countMenuFried -= minus_string_CheckTotal_Fried_Price;
                POS_TodaySale.countMenuBar -= minus_string_CheckTotal_Bar_Price;

                POS_TodaySale.save()
                  .then(todaySale => {
                  })
              });
            //////////////
          }
          pos.save()
            .then(pos => {
              res.redirect('/pos/posBranch_1/pendingBillLog');
            })
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }

  });

  // Delete Idea
  posBranch_1.delete('/pendingBillDel/:id', ensureAuthenticated, (req, res) => {
    if (req.user.authority == 'FSDHOMS' || req.user.authority == 'POS_Koh-e-Nor' || req.user.authority == 'POS_Gulberg' || req.user.authority == 'POS_Hariyawala' || req.user.authority == 'POS_Lahore' || req.user.authority == 'POS_Bahawalpur' || req.user.authority == 'POS_Sahiwal' || req.user.authority == 'POS_Bosan' || req.user.authority == 'POS_KaswarGardezi' || req.user.authority == 'RedPigeons') {

      POS.remove({ _id: req.params.id })
        .then(() => {
          req.flash('success_msg', 'The Bill has been removed');
          res.redirect("/pos/posBranch_1/pendingBillLog");
        });
    }
    else {
      res.redirect("/ideas/errorPage");
    }

  });

  function escapeRegex(text) {
    return ("" + text).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  return posBranch_1;
})();