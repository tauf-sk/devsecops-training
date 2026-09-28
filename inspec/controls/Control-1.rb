describe docker.containers do
    its('images') { should include 'testapp:app-latest' }
  end