// image object that sets up folders
var imagesObj = {
  'packaging': ["wegmans",
                "owl-house",
                "forge",
                "dogtown",
                "dead-witch" ],

  'posters': ["america",
              "japan",
              "children",
              "black-metal",
              "detroit"]
}

// check if a url exists
function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

// function to select a thumbnail
function select_thumb(folder) {

  // hide all the thumbnails
  var thumbs = document.querySelectorAll(".thumbs.row");
  Array.prototype.forEach.call(thumbs, function(e) {
    e.style.display = 'none';
  });

  // show the image and text
  document.querySelector("#"+folder+"-full").style.display = '';

  // change the location of the page
  //TODO

}

// function to append element to last of a selection
function append_last(selector, element) {

  var selection = document.querySelectorAll(selector);
  var last_selection = selection[selection.length - 1];
  last_selection.appendChild(element);

}

/* function to load images
 * root can be packaging or posters... 'images-' will be prepended when appr.
 * folders should be a list with each folder name inside 'images-<root>'
 */
function folder_loaders(root, folders) {

  // add the initial row (where the images will sit)
  var init_row = document.createElement('div');
  init_row.setAttribute('class', 'thumbs row ' + root );

  append_last("#thumbnails", init_row);

  // iterate through each packaging folder
  Array.prototype.forEach.call( folders, function(folder, index) {

    // get the image info
    var thumb_path = "images-" + root + "/" + folder + "/thumb.png";
    var alt_text_path = "images-" + root + "/" + folder + "/alt_text.txt";

    // div with thumb and text
    var new_element = document.createElement('div');
    new_element.setAttribute('class', "three columns");
    new_element.setAttribute('id', folder+'-thumb');
    new_element.innerHTML = '\
      <a href="#">\
        <img id="'+folder+'" class="thumb" src=' + thumb_path + ' onclick="select_thumb(\''+folder+'\')" width="100%">\
      </a>\
      <p class="'+folder+'-thumb alt-text"></p>\
    ';

    // append the div
    append_last(".thumbs.row", new_element)

    // load in the alt_text
    var alt_text_loader = new XMLHttpRequest();
    alt_text_loader.open("GET",alt_text_path,true);
    alt_text_loader.send();

    alt_text_loader.onreadystatechange = function() {
      if (this.readyState== 4 && this.status == 200){
        alt_element = document.querySelector("p."+folder+"-thumb.alt-text");
        alt_element.innerHTML = this.responseText;
      }
    }

    // if this is the last image in a row
    if (index%3 == 2) {
      // start the next row
      var next_row = document.createElement('div');
      next_row.setAttribute('class', 'thumbs row ' + root );
      append_last("#thumbnails", next_row)
    }

    // load in the full_text
    var full_text;
    var text_blocks;
    var full_text_loader = new XMLHttpRequest();
    full_text_loader.open("GET",full_text_path,true);
    full_text_loader.send();

    // load and prepare full text for multiple images
    full_text_loader.onreadystatechange = function() {
      if (this.readyState== 4 && this.status == 200){
        full_text = this.responseText;
        text_blocks = full_text.split(";");
      }
    }

    // get the info for the full page version
    var full_path = "images-" + root + "/" + folder + "/full.png";
    var full_text_path = "images-" + root + "/" + folder + "/full_text.txt";

    var full_images_div = document.createElement('div');
    full_images_div.setAttribute('class', "full-images row");
    full_images_div.setAttribute('id', folder+'-full');

    function newFullSection(folder, imageSrc, text) {
      var new_image_div = document.createElement('div');
      new_image_div.setAttribute('class', folder+"-full image-container eight columns");
      new_image_div.innerHTML = '\
        <img class="full-image" src=' + full_path + ' width="100%">\
      ';

      append_last('#'+folder+'-full', new_image_div);

      var new_text_div = document.createElement('div');
      new_text_div.setAttribute('class', folder+"-full text-container four columns");
      new_text_div.innerHTML = '\
        <p class="'+folder+'-full full-text">'+text+'</p>\
      ';

      append_last('#'+folder+'-full', new_text_div);
    }

    newFullSection(folder, full_path, text_blocks[0]);

    // try to pull in other images (e.g. full1.png, full2.png, etc...)
    var full_path_part = "images-" + root + "/" + folder + "/full";
    var current_img = 1;
    var current_path = full_path_part + current_img + ".png";

    // while we still have images to load
    while ( UrlExists(current_path) ) {
      // append those images (and text) to the div
      var new_text = "";
      if (text_blocks[current_img]) {
        new_text = text_blocks[current_img];
      }
      newFullSection(folder, current_path, new_text);

      // bump up the image number
      current_img = current_img + 1;
      current_path = full_path_part + current_img + ".png";
    }

    // append the div
    append_last("#fulls", full_images_div);

    // append back button
    var back_button = document.createElement('a');
    back_button.setAttribute("class", "back-button");
    back_button.setAttribute("href", "#");
    back_button.setAttribute("onclick", "back_button()");
    back_button.textContent = "back";

    append_last("."+folder+"-full.text-container", back_button);

  });
}

// when the document has been loaded
document.addEventListener('DOMContentLoaded', function(){

  folder_loaders("packaging", imagesObj["packaging"]);
  folder_loaders("posters", imagesObj["posters"]);

});