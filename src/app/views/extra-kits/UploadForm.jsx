import { useState } from "react";
import { Breadcrumb, SimpleCard } from "@gull";
import { Button, Card, Row, Col, ProgressBar } from "react-bootstrap";

const UploadForm = () => {
  const [state, setState] = useState({
    dragClass: "",
    files: [],
    statusList: [],
    queProgress: 0,
  });

  const handleFileSelect = (event) => {
    let files = event.target.files;
    let list = [];

    for (const iterator of files) {
      list.push({
        file: iterator,
        uploading: false,
        error: false,
        progress: 0,
      });
    }

    setState((prevState) => ({
      ...prevState,
      files: [...list],
    }));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setState((prevState) => ({ ...prevState, dragClass: "drag-shadow" }));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.persist();

    let files = event.dataTransfer.files;
    let list = [];

    for (const iterator of files) {
      list.push({
        file: iterator,
        uploading: false,
        error: false,
        progress: 0,
      });
    }

    setState((prevState) => ({
      ...prevState,
      dragClass: "",
      files: [...list],
    }));

    return false;
  };

  const handleDragStart = (event) => {
    setState((prevState) => ({
      ...prevState,
      dragClass: "drag-shadow",
    }));
  };

  const handleSingleRemove = (index) => {
    let files = [...state.files];
    files.splice(index, 1);
    setState((prevState) => ({
      ...prevState,
      files: [...files],
    }));
  };

  const handleAllRemove = () => {
    setState((prevState) => ({
      ...prevState,
      files: [],
      queProgress: 0,
    }));
  };

  const uploadSingleFile = (index) => {
    let allFiles = [...state.files];
    let file = state.files[index];

    allFiles[index] = { ...file, uploading: true, error: false };

    setState((prevState) => ({
      ...prevState,
      files: [...allFiles],
    }));
  };

  const uploadAllFile = () => {
    let allFiles = [];

    state.files.map((item) => {
      allFiles.push({
        ...item,
        uploading: true,
        error: false,
      });

      return item;
    });

    setState((prevState) => ({
      ...prevState,
      files: [...allFiles],
      queProgress: 35,
    }));
  };

  const handleSingleCancel = (index) => {
    let allFiles = [...state.files];
    let file = state.files[index];

    allFiles[index] = { ...file, uploading: false, error: true };

    setState((prevState) => ({
      ...prevState,
      files: [...allFiles],
    }));
  };

  const handleCancelAll = () => {
    let allFiles = [];

    state.files.map((item) => {
      allFiles.push({
        ...item,
        uploading: false,
        error: true,
      });

      return item;
    });

    setState((prevState) => ({
      ...prevState,
      files: [...allFiles],
      queProgress: 0,
    }));
  };

  let { dragClass, files, queProgress } = state;
  let isEmpty = files.length === 0;

  return (
    <div>
      <Breadcrumb
        routeSegments={[
          { name: "Home", path: "/" },
          { name: "Extra Kits", path: "/extra-kits" },
          { name: "Upload" },
        ]}
      />
      <SimpleCard title="File Upload">
        <div className="d-flex flex-wrap mb-4">
          <label htmlFor="upload-single-file">
            <Button className="btn-rounded" as="span">
              <div className="flex flex-middle">
                <i className="i-Share-on-Cloud"> </i>
                <span>Single File</span>
              </div>
            </Button>
          </label>
          <input
            className="d-none"
            onChange={handleFileSelect}
            id="upload-single-file"
            type="file"
          />
          <div className="px-3"></div>
          <label htmlFor="upload-multiple-file">
            <Button className="btn-rounded" as="span">
              <div className="flex flex-middle">
                <i className="i-Share-on-Cloud "> </i>
                <span>Multiple File</span>
              </div>
            </Button>
          </label>
          <input
            className="d-none"
            onChange={handleFileSelect}
            id="upload-multiple-file"
            type="file"
            multiple
          />
        </div>

        <div
          className={`${dragClass} dropzone mb-4 d-flex justify-content-center align-items-center`}
          onDragEnter={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {isEmpty ? (
            <span>Drop your files here</span>
          ) : (
            <h5 className="m-0">
              {files.length} file{files.length > 1 ? "s" : ""} selected...
            </h5>
          )}
        </div>

        <Card className="mb-4">
          <Row className="align-items-center p-3">
            <Col lg={4} md={4}>
              Name
            </Col>
            <Col lg={1} md={1}>
              Size
            </Col>
            <Col lg={2} md={2}>
              Progress
            </Col>
            <Col lg={1} md={1}>
              Status
            </Col>
            <Col lg={4} md={4}>
              Actions
            </Col>
          </Row>
          <hr className="mt-0 mb-3" />

          {isEmpty && <p className="p-3 py-0">Que is empty</p>}

          {files.map((item, index) => {
            let { file, uploading, error, progress } = item;
            return (
              <Row className="align-items-center px-3" key={file.name}>
                <Col lg={4} md={4} sm={12} xs={12} className="mb-3">
                  {file.name}
                </Col>
                <Col lg={1} md={1} sm={12} xs={12} className="mb-3">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </Col>
                <Col lg={2} md={2} sm={12} xs={12} className="mb-3">
                  <ProgressBar
                    now={progress}
                    variant="success"
                    className="progress-thin"
                  ></ProgressBar>
                </Col>
                <Col lg={1} md={1} sm={12} xs={12} className="mb-3">
                  {error && (
                    <i className="i-Information text-danger text-18"> </i>
                  )}
                </Col>
                <Col lg={4} md={4} sm={12} xs={12} className="mb-3">
                  <div className="d-flex">
                    <Button
                      disabled={uploading}
                      onClick={() => uploadSingleFile(index)}
                    >
                      Upload
                    </Button>
                    <Button
                      className="mx-8"
                      variant="warning"
                      disabled={!uploading}
                      onClick={() => handleSingleCancel(index)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleSingleRemove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </Col>
              </Row>
            );
          })}
        </Card>

        <div>
          <p className="m-0">Queue progress:</p>
          <div className="py-3">
            <ProgressBar
              now={queProgress}
              variant="success"
              className="progress-thin"
            ></ProgressBar>
          </div>
          <div className="flex">
            <Button disabled={isEmpty} onClick={uploadAllFile}>
              Upload All
            </Button>
            <Button
              className="mx-8"
              variant="warning"
              disabled={isEmpty}
              onClick={handleCancelAll}
            >
              Cancel All
            </Button>
            {!isEmpty && (
              <Button variant="danger" onClick={handleAllRemove}>
                Remove All
              </Button>
            )}
          </div>
        </div>
      </SimpleCard>
    </div>
  );
};

export default UploadForm;
