        <div className="space-y-6">
          {/* Connection Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Hardware Detection Status</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isWebSocketConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isWebSocketConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </div>
            </div>
            
            {currentDevice?.location && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">Location</h4>
                  <p className="text-2xl font-bold text-blue-600">{currentDevice.location}</p>
                </div>
                
                {locationStatus[currentDevice.location] && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">Total Detected</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {locationStatus[currentDevice.location].total_detected}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">Validated</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {locationStatus[currentDevice.location].validated_count}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
            
            <div className="mt-4 flex space-x-2">
              <Button
                label="Refresh Detection Data"
                onClick={() => {
                  if (currentDevice?.location) {
                    actions.refreshData(true, currentDevice.location);
                  }
                }}
                disabled={loading}
                variant="secondary"
              />
              
              {currentDevice?.location && (
                <>
                  <Button
                    label="Sync Inventory"
                    onClick={() => actions.syncLocationInventory(currentDevice.location)}
                    disabled={loading}
                    variant="secondary"
                  />
                  
                  <Button
                    label="Setup Inventory"
                    onClick={() => actions.setupLocationInventory(currentDevice.location)}
                    disabled={loading}
                    variant="secondary"
                  />
                </>
              )}
            </div>
          </div>

          {/* Recent Detections */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Hardware Detections</h3>
            
            {hardwareDetections.length > 0 ? (
              <div className="space-y-3">
                {hardwareDetections.slice(0, 10).map((detection) => (
                  <div key={detection.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          detection.is_validated 
                            ? 'bg-green-500' 
                            : detection.is_expected 
                            ? 'bg-blue-500' 
                            : 'bg-yellow-500'
                        }`}></div>
                        
                        <div>
                          <h4 className="font-medium">
                            {detection.hardware_name || detection.detected_class}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Type: {detection.hardware_type} | 
                            Confidence: {(detection.confidence * 100).toFixed(1)}% |
                            Location: {detection.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!detection.is_validated && (
                          <>
                            <Button
                              label="✓"
                              onClick={() => actions.validateDetection(detection.id, true, 'Validated from dashboard')}
                              className="text-green-600 hover:bg-green-50"
                              variant="secondary"
                              size="sm"
                            />
                            <Button
                              label="✗"
                              onClick={() => actions.validateDetection(detection.id, false, 'Rejected from dashboard')}
                              className="text-red-600 hover:bg-red-50"
                              variant="secondary"
                              size="sm"
                            />
                          </>
                        )}
                      </div>
                    </div>
                    
                    {detection.condition_status && (
                      <div className="mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          detection.condition_status === 'good' 
                            ? 'bg-green-100 text-green-800'
                            : detection.condition_status === 'damaged'
                            ? 'bg-red-100 text-red-800'
                            : detection.condition_status === 'missing'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {detection.condition_status}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hardware detections found for this location.</p>
                <p className="text-sm mt-2">
                  Make sure the camera detection system is running and connected.
                </p>
              </div>
            )}
          </div>

          {/* Detection Summary */}
          {detectionSummaries.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Detection Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {detectionSummaries.map((summary) => (
                  <div key={summary.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{summary.location}</h4>
                    <div className="space-y-1 text-sm">
                      <p>Total Detections: <span className="font-medium">{summary.total_detections}</span></p>
                      <p>Validated: <span className="font-medium">{summary.validated_detections}</span></p>
                      <p>Hardware Types: <span className="font-medium">{summary.unique_hardware_types}</span></p>
                      <p>Good Condition: <span className="font-medium text-green-600">{summary.good_condition}</span></p>
                      <p>Damaged: <span className="font-medium text-red-600">{summary.damaged_condition}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>