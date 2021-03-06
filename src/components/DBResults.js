import React, { Component } from "react";
import {
  GridList,
  GridTile,
  IconButton,
  Dialog,
  FlatButton,
  Checkbox,
  Snackbar
} from "material-ui";

import {
  ZoomIn,
  ActionFavorite,
  ActionFavoriteBorder
} from "material-ui/svg-icons";

export default class DBResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: [],
      Id_image: "",
      Name_image: "",
      Category_image: "",
      img_url: "",
      open: false,
      openSnackBar: false
    };
  }

  componentDidMount() {
    this.displayData();
  }

  displayData() {
    fetch("http://localhost/React-searcher-pixabay/src/api/")
      .then(res => res.json())
      .then(resJSON => {
        this.setState({
          db: resJSON
        });
      });
  }

  handleOpen = img => {
    this.setState({ open: true, img_url: img });
  };

  handleClose = img => {
    this.setState({ open: false, img_url: img });
  };

  removeData = Id_image => {
    fetch("http://localhost/React-searcher-pixabay/src/api/DB_Delete.php", {
      method: "POST",
      headers: {
        // 'Accept': 'application/json',
        // 'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Id_image: Id_image
      })
    })
      .then(res => res.json())
      .then(resJSON => {
        this.displayData();
        this.setState({
          openSnackBar: true
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    let imageListContent;

    if (this.state.db) {
      imageListContent = (
        <GridList cols={4} style={{ margin: "0px" }}>
          {this.state.db.map(img => (
            <GridTile
              className="dbresults-image"
              title={img.Category_image}
              key={img.Id_image}
              subtitle={
                <span>
                  by: <strong>{img.Name_image}</strong>
                </span>
              }
              actionIcon={
                <div className="action-btns">
                  <Checkbox
                    checked={img.Id_image ? true : false}
                    onClick={() => this.removeData(img.Id_image)}
                    checkedIcon={<ActionFavorite style={{ fill: "red" }} />}
                    uncheckedIcon={
                      <ActionFavoriteBorder style={{ fill: "red" }} />
                    }
                  />
                  <IconButton onClick={() => this.handleOpen(img.img_url)}>
                    <ZoomIn color="white" />
                  </IconButton>
                </div>
              }
            >
              <img src={img.img_url} alt={img.Name_image} />
            </GridTile>
          ))}
        </GridList>
      );
    } else {
      imageListContent = null;
    }

    const actions = [
      <FlatButton label="Close" primary={true} onClick={this.handleClose} />
    ];

    return (
      <div>
        <h1 style={{ textAlign: "center", color: "rgb(0,188,212)" }}>
          My Favourites
        </h1>
        {imageListContent}
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <img src={this.state.img_url} alt="" style={{ width: "100%" }} />
        </Dialog>
        <Snackbar
          open={this.state.openSnackBar}
          message="Picture removed from your favourites"
          autoHideDuration={3000}
        />
      </div>
    );
  }
}
