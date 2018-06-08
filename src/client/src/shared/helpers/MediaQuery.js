import Constants from 'constants/Constants';


/*

MediaQuery shall be used in the following manner:

  The user calls MediaQuery.create to generate media queries,
  the argument to create is a mediaQueryRecipes array which
  is made up of media query recipes each of which is an
  object with the following properties:
    * property - the css property that the recipe is used to make
    * function - the MediaQuery function or user provided one which provides
                 a suitable CSS attribute to be used for the media queries,
                 which is called to make the recipe
    * args - the args for ALL the media features for that recipe like {sizes: [[400, 150], [300, 100]], unit: 'px',}
             for the args for column widths for example, each of which corresponds to a media query feature

    * getMediaFeatureArgs - the function provided by the user which maps the args for the recipe to the args
                            for the specific media feature.

                            The signature for this function should match the following
                              (args, index) -> argsForFeature
                            Where argsForFeature must match whichever args each MediaQuery function expects.

                  NOTE: the args will be evaluated in the same order as that of the features in Constants.Layout.MediaQuery

                            Therefore, the index will be provided in that order, however this does not mean that
                            the user function must match this order for its args, only that the index will be GIVEN
                            in this order, thus the args array could be in a completely different order, as long as the

                            getMediaFeatureArgs function includes a mapping from the index to the user array index.

                            The simplest, and likely easiest to use and read, of such mappings is the identity function,
                            that is: f(x) = x. But, there may be some cases where a different mapping may be desired.



  The following is an example of using MediaQuery, which follows all of the instructions
  given above for its use, but is provided to illuminate the situation in a way which
  descriptions alone may be inadequate for.


  const gridRowMediaQueries = MediaQuery.create([
    {
      property: 'grid-template-columns',
      function: MediaQuery.gridColumnArrayToSizes,
      args: {
        sizes: Object.values(Header.gridColumns.sizes),
        unit: Header.gridColumnUnit,
      },
      recipeArgsGetter: (args, index) => {
        return {
          sizes: args.sizes[index],
          unit: args.unit,
        };
      },
    },
  ]);


*/

class MediaQuery {

  static numberToSize(argsObject) {
    return MediaQuery.arrayAndUnitToSizes(
      {...argsObject, sizes: [argsObject.size], }
    );
  }

  static arrayAndUnitToSizes(argsObject) {
    const sizes = argsObject.sizes;
    const unit = argsObject.unit;

    if (sizes.length > 0 && !(Array.isArray(sizes) && Number.isFinite(sizes[0]))) {
        console.log('Error: Invalid Args to arrayAndUnitToSizes!'); // only reached upon user (of MediaQuery) error
        return '';
   } else {
      return sizes.map(size => {
        return size + unit;
      }).reduce((acc, value) => {
        return acc + ' ' + value;
      }, '');
   }
  };



  static create(mediaQueryRecipes) {

      if (mediaQueryRecipes.length <= 0) {
        return '';
      }

      function getMediaHeaderWidthBased(label) {
        switch(label) {
          case Constants.Layout.MediaQuery.LargeDesktop:
            return ' @media only screen and (min-width: 1601px) { ';
          case Constants.Layout.MediaQuery.MediumDesktop:
            return ' @media only screen and (min-width: 1201px) and (max-width: 1600px) { ';
          case Constants.Layout.MediaQuery.SmallDesktop:
            return ' @media only screen and (min-width: 980px) and (max-width: 1200px) { ';
          case Constants.Layout.MediaQuery.LandscapeTablet:
            return ' @media only screen and (min-width: 768px) and (max-width: 979px) { ';
          case Constants.Layout.MediaQuery.PortraitTablet:
            return ' @media only screen and (min-width: 481px) and (max-width: 767px) { ';
          case Constants.Layout.MediaQuery.LandscapePhone:
            return ' @media only screen and (min-width: 321px) and (max-width: 480px) { ';
          case Constants.Layout.MediaQuery.PortraitPhone:
            return ' @media only screen and (max-width: 320px) { ';
          default:
            return '';
        }
      }

      function getMediaHeaderHeightBased(label) {
        switch(label) {
          case Constants.Layout.MediaQuery.LargeDesktop:
            return ' @media only screen and (min-height: 901px) { ';
          case Constants.Layout.MediaQuery.MediumDesktop:
            return ' @media only screen and (min-height: 676px) and (max-height: 900px) { ';
          case Constants.Layout.MediaQuery.SmallDesktop:
            return ' @media only screen and (min-height: 551px) and (max-height: 675px) { ';
          case Constants.Layout.MediaQuery.LandscapeTablet:
            return ' @media only screen and (min-height: 432px) and (max-height: 550px) { ';
          case Constants.Layout.MediaQuery.PortraitTablet:
            return ' @media only screen and (min-height: 271px) and (max-height: 431px) { ';
          case Constants.Layout.MediaQuery.LandscapePhone:
            return ' @media only screen and (min-height: 181px) and (max-height: 270px) { ';
          case Constants.Layout.MediaQuery.PortraitPhone:
            return ' @media only screen and (max-height: 180px) { ';
          default:
            return '';
        }
      }

      function getMediaHeader(label, heightBased) {
        if (heightBased) {
          return getMediaHeaderHeightBased(label);
        } else {
          return getMediaHeaderWidthBased(label);
        }
      }

      const widthBasedMediaQueryRecipes = mediaQueryRecipes.filter((value) => {
        return !value.heightBased;
      });

      const heightBasedMediaQueryRecipes = mediaQueryRecipes.filter((value) => {
        return value.heightBased;
      });


      const widthBasedMediaQueries = Object.values(Constants.Layout.MediaQuery).map(label => {

        const mediaQueryHeader = getMediaHeader(label, false);

        const mediaQueryBody = widthBasedMediaQueryRecipes.map(recipe => {
            return recipe.property + ': '
              + recipe.function(recipe.recipeArgsGetter(recipe.args, label))
              + ';';
        }).reduce((acc, property) => {
            return acc + property;
        }, '');

        const mediaQueryFooter = ' } '

        return mediaQueryHeader + mediaQueryBody + mediaQueryFooter;
      }).reduce((acc, query) => {
        return acc + query;
      }, '');

      const heightBasedMediaQueries = Object.values(Constants.Layout.MediaQuery).map(label => {

        const mediaQueryHeader = getMediaHeader(label, true);

        const mediaQueryBody = heightBasedMediaQueryRecipes.map(recipe => {
            return recipe.property + ': '
              + recipe.function(recipe.recipeArgsGetter(recipe.args, label))
              + ';';
        }).reduce((acc, property) => {
            return acc + property;
        }, '');

        const mediaQueryFooter = ' } '

        return mediaQueryHeader + mediaQueryBody + mediaQueryFooter;
      }).reduce((acc, query) => {
        return acc + query;
      }, '');

      return widthBasedMediaQueries + heightBasedMediaQueries;
  }
}

/*
  This code is here for historical purposes, and will eventually be removed,
  its purpose for the moment is to illustrate the value of abstraction and
  functional programming. Its functionality was implemented abstractly
  using functional programming in about 50% of the lines of code
  in addition, its use has been reduced to about 15 lines of code for the
  user of the create function. And the amount of work needed to add
  new media queries has similarily been dramatically reduced from a massive
  amount of copy and paste, followed by at least 30 minutes of editing to
  fit the specific use case, all of which resulted in a waste of developer
  time (as well as lowered moral and psychological fitness).

  The old approach also made the code very brittle and difficult to change,
  due to the aforementioned issues.

// const gridColumn = (colNum, screenSize) => {
//   switch(screenSize) {
//     case Constants.Layout.MediaQuery.PortraitPhone:
//       return Header.gridColumnsPortraitPhone[colNum] +
//         Header.gridColumnUnit;
//
//     case Constants.Layout.MediaQuery.LandscapePhone:
//       return Header.gridColumnsLandscapePhone[colNum] +
//         Header.gridColumnUnit;
//
//     case Constants.Layout.MediaQuery.PortraitTablet:
//       return Header.gridColumnsPortraitTablet[colNum] +
//         Header.gridColumnUnit;
//
//     case Constants.Layout.MediaQuery.LandscapeTablet:
//       return Header.gridColumnsLanscapeTablet[colNum] +
//         Header.gridColumnUnit;
//
//     case Constants.Layout.MediaQuery.SmallDesktop:
//       return Header.gridColumnsSmallDesktop[colNum] +
//         Header.gridColumnUnit;
//
//     case Constants.Layout.MediaQuery.MediumDesktop:
//       return Header.gridColumnsMediumDesktop[colNum] +
//         Header.gridColumnUnit;
//
//     case Constants.Layout.MediaQuery.LargeDesktop:
//       return Header.gridColumnsLargeDesktop[colNum] +
//         Header.gridColumnUnit;
//
//     default:
//     return '10000px';
//       // return Header.gridColumns[colNum] +
//       //   Header.gridColumnUnit;
//   }
// };
//
//  /* Large Desktops */
//   @media only screen
//   and (min-width: 1601px) {
//
//     grid-template-columns:
//     ${gridColumn(0, Constants.Layout.MediaQuery.LargeDesktop)}
//     ${gridColumn(1, Constants.Layout.MediaQuery.LargeDesktop)}
//   }
//
//
//
//   /* Large Laptops / Medium Desktops */
//   @media only screen
//     and (min-width: 1201px)
//     and (max-width: 1600px)
//     {
//
//     grid-template-columns:
//     ${gridColumn(0, Constants.Layout.MediaQuery.MediumDesktop)}
//     ${gridColumn(1, Constants.Layout.MediaQuery.MediumDesktop)}
//   }
//
//   /* Small Desktop/Laptop */
//   @media only screen
//     and (min-width: 980px)
//     and (max-width: 1200px)
//     {
//
//     grid-template-columns:
//     ${gridColumn(0, Constants.Layout.MediaQuery.SmallDesktop)}
//     ${gridColumn(1, Constants.Layout.MediaQuery.SmallDesktop)}
//   }
//
//   /* Landscape Tablet */
//   @media only screen
//   and (min-width: 768px)
//   and (max-width: 979px) {
//
//     grid-template-columns:
//     ${gridColumn(0, Constants.Layout.MediaQuery.LandscapeTablet)}
//     ${gridColumn(1, Constants.Layout.MediaQuery.LandscapeTablet)}
//   }
//
//   /*  Portrait Tablet */
//   @media only screen
//   and (max-width: 767px)
//   and (min-width: 481px) {
//
//     grid-template-columns:
//     ${gridColumn(0, Constants.Layout.MediaQuery.PortraitTablet)}
//     ${gridColumn(1, Constants.Layout.MediaQuery.PortraitTablet)}
//   }
//
//   /* Landscape phones */
//   @media only screen
//     and (max-width: 480px)
//     and (min-width: 321px) {
//
//     grid-template-columns:
//     ${gridColumn(0, Constants.Layout.MediaQuery.LandscapePhone)}
//     ${gridColumn(1, Constants.Layout.MediaQuery.LandscapePhone)}
//   }
//
//   /* Portrait phones */
//   @media only screen
//   and (max-width: 320px) {
//     grid-template-columns:
//     ${gridColumn(0, Constants.Layout.MediaQuery.PortraitPhone)}
//     ${gridColumn(1, Constants.Layout.MediaQuery.PortraitPhone)}
//   }


export default MediaQuery;
