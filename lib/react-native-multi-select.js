import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  UIManager,
  LayoutAnimation,
  Platform,
  ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import reject from 'lodash/reject';
import find from 'lodash/find';
import get from 'lodash/get';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconIonic from 'react-native-vector-icons/Ionicons';

// set UIManager LayoutAnimationEnabledExperimental
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

import styles, { colorPack } from './styles';
export default class MultiSelect extends Component {
  static propTypes = {
    single: PropTypes.bool,
    selectedItems: PropTypes.array,
    items: PropTypes.array.isRequired,
    uniqueKey: PropTypes.string,
    tagBorderColor: PropTypes.string,
    tagTextColor: PropTypes.string,
    fontFamily: PropTypes.string,
    tagRemoveIconColor: PropTypes.string,
    onSelectedItemsChange: PropTypes.func.isRequired,
    selectedItemFontFamily: PropTypes.string,
    selectedItemTextColor: PropTypes.string,
    itemFontFamily: PropTypes.string,
    itemTextColor: PropTypes.string,
    itemFontSize: PropTypes.number,
    selectedItemIconColor: PropTypes.string,
    searchInputPlaceholderText: PropTypes.string,
    searchInputStyle: PropTypes.object,
    selectText: PropTypes.string,
    altFontFamily: PropTypes.string,
    hideSubmitButton: PropTypes.bool,
    submitButtonColor: PropTypes.string,
    submitButtonText: PropTypes.string,
    textColor: PropTypes.string,
    fontSize: PropTypes.number,
    fixedHeight: PropTypes.bool,
    hideTags: PropTypes.bool,
    onChageInput: PropTypes.func,
    displayKey: PropTypes.string,
    onTouchStart : PropTypes.func,
    onMomentumScrollEnd: PropTypes.func,
    onScrollEndDrag: PropTypes.func,
    onMomentumScrollBegin: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onScrollBeginDrag: PropTypes.func,
    onTouchMove:PropTypes.func,
    onOpenDropdown:PropTypes.func,
    onCloseDropdown:PropTypes.func
  };

  static defaultProps = {
    single: false,
    selectedItems: [],
    items: [],
    uniqueKey: '_id',
    tagBorderColor: colorPack.primary,
    tagTextColor: colorPack.primary,
    fontFamily: '',
    tagRemoveIconColor: colorPack.danger,
    onSelectedItemsChange: () => {},
    selectedItemFontFamily: '',
    selectedItemTextColor: colorPack.primary,
    itemFontFamily: '',
    itemTextColor: colorPack.textPrimary,
    itemFontSize: 14,
    selectedItemIconColor: colorPack.primary,
    searchInputPlaceholderText: 'Search',
    searchInputStyle: { color: colorPack.textPrimary },
    textColor: colorPack.textPrimary,
    selectText: 'Select',
    altFontFamily: '',
    hideSubmitButton: false,
    submitButtonColor: '#CCC',
    submitButtonText: 'Submit',
    fontSize: 14,
    fixedHeight: false,
    hideTags: false,
    onChangeInput: () => {},
    displayKey: 'name'
  };

  constructor(props) {
    super(props);
    this.state = {
      selector: false,
      searchTerm: ''
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log('Component Updating: ', nextProps.selectedItems);
    return true;
  }

  _findItem = itemKey => {
    const { items, uniqueKey } = this.props;
    return find(items, singleItem => singleItem[uniqueKey] === itemKey) || {};
  };

  _onChangeInput = value => {
    const { onChangeInput } = this.props;
    if (onChangeInput) {
      onChangeInput(value);
    }
    this.setState({ searchTerm: value });
  };

  getSelectedItemsExt = optionalSelctedItems => (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}
    >
      {this._displaySelectedItems(optionalSelctedItems)}
    </View>
  );

  _getSelectLabel = () => {
    const {
      selectText,
      single,
      items,
      selectedItems,
      uniqueKey,
      displayKey
    } = this.props;
    if (!selectedItems || selectedItems.length === 0) {
      return selectText;
    } else if (single) {
      const item = selectedItems[0];
      const foundItem = this._findItem(item);
      return get(foundItem, displayKey) || selectText;
    }
    return `${selectText} (${selectedItems.length} selected)`;
  };

  _displaySelectedItems = optionalSelctedItems => {
    const {
      fontFamily,
      tagRemoveIconColor,
      tagBorderColor,
      uniqueKey,
      tagTextColor,
      selectedItems,
      displayKey
    } = this.props;
    const actualSelectedItems = optionalSelctedItems || selectedItems;
    return actualSelectedItems.map(singleSelectedItem => {
      const item = this._findItem(singleSelectedItem);
      if (!item[displayKey]) return null;
      return (
        <View
          style={[
            styles.selectedItem,
            {
              width: item[displayKey].length * 8 + 60,
              justifyContent: 'center',
              height: 40,
              borderColor: tagBorderColor
            }
          ]}
          key={item[uniqueKey]}
        >
          <Text
            style={[
              {
                flex: 1,
                color: tagTextColor,
                fontSize: 14
              },
              fontFamily ? { fontFamily } : {}
            ]}
            numberOfLines={1}
          >
            {item[displayKey]}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this._removeItem(item);
            }}
          >
            <Icon
              name="cancel"
              style={{
                color: tagRemoveIconColor,
                fontSize: 22,
                marginLeft: 10
              }}
            />
          </TouchableOpacity>
        </View>
      );
    });
  };

  _removeItem = item => {
    const { uniqueKey, selectedItems, onSelectedItemsChange } = this.props;
    const newItems = reject(
      selectedItems,
      singleItem => item[uniqueKey] === singleItem
    );
    // broadcast new selected items state to parent component
    onSelectedItemsChange(newItems);
  };

  _removeAllItems = () => {
    const { onSelectedItemsChange } = this.props;
    // broadcast new selected items state to parent component
    onSelectedItemsChange([]);
  };

  _toggleSelector = () => {
    const {onOpenDropdown,onCloseDropdown} = this.props;
    if (!this.state.selector){
      console.log("Selector openned");
      if(onOpenDropdown) onOpenDropdown()  
    } else {
      console.log("Selector closed");
      if(onCloseDropdown) onCloseDropdown()
    }
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      selector: !this.state.selector
    });
    if (this.props.onToggleSelector) {
        this.props.onToggleSelector(!this.state.selector);
    }
  };

  _submitSelection = () => {
    const { onSelectedItemsChange } = this.props;
    this._toggleSelector();
    // reset searchTerm
    this.setState({ searchTerm: '' });
  };

  _itemSelected = item => {
    const { uniqueKey, selectedItems } = this.props;
    return !!find(selectedItems, singleItem => item[uniqueKey] === singleItem);
  };

  _toggleItem = item => {
    const {
      single,
      uniqueKey,
      selectedItems,
      onSelectedItemsChange
    } = this.props;
    if (single) {
      this._submitSelection();
      onSelectedItemsChange([item]);
    } else {
      const status = this._itemSelected(item);
      let newItems = [];
      if (status) {
        newItems = reject(
          selectedItems,
          singleItem => item[uniqueKey] === singleItem
        );
      } else {
        newItems = [...selectedItems, item[uniqueKey]];
      }
      // broadcast new selected items state to parent component
      onSelectedItemsChange(newItems);
    }
  };

  _itemStyle = item => {
    const {
      selectedItemFontFamily,
      selectedItemTextColor,
      itemFontFamily,
      itemTextColor,
      itemFontSize
    } = this.props;
    const isSelected = this._itemSelected(item);
    const fontFamily = {};
    if (isSelected && selectedItemFontFamily) {
      fontFamily.fontFamily = selectedItemFontFamily;
    } else if (!isSelected && itemFontFamily) {
      fontFamily.fontFamily = itemFontFamily;
    }
    const color = isSelected
      ? { color: selectedItemTextColor }
      : { color: itemTextColor };
    return {
      ...fontFamily,
      ...color,
      fontSize: itemFontSize
    };
  };

  _getRow = item => {
    const { selectedItemIconColor, displayKey } = this.props;
    return (
      <TouchableOpacity
        disabled={item.disabled}
        onPress={() => this._toggleItem(item)}
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={[
                {
                  flex: 1,
                  fontSize: 14,
                  paddingTop: 5,
                  paddingBottom: 5
                },
                this._itemStyle(item),
                item.disabled ? { color: 'grey' } : {}
              ]}
            >
              {item[displayKey]}
            </Text>
            {this._itemSelected(item) ? (
              <Icon
                name="check"
                style={{
                  fontSize: 20,
                  color: selectedItemIconColor
                }}
              />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _filterItems = searchTerm => {
    const { items, displayKey } = this.props;
    const filteredItems = [];
    items.forEach(item => {
      const parts = searchTerm.trim().split(/[ \-:]+/);
      const regex = new RegExp(`(${parts.join('|')})`, 'ig');
      if (regex.test(get(item, displayKey))) {
        filteredItems.push(item);
      }
    });
    return filteredItems;
  };

  _renderItems = () => {
    const { items, fontFamily, uniqueKey, selectedItems ,onMomentumScrollEnd , onTouchStart , onScrollEndDrag , onMomentumScrollBegin , onTouchEnd , onScrollBeginDrag , onTouchMove} = this.props;
    const { searchTerm } = this.state;
    let component = null;
    const renderItems = searchTerm
      ? this._filterItems(searchTerm.trim())
      : items;
    if (renderItems.length) {
      component = (
        <FlatList
          onMomentumScrollEnd = {onMomentumScrollEnd}
          onTouchStart = {onTouchStart}
          onScrollEndDrag = {onScrollEndDrag}
          onMomentumScrollBegin = {onMomentumScrollBegin}
          onTouchEnd = {onTouchEnd}
          data={renderItems}
          extraData={selectedItems}
          keyExtractor={item => item[uniqueKey]}
          renderItem={rowData => this._getRow(rowData.item)}
          onScrollBeginDrag = {onScrollBeginDrag}
          onTouchMove = {onTouchMove}
          contentContainerStyle={{ paddingBottom: 60}}
        />
        /*<ScrollView
          onMomentumScrollEnd = {onMomentumScrollEnd}
          onTouchStart = {onTouchStart}
          onScrollEndDrag = {onScrollEndDrag}
          onMomentumScrollBegin = {onMomentumScrollBegin}
          onTouchEnd = {onTouchEnd}
          onScrollBeginDrag = {onScrollBeginDrag}>
          {renderItems.map((rowData)=> this._getRow(rowData))}
        </ScrollView>*/
      );
    } else {
      component = (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                textAlign: 'center',
                color: colorPack.danger
              },
              fontFamily ? { fontFamily } : {}
            ]}
          >
            Нет совпадений
          </Text>
        </View>
      );
    }
    return component;
  };

  render() {
    const {
      selectedItems,
      single,
      fontFamily,
      altFontFamily,
      searchInputPlaceholderText,
      searchInputStyle,
      hideSubmitButton,
      submitButtonColor,
      submitButtonText,
      fontSize,
      textColor,
      fixedHeight,
      hideTags
    } = this.props;
    const { selector } = this.state;
    return (
      <View
        style={{
          borderWidth: 2,
          borderColor: '#c7c7c7',
          borderRadius: 8,
          height: Platform.OS == 'ios' ? 40 : undefined
        }}
      >
        {selector ? (
          <View style={styles.selectorView(fixedHeight)}>
            <View style={styles.inputGroup}>
              <TextInput
                onChangeText={this._onChangeInput}
                placeholder={searchInputPlaceholderText}
                placeholderTextColor={colorPack.placeholderTextColor}
                underlineColorAndroid="transparent"
                style={[searchInputStyle, { flex: 1, paddingHorizontal: 20, height: 36, fontSize: 14 }]}
              />
              {hideSubmitButton && (
                <TouchableOpacity onPress={this._submitSelection}>
                  <Icon
                    name="keyboard-arrow-down"
                    style={[
                      styles.indicator
                    ]}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                backgroundColor: 'white',
                borderWidth: Platform.OS == 'ios' ? 2 : 0,
                borderColor: '#c7c7c7',
                borderRadius: 8,
                zIndex: 9
              }}
            >
              <View>{this._renderItems()}</View>
              {!single &&
                !hideSubmitButton && (
                  <TouchableOpacity
                    onPress={() => this._submitSelection()}
                    style={[
                      styles.button,
                      { backgroundColor: submitButtonColor }
                    ]}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        fontFamily ? { fontFamily } : {}
                      ]}
                    >
                      {submitButtonText}
                    </Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.dropdownView}>
              <View
                style={[
                  styles.subSection
                ]}
              >
                <TouchableWithoutFeedback onPress={this._toggleSelector}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      height: 36,
                      alignItems: 'center'
                    }}
                  >
                    <Text
                      style={[
                        {
                          flex: 1,
                          fontSize: fontSize || 14,
                          color: textColor || colorPack.placeholderTextColor,
                          paddingHorizontal: 20
                        },
                        altFontFamily
                          ? { fontFamily: altFontFamily }
                          : fontFamily ? { fontFamily } : {}
                      ]}
                      numberOfLines={1}
                    >
                      {this._getSelectLabel()}
                    </Text>
                    <Icon
                      name={
                        hideSubmitButton
                          ? 'keyboard-arrow-down'
                          : 'keyboard-arrow-up'
                      }
                      style={styles.indicator}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            {!single && !hideTags && selectedItems.length ? (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap'
                }}
              >
                {this._displaySelectedItems()}
              </View>
            ) : null}
          </View>
        )}
      </View>
    );
  }
}
