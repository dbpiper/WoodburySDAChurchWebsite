import { css } from 'styled-components';

import Colors from 'constants/Colors';
import Constants from 'constants/Constants';

const textboxBackground = css`

    background-color: ${Colors.textboxBackground};
    padding: ${Constants.Textbox.padding}${Constants.Textbox.paddingUnit};

      -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
         -moz-box-sizing: border-box;    /* Firefox, other Gecko */
              box-sizing: border-box;         /* Opera/IE 8+ */
`;

export default textboxBackground;
