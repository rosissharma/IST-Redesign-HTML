$(document).ready(function () {
  buildSection('about');
});

function buildSection(section) {
  switch (section) {
    //ABOUT Section
    case 'about':
      xhr('get', { path: '/about/' }, '#about').done(function (json) {
        $('#about').append('<h2 style="text-transform: capitalize;">' + json.title + '</h2>' + '<h4>' + json.description + '</h4><h4>" ' + json.quote + ' "</h4><h5 style="font-style: italic;">~' + json.quoteAuthor + '</h5>');
        buildSection('undergrad');
      });
      break;

    //UNDERGRAD Section
    case 'undergrad':
      xhr('get', { path: '/degrees/undergraduate/' }, '#undergrad').done(function (json) {
        $.each(json.undergraduate, function (i, item) {
          $('#undergrad').append('<div id=' + this.degreeName + ' class="ugad"></div>');
          var divID = "#" + this.degreeName;
          $(divID).append('<h2>' + this.title + '</h2><p>' +
            item.description + '</p><div id=' + this.degreeName + '-container class="modal-content"></div>').css('cursor', 'pointer').on('click', function () {
              $(divID + '-container').toggle();
            }).find(divID + '-container').css('display', 'none');
          //add concentrations to the major
          $.each(item.concentrations, function (index, val) {
            $(divID + '-container').append('<h5>' + val + '</h5>');
          });
          $(divID + '-container').append('<p>To learn more about this program, click below:</p><a href="https://' + this.degreeName + '.rit.edu">https://' + this.degreeName + '.rit.edu</a>');
        });
        //lastly build next section
        buildSection('grad');
      });
      break;

    //GRAD Section
    case 'grad':
      xhr('get', { path: '/degrees/graduate/' }, '#grad').done(function (json) {
        $.each(json.graduate, function (i, item) {
          //for each grduate major that is not a certificate, build the containers
          if (this.degreeName != 'graduate advanced certificates') {
            $('#grad').append('<div id=' + this.degreeName + ' class="ritgrad"></div>');
            var divID = "#" + this.degreeName;
            $(divID).append('<h2>' + this.title + '</h2><p>' + item.description + '</p><div id=' + this.degreeName + '-container class="modal-content"></div>').css('cursor', 'pointer').on('click', function () {
              $(divID + '-container').toggle();//toggle display
            }).children(divID + '-container').css('display', 'none');
            //add concentrations to the major
            $.each(item.concentrations, function (index, val) {
              $(divID + '-container').append('<h5>' + val + '</h5>');
            });
            $(divID + '-container').append('<p>To learn more about this program, click below:</p><a href="https://' + this.degreeName + '.rit.edu">https://' + this.degreeName + '.rit.edu</a>');
            //build the certificates and append links to program sites
          } else {
            $('#certif').append('<div id="certificates"><h1>Our Graduate Advanced Certificates</h1></div>');
            $.each(item.availableCertificates, function (index, val) {
              var newEl = $('<h5>' + val + '</h5>');
              $('#certificates').append(newEl);
              newEl.on('click', function () {
                if (index == 0) {
                  window.open('https://www.rit.edu/study/web-development-adv-cert', 'target=_blank');
                } else {
                  window.open('https://www.rit.edu/study/networking-planning-and-design-adv-cert', 'target=_blank');
                }
              }).css('cursor', 'pointer');
            });
          }
        });
        buildSection('minors');
      });
      break;

    //MINOR Section
    case 'minors':
      xhr('get', { path: '/minors/' }).done(function (json) {
        var x = "";
        var minorContainer = $(".minor-grid-container");

        $.each(json.UgMinors, function (i, item) {
          var minorItem = $('<div style="border: 1px solid coral; cursor: pointer;"></div>').addClass('minor-grid-item');
          var h2minor = $('<h4 style="text-transform: capitalize;"></h4>').addClass('minor').attr('data-minor-name', item.name).text(item.title);
          minorItem.append(h2minor);
          minorItem.on('click', function () {
            minorItem.append("");
            h2minor.after(item.description);
            h2minor.after(item.courses);
          });
          minorContainer.append(minorItem);
        });//for each
        buildSection('employment');
      });
      break;


    //EMPLOYMENT Section
    case 'employment':
      xhr('get', { path: '/employment/' }, '#employment').done(function (json) {
        var x = '<div class="employment-grid-container">';
        $.each(json.introduction.content, function () {
          x += '<div class="employment-grid-item"><h2>' + this.title + '</h2><hr style="width: 25%; margin: 8px auto;"><p style="line-height: 1.4em;">' + this.description + '</p></div>';
        });
        $('#employment').prepend('<h1>' + json.introduction.title + '</h1>' + x + '</div>');
      });

      (function loadCoopTable() {
        xhr('get', { path: '/employment/coopTable/' }, '#coopTable').done(function (json) {
          var x = '<tbody>';
          $('#coopbutton').on('click', function () {
            $.each(json.coopTable.coopInformation, function () {
              x += '<tr><td>' + this.employer + '</td><td>' + this.degree + '</td><td>' + this.city + '</td><td>' + this.term + '</td></tr>'
            });
            x += '</tbody>';
            $('#coopTable').before('<h3>' + json.coopTable.title + '</h3>').append(x);
          });
        });
      })();

      (function loadEmploymentTable() {
        xhr('get', { path: '/employment/employmentTable/' }, '#employmentTable').done(function (json) {
          var x = '<tbody>';
          $('#employmentbutton').on('click', function () {
            $.each(json.employmentTable.professionalEmploymentInformation, function () {
              x += '<tr><td>' + this.degree + '</td><td>' + this.employer + '</td><td>' + this.city + '</td><td>' + this.title + '</td><td>' + this.startDate + '</td></tr>'
            });
            x += '</tbody>';
            $('#employmentTable').before('<h3>' + json.employmentTable.title + '</h3>').append(x);
          });
        });
      })();
      buildSection('people');

      break;


    //PEOPLE Section
    case 'people':
      xhr('get', { path: '/people/' }, '#people').done(function (json) {
        // $('#people').append('<h1>'+json.title+'</h1><h4>'+json.subTitle+'</h4>');
        //put out all of the faculty

        $.each(json.faculty, function (index, item) {
          var facultyItem = $('<div></div>').addClass('faculty-grid-item');
          var h5people = $("<h5>" + item.name + "</h5>");
          var peopleImg = $("<img src='" + item.imagePath + "'style='max-width:150px; max-height:150px;'/>");
          var peopleDiv = $("<div class='faculty'></div>").append(h5people).append(peopleImg);
          $('#faculty').append(peopleDiv);
          peopleImg.on('click', function () {
            //  peopleImg.after('<br>' + getValues(item, ['username', 'name', 'tagline',
            // 'title', 'interestArea', 'office', 'website', 'phone',
            //  'email', 'twitter', 'facebook']));

            peopleImg.after('<br>' + item.username + '<br>' + item.name + '<br>' + item.tagline +
              '<br>' + item.title + '<br>' + item.interestArea + '<br>' + item.office + '<br>' + item.website +
              '<br>' + item.phone + '<br>' + item.email + '<br>' + item.twitter + '<br>' + item.facebook);

          });
        }); //for each image faculty

        $.each(json.staff, function (index, item) {
          var staffItem = $('<div></div>').addClass('staff-grid-item');
          var h5staff = $("<h5>" + item.name + "</h5>");
          var staffImg = $("<img src='" + item.imagePath + "'style='max-width:150px;max-height:150px'/>");
          var staffDiv = $("<div class='staff'></div>").append(h5staff).append(staffImg);
          $('#staff').append(staffDiv);
          staffImg.on('click', function () {
            //  staffImg.after('<br>' + getValues(item, ['username', 'name', 'tagline',
            // 'title', 'interestArea', 'office', 'website', 'phone',
            //  'email', 'twitter', 'facebook']));

            staffImg.after('<br>' + item.username + '<br>' + item.name + '<br>' + item.tagline +
              '<br>' + item.title + '<br>' + item.interestArea + '<br>' + item.office + '<br>' + item.website +
              '<br>' + item.phone + '<br>' + item.email + '<br>' + item.twitter + '<br>' + item.facebook);

          });
        }); //for each image staff
      });
      buildSection('research');
      break;

    //Research
    case 'research':
      xhr('get', { path: '/research/' }, '#research').done(function (json) {
        $.each(json.byInterestArea, function (index, item) {
          // var interestItem = $('<div></div>').addClass('interest-grid-item');
          var h1research = $('<h3 class="interest-grid-item")></h3>').text(item.areaName);
          $('#research').append(h1research); // 12 interest areas
          h1research.on('click', function () {
            h1research.after(item.citations);
          });
        });

        $.each(json.byFaculty, function (index, item) {
          var h1faculty = $('<h3 class="facultyre-grid-item"></h3>').text(item.facultyName);
          $('#facultyre').append(h1faculty); // 12 interest areas
          h1faculty.on('click', function () {
            h1faculty.after(item.citations);
          });
        });
        buildSection('resources');
      });
      break;

    //Resources
    case 'resources':
      xhr('get', { path: '/resources/' }, '#resources').done(function (json) {
        // var heading = '<h2>' + json.title + '</h2><h3>' + json.subTitle + '</h3>';
        // $('#resources').append(heading);

        var tutors = '<div class="resources-grid-item"><h2>' + json.tutorsAndLabInformation.title + '</h2></div>';
        var ambassadors = '<div class="resources-grid-item"><h2>' + json.studentAmbassadors.title + '</h2></div>';
        var forms = '<div class="resources-grid-item"><div<h2>Forms</h2></div>';
        var coop = '<div class="resources-grid-item"><div<h2>' + json.coopEnrollment.title + '</h2></div>';

        //STUDY ABROAD
        var studyAbroad = $('<div id="study" class="resources-grid-item"><h2>'
          + json.studyAbroad.title + '</h2></div>');
        var studyDesc = $('<p>' + json.studyAbroad.description + '</p>');
        $.each(json.studyAbroad.places, function (index, item) {
          studyAbroad.on('click', function () {
            console.log('hellp1');
            x = '<h4>' + item.nameOfPlace + '</h4><p>' + item.description + '</p>';
            $('#study').append(x);
          });//onclick
        });//foreach
        $('#study').append(studyDesc);


        // SERVICES/ADVISORS
        var services = '<div class="resources-grid-item"><h2>' + json.studentServices.title + '</h2></div>';
        $('.resources-grid-container').append(studyAbroad).append(services).append(tutors).append(ambassadors).append(forms).append(coop);

      });//xhr
      buildSection('news');
      break;

    case 'news':
      xhr('get', { path: '/news/' }, '#news').done(function (json) {
        $.each(json.older, function (index, item) {
          var h1title = $('<h3></h3>').text(item.title);
          var h1date = $('<h6></h6>').text(item.date.split(" ")[0]);
          var h1desc = $('<p></p>').text(item.description);
          $('#news-section').append(h1title).append(h1date);
          h1title.on('click', function () {
            h1date.after(h1desc);
          });
        });
      });
      buildSection('footer');
      break;

    //Footer
    case 'footer':
      xhr('get', { path: '/footer/' }, '#footer').done(function (json) {

        // var title = $('<h1>' + json.social.title + '</h1>');
        var tweet = $('<h3>' + json.social.tweet + "<br>" + json.social.by + '</h3>');
        var twitter = $('<h3><a href="' + json.social.twitter + '">' + json.social.twitter + '</a></h3>');
        var facebook = $('<h3><a href="' + json.social.facebook + '">' + json.social.facebook + '</a></h3>');
        $('#social').append(tweet);
        $('#twitter').append(twitter);
        $('#facebook').append(facebook);


        $.each(json.quickLinks, function (index, item) {
          var h1qlinks = $('<div class="quickLinks-grid-item"><h2>' + item.title + '</h2> <a style="color: #333;" class="links" href="' + item.href + '">' + item.href + '</a></div>');
          $('#quickLinks').append(h1qlinks);
        });//for each
      });//xhr
      buildSection('contact');

      break;

    //Contact
    case 'contact':
      xhrHTML('get', { path: '/contactForm.php' }).done(function (htm) {
        var contact = $('<div>' + htm + '</div>');
        $('#contact').append(contact);
      });
      break;

  }
}


//*************************************UTILITIES*********************************************//
//ajax utility
//	args
//		getPost - is this a get or post
//		d - data {path:'/about/'}
// 		[idForSpinner] - #parent - if we want spinner to show while loading
//	return
//		ajax object
//	use
//		xhr('get', {path:'/degrees/'}, '#parent').done(function(json){//do stuff});

function xhr(getPost, d, idForSpinner) {
  return $.ajax({
    type: getPost,
    url: 'proxy.php',
    cache: false,
    async: true,
    dataType: 'json',
    data: d,
    beforeSend: function () {
      //create the spinner if there is a 3rd arg
      $(idForSpinner).append('<img src="shazam.gif" class="dontUse" />');
    }
  }).always(function () {
    //kill spinner
    $(idForSpinner).find('.dontUse').fadeOut(500, function () {//find goes in and refines collection
      //kill it
      $(this).remove();
    });
  }).fail(function (err) {
    console.log(err);
  });
}//end xhr
/*xhrHTML('get',{path: '/contactForm.php'}).done(function(htm){

})*/
//d: {path: '/contactForm.php'}
function xhrHTML(getPost, d) {
  return $.ajax({
    type: getPost,
    url: 'proxy.php',
    cache: false,
    async: true,
    dataType: 'html',
    data: d,
    beforeSend: function () {
      //create the spinner if there is a 3rd arg
    }
  }).fail(function (err) {
    console.log(err);
  });
}//end xhr

// Get the modal
var modal = document.getElementById('myModal');
var modal1 = document.getElementById('myModal1');
//var minor = document.getElementById('minorModal');

// Get the button that opens the modal
var btn = document.getElementById('employmentbutton');
var btn1 = document.getElementById('coopbutton');
//var minors = document.getElementById('minorBtn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span1 = document.getElementsByClassName('close1')[0];
//var minorsClose = document.getElementsByClassName('minorsClose')[0];

// When the user clicks the button, open the modal 
btn.onclick = function () { modal.style.display = "block"; }
btn1.onclick = function () { modal1.style.display = 'block'; }
//btn3.onclick = function () { minor.style.display = 'block'; }

// When the user clicks on <span> (x), close the modal
span.onclick = function () { modal.style.display = "none"; }
span1.onclick = function () { modal1.style.display = 'none'; }
//span2.onclick = function () { minor.style.display = 'none'; }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) { modal.style.display = "none"; }
  else if (event.target == modal1) { modal1.style.display = 'none'; }
  //else if (event.target == minor) { minor.style.display = 'none'; }
}