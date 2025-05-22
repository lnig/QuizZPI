import React, { useState, useEffect } from 'react';

interface ButtonProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl',                   // size of the button
  type?: 'primary' | 'secondary' | 'tertiary' | 'icon',   // type of the button
  btnType?: 'button' | 'submit' | 'reset',                // type of the button element
  primaryColor?: string,                                  // primary color of the button
  secondaryColor?: string,                                // secondary color of the button
  tertiaryColor?: string,                                 // tertiary color of the button
  hoverPrimaryColor?: string,                             // primary color of the button on hover  
  hoverSecondaryColor?: string,                           // secondary color of the button on hover
  width?: string,                                         // width of the button
  text?: string,                                          // text of the button                 
  Icon?: React.ElementType,                               // icon of the button              
  onClick?: React.MouseEventHandler<HTMLButtonElement>,   // click event handler
  disabled?: boolean                                      // if the button is disabled
}

const Button: React.FC<ButtonProps> = ({
  size = 'm',
  type = 'primary',
  btnType = 'button',
  primaryColor = '#EB4C60',
  secondaryColor = '#FFFFFF',
  tertiaryColor = '#ff94a1',
  hoverPrimaryColor = '#d94354',
  hoverSecondaryColor = '#f3f3f3',
  width = 'w-fit',
  text,
  Icon,
  onClick,
  disabled = false,
}) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
    xs: 'px-3 text-xs h-7',
    s:  'px-3 text-xs h-8',
    m:  'px-4 text-sm h-9',
    l:  'px-5 text-base h-11',
    xl: 'px-6 text-lg h-12',
  };

  const iconSizeMapping: Record<NonNullable<ButtonProps['size']>, { height: string, width: string, iconSize: number }> = {
    xs: { height: 'h-7',  width: 'w-7',  iconSize: type === 'icon' ? 14 : 12 },
    s:  { height: 'h-8',  width: 'w-8',  iconSize: type === 'icon' ? 16 : 14 },
    m:  { height: 'h-9',  width: 'w-9',  iconSize: type === 'icon' ? 18 : 16 },
    l:  { height: 'h-11', width: 'w-11', iconSize: type === 'icon' ? 20 : 18 },
    xl: { height: 'h-12', width: 'w-12', iconSize: type === 'icon' ? 24 : 22 },
  };

  const getBaseStyle = (): React.CSSProperties => {
    const btnTypeStyle: React.CSSProperties = {};

    switch (type) {
      case 'primary':
        btnTypeStyle.backgroundColor = primaryColor;
        btnTypeStyle.color = secondaryColor;
        break;
      case 'secondary':
        btnTypeStyle.backgroundColor = 'transparent';
        btnTypeStyle.border = `1px solid ${primaryColor}`;
        btnTypeStyle.color = primaryColor;
        break;
      case 'tertiary':
        btnTypeStyle.backgroundColor = 'transparent';
        btnTypeStyle.color = primaryColor;
        btnTypeStyle.textDecoration = 'underline';
        break;
      case 'icon':
        btnTypeStyle.backgroundColor = 'transparent';
        btnTypeStyle.color = primaryColor;
        btnTypeStyle.padding = '0';
        btnTypeStyle.border = `1px solid ${primaryColor}`;
        break;
      default:
        btnTypeStyle.backgroundColor = primaryColor;
        btnTypeStyle.color = secondaryColor;
    }

    return btnTypeStyle;
  };

  const handleMouseEnter = () => {
    const hoverStyle: React.CSSProperties = { ...style };

    switch (type) {
      case 'primary':
        hoverStyle.backgroundColor = hoverPrimaryColor;
        hoverStyle.color = hoverSecondaryColor;
        break;
      case 'secondary':
        hoverStyle.color = hoverPrimaryColor;
        break;
      case 'tertiary':
      
        break;
      case 'icon':
        hoverStyle.transform = 'scale(1.1)';
        break;
        default:
    }
    if (type === 'primary') {
      hoverStyle.backgroundColor = hoverPrimaryColor;
      hoverStyle.color = hoverSecondaryColor;
    } else if (type === 'secondary') {
      hoverStyle.color = hoverPrimaryColor;
    } else

    setStyle(hoverStyle);
  };

  const handleMouseLeave = () => {
    setStyle(getBaseStyle());
  };

  useEffect(() => {
    setStyle(getBaseStyle());
  }, [primaryColor, secondaryColor, tertiaryColor, type]);

  const baseClasses = type === 'icon' ?
    `rounded flex items-center justify-center hover:cursor-pointer ${iconSizeMapping[size].height} ${iconSizeMapping[size].width} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}` :
    `rounded flex items-center justify-center gap-2 ${width} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ' hover:cursor-pointer'}`;

  const renderContent = () => {
    if (Icon && text) {
      return (
        <>
          <Icon style={{ color: style.color }} size={iconSizeMapping[size].iconSize} />
          {text}
        </>
      );
    } else if (Icon) {
      return <Icon style={{ color: style.color }} size={iconSizeMapping[size].iconSize} />;
    } else {
      return text;
    }
  };

  return (
    <button
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      type={btnType}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderContent()}
    </button>
  );
};

export default Button;