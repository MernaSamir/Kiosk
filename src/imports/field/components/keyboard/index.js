import React, { Component } from "react";
import Keyboard from "react-simple-keyboard";
import { get } from 'lodash'
import BasicComponent from 'helpers/components/basic'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import 'react-simple-keyboard/build/css/index.css'
// eslint-disable-next-line no-unused-vars
import style from './styles.less'
// import './style.css'
const layout = {
    'en': {
        'default': [
            '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
            '{tab} q w e r t y u i o p [ ] \\',
            '{lock} a s d f g h j k l ; {enter}',
            '{shift} z x c v b n m , . / @',
            '.com {space} {clear} {Ar/En}'
        ],
        'shift': [
            '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
            '{tab} Q W E R T Y U I O P { } |',
            '{lock} A S D F G H J K L : " {enter}',
            '{shift} Z X C V B N M < > ? @',
            '.com {space} {clear} {Ar/En}'
        ],
        'lock': [
            '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
            '{tab} Q W E R T Y U I O P { } |',
            '{lock} A S D F G H J K L : " {enter}',
            '{shift} Z X C V B N M < > ? @',
            '.com {space} {clear} {Ar/En}'
        ],
        'numeric': [
            '1 2 3',
            '4 5 6',
            '7 8 9',
            '< 0 .',
        ]
    },
    'ar': {
        'default': [
            'ذ 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
            '{tab} ض ص ث ق ف غ ع ه خ ح ج د',
            '{lock} ش س ي ب ل ا ت ن م ك ط \\ {enter}',
            '{shift} ئ ء ؤ ر لا ى ة و ز ظ @',
            '.com {space} {clear} {Ar/En}'
        ],
        'shift': [
            'ّ ! @ # $ % ^ & * ( ) _ + {bksp}',
            '{tab} َ ً ُ ٌ لإ إ ‘ ÷ × ؛ < >',
            '{lock} ِ ٍ ] [ لأ أ ـ ، / : " | {enter}',
            '{shift} ~ ْ } لآ آ ’ , . ؟ @',
            '.com {space} {clear} {Ar/En}'
        ],
        'lock': [
            'ذ 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
            '{tab} ض ص ث ق ف غ ع ه خ ح ج د',
            '{lock} ش س ي ب ل ا ت ن م ك ط \\ {enter}',
            '{shift} ئ ء ؤ ر لا ى ة و ز ظ @',
            '.com {space} {clear} {Ar/En}'
        ],
    },
    
}



class KeyboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            language: "en",
            mode: 'default'
        };

    }

    setRefrence = (props) => {
        this.keyboardRef && this.keyboardRef.keyboard.setInput(props.field.value);
    }
    reset = (props = this.props) => {
        props.setAll([{
            type: "reset_all_bottom_sheet",
            data: {}
        }])
    }
    compare = {
        field: {
            compare: ['field.value'],
            action: this.setRefrence
        }
    }
    onChange = (value) => {
        const { field, target, onClick } = this.props;
        (onClick || field.onChange)({
            target: {
                name: target || field.name,
                value
            }
        })
    }
    onKeyPress = (button) => {
        if (button == "{Ar/En}") {
            this.handelanguage();
        }
        if (button === "{shift}") {
            this.handleShift();
        }
        else if (button === "{lock}") {
            this.handelLock();
        }

        else if (button === "{clear}") {
            this.onChange('');
        }

        else if (button === "{enter}") {
            const { submitting = true } = this.props
            if (submitting) {
                this.props.form.submitForm();
            }
            this.reset()
        }
    };
    handelanguage = () => {
        const { language } = this.state;
        language == 'en' ?
            this.setState({
                language: 'ar'
            }) : this.setState({
                language: 'en'
            })
    }
    handelLock = () => {
                const { mode } = this.state

        this.setState({
            mode: (mode === "default") ? "lock" : "default"
        });
    }
    handleShift = () => {
        const { mode } = this.state
        this.setState({
            mode: mode === "default" ? "shift" : "default"
        });
    }

    inputStyle = {
        width: "100%",
        height: "100px",
        padding: "10px",
        fontSize: 20,
        border: 0
    };
    // changeKeyboardInput() {
    //     // const { langName, mode } = this.state;

    //     const { target, form, fieldValue = get(form.values, target, '') } = this.props;
    //     // if (mode === 'shiftE' && fieldValue.length == 1) {
    //     //     this.setState({
    //     //         langName: "English"

    //     //     });
    //     // }
    // }

    render() {
        const { language, mode } = this.state
        if (window.cordova) {
            return <div></div>
        }
        return (
            <BasicComponent {...this.props} compare={this.compare}>
                <div style={this.props.style}>
                    <div >
                        <Keyboard
                            preventMouseDownDefault={false}
                            stopMouseDownPropagation={false}
                            useButtonTag={true}
                            disableButtonHold={true}
                            physicalKeyboardHighlight={true}
                            useMouseEvents={false}
                            display={{
                                '{bksp}': 'DEL',
                                '{enter}': 'ENTER',
                                '{shift}': 'SHIFT',
                                '{tab}': 'TAB',
                                '{lock}': 'Caps Lock',
                                '{clear}': 'Clean',
                                '{Ar/En}': "Ar/En",
                                '{space}': ' ',

                            }}
                            ref={r => { this.keyboardRef = r }}
                            layoutName={this.props.numeric ? "numeric" : mode}
                            layout={get(layout, `${language}`, layout.en)}
                            onChange={this.onChange}
                            onKeyPress={this.onKeyPress.bind(this)}
                            theme={"hg-theme-default hg-layout-default key_style"}
                        />
                    </div>
                </div>
            </BasicComponent>
        );
    }
}

export default connect(null, mapDispatchToProps)(KeyboardComponent)

