describe docker.containers.where { names == 'testapp-run' } do
  it { should be_running }
end